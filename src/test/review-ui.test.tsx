import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { StoreProvider } from '../lib/store'
import { emptyState, LocalStorageRepository } from '../lib/storage'
import type { CardState, ProgressState } from '../types'

async function setup(seed?: Partial<ProgressState>) {
  const repo = new LocalStorageRepository('rev-' + Math.random(), window.localStorage)
  if (seed) await repo.save({ ...emptyState(), ...seed })
  render(
    <StoreProvider repo={repo}>
      <MemoryRouter initialEntries={['/on-tap']}><App /></MemoryRouter>
    </StoreProvider>,
  )
  return repo
}
const user = () => userEvent.setup()
const setNew = async (u: ReturnType<typeof userEvent.setup>, n: string) =>
  u.selectOptions(await screen.findByLabelText('Từ mới mỗi phiên'), n)
const lone = async (repo: LocalStorageRepository) => Object.values((await repo.load()).cards)

beforeEach(() => window.localStorage.clear())

describe('Ôn tập: màn hình chính', () => {
  it('hiện số thẻ, dự báo và mức ghi nhớ', async () => {
    await setup()
    expect(await screen.findByText('Đến hạn ôn')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /dự báo|Biểu đồ số thẻ/i })).toBeInTheDocument()
    expect(screen.getByText(/Mức ghi nhớ \(20 từ\)/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Bắt đầu ôn \(10 thẻ\)/ })).toBeInTheDocument()
  })
})

describe('Ôn tập: phiên ôn tính lịch', () => {
  it('từ mới: xem → trắc nghiệm → đúng → lưu lịch 1 ngày', async () => {
    const u = user()
    const repo = await setup()
    await setNew(u, '1')
    await u.click(screen.getByRole('button', { name: /Bắt đầu ôn \(1 thẻ\)/ }))
    expect(await screen.findByText('Từ mới')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Đã xem, kiểm tra tôi' }))
    expect(await screen.findByText('Chọn nghĩa')).toBeInTheDocument()
    await u.click(screen.getByRole('radio', { name: /đính kèm/ }))
    expect(screen.getByText('Đúng.')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    expect(await screen.findByText('Hoàn thành phiên ôn')).toBeInTheDocument()
    expect(screen.getByText(/đúng ngay lần đầu \(100%\)/)).toBeInTheDocument()
    await waitFor(async () => {
      const [c] = await lone(repo)
      expect(c).toMatchObject({ vocabId: 'em-attach', intervalDays: 1, reps: 1, lapses: 0 })
      const st = await repo.load()
      expect(st.sessions.at(-1)).toMatchObject({ kind: 'review', score: 1, total: 1 })
    })
  })

  it('trả lời sai: ghi quên đúng 1 lần, thẻ quay lại ở dạng "Học lại", đúng thì không ghi thêm', async () => {
    const u = user()
    const repo = await setup()
    await setNew(u, '1')
    await u.click(screen.getByRole('button', { name: /Bắt đầu ôn/ }))
    await u.click(await screen.findByRole('button', { name: 'Đã xem, kiểm tra tôi' }))
    await screen.findByText('Chọn nghĩa')
    const wrong = screen.getAllByRole('radio').find((r) => !/đính kèm/.test(r.textContent ?? ''))!
    await u.click(wrong)
    expect(screen.getByText('Chưa đúng.')).toBeInTheDocument()
    await u.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    // thẻ quay lại ngay (hàng đợi chỉ còn thẻ này)
    expect(await screen.findByText('Học lại')).toBeInTheDocument()
    await waitFor(async () => expect((await lone(repo))[0]).toMatchObject({ lapses: 1, reps: 0 }))
    const q = screen.getByRole('radiogroup')
    await u.click(within(q).getAllByRole('radio').find((r) => /đính kèm|attach/.test(r.textContent ?? ''))!)
    await u.click(screen.getByRole('button', { name: 'Tiếp tục' }))
    expect(await screen.findByText('Hoàn thành phiên ôn')).toBeInTheDocument()
    expect(screen.getByText(/đúng ngay lần đầu \(0%\)/)).toBeInTheDocument()
    expect((await lone(repo))[0]).toMatchObject({ lapses: 1, reps: 0 }) // không bị ghi thêm
    expect(screen.getByText('Từ cần chú ý (1)')).toBeInTheDocument()
  })

  it('kiểu "Gõ từ": gõ đúng nhanh → mức Dễ (3 ngày); gõ sai chính tả 1 ký tự → báo gần đúng', async () => {
    const u = user()
    const repo = await setup()
    await setNew(u, '1')
    await u.selectOptions(screen.getByLabelText('Kiểu ôn'), 'typing')
    await u.click(screen.getByRole('button', { name: /Bắt đầu ôn/ }))
    await u.click(await screen.findByRole('button', { name: 'Đã xem, kiểm tra tôi' }))
    await screen.findByText('Gõ từ')
    await u.type(screen.getByLabelText('Câu trả lời'), 'attach')
    await u.click(screen.getByRole('button', { name: 'Kiểm tra' }))
    expect(screen.getByText('Đúng.')).toBeInTheDocument()
    await waitFor(async () => {
      const c = (await lone(repo))[0]
      expect(c.reps).toBe(1)
      expect(c.intervalDays).toBeGreaterThanOrEqual(2.8) // 3 ngày ± 5% xê dịch
      expect(c.intervalDays).toBeLessThanOrEqual(3.2)
    })
  })

  it('gợi ý + gần đúng → mức Khó, không phải Dễ', async () => {
    const u = user()
    const repo = await setup()
    await setNew(u, '1')
    await u.selectOptions(screen.getByLabelText('Kiểu ôn'), 'typing')
    await u.click(screen.getByRole('button', { name: /Bắt đầu ôn/ }))
    await u.click(await screen.findByRole('button', { name: 'Đã xem, kiểm tra tôi' }))
    await screen.findByText('Gõ từ')
    await u.click(screen.getByRole('button', { name: 'Gợi ý' }))
    expect(screen.getByLabelText('Gợi ý')).toHaveTextContent('a _ _ _ _ _')
    await u.type(screen.getByLabelText('Câu trả lời'), 'atach')
    await u.click(screen.getByRole('button', { name: 'Kiểm tra' }))
    expect(screen.getByText(/Gần đúng/)).toBeInTheDocument()
    await waitFor(async () => expect((await lone(repo))[0]).toMatchObject({ reps: 1, intervalDays: 1 }))
  })

  it('flashcard tự chấm vẫn dùng được', async () => {
    const u = user()
    const repo = await setup()
    await setNew(u, '1')
    await u.selectOptions(screen.getByLabelText('Kiểu ôn'), 'flashcard')
    await u.click(screen.getByRole('button', { name: /Bắt đầu ôn/ }))
    await u.click(await screen.findByRole('button', { name: 'Đã xem, kiểm tra tôi' }))
    await u.click(await screen.findByRole('button', { name: 'Hiện đáp án' }))
    await u.click(screen.getByRole('button', { name: /^Dễ/ }))
    expect(await screen.findByText('Hoàn thành phiên ôn')).toBeInTheDocument()
    await waitFor(async () => {
      const c = (await lone(repo))[0]
      expect(c.reps).toBe(1)
      expect(c.intervalDays).toBeGreaterThanOrEqual(2.8) // 3 ngày ± 5% xê dịch
      expect(c.intervalDays).toBeLessThanOrEqual(3.2)
    })
  })
})

describe('Ôn tập: luyện thêm', () => {
  const learned = (id: string, over: Partial<CardState> = {}): CardState => ({
    vocabId: id, ease: 2.5, intervalDays: 2, reps: 1, lapses: 1, due: '2099-01-01T00:00:00.000Z', lastReviewed: '2026-01-01T00:00:00.000Z', ...over,
  })

  it('không đổi lịch ôn dù trả lời sai', async () => {
    const u = user()
    const before = learned('em-attach')
    const repo = await setup({ cards: { 'em-attach': before } })
    await u.click(await screen.findByRole('button', { name: /Luyện 1 thẻ/ }))
    await screen.findByText(/Luyện thêm \(không đổi lịch ôn\)/)
    const radios = screen.queryAllByRole('radio')
    if (radios.length) await u.click(radios.find((r) => !/đính kèm|attach/.test(r.textContent ?? ''))!)
    else await u.click(screen.getByRole('button', { name: 'Không nhớ' }))
    await u.click(await screen.findByRole('button', { name: 'Tiếp tục' }))
    await u.click(await screen.findByRole('button', { name: 'Kết thúc sớm' }))
    expect(await screen.findByText('Kết thúc luyện thêm')).toBeInTheDocument()
    expect((await repo.load()).cards['em-attach']).toEqual(before)
    expect((await repo.load()).sessions).toHaveLength(0)
  })

  it('chưa học từ nào thì nút luyện thêm bị khóa', async () => {
    await setup()
    expect(await screen.findByRole('button', { name: /Luyện 0 thẻ/ })).toBeDisabled()
  })
})
