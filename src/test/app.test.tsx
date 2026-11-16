import { describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { StoreProvider } from '../lib/store'
import { LocalStorageRepository } from '../lib/storage'

function setup(path = '/') {
  const repo = new LocalStorageRepository('test-' + Math.random(), window.localStorage)
  render(
    <StoreProvider repo={repo}>
      <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
    </StoreProvider>,
  )
  return repo
}

describe('ứng dụng', () => {
  it('hiển thị tổng quan với bài học hôm nay', async () => {
    setup()
    expect(await screen.findByText('Bài học hôm nay')).toBeInTheDocument()
    expect(screen.getByText('Professional Email Writing')).toBeInTheDocument()
  })

  it('danh mục hiển thị 2 chương trình', async () => {
    setup('/chuong-trinh')
    expect(await screen.findByText('Office English')).toBeInTheDocument()
    expect(screen.getByText('Professional Finance English')).toBeInTheDocument()
  })

  it('làm trọn bài tập: trả lời đúng, ghi điểm và đánh dấu hoàn thành', async () => {
    const user = userEvent.setup()
    const repo = setup('/bai/finance-01/bai-tap')
    // 4 trắc nghiệm
    const mcq = ['Favorable, +20', 'Unfavorable, +10', 'mainly due to', 'Say the effect on the full-year forecast']
    for (const a of mcq) {
      await user.click(await screen.findByRole('radio', { name: a }))
      await user.click(screen.getByRole('button', { name: 'Kiểm tra' }))
      await user.click(screen.getByRole('button', { name: 'Câu tiếp' }))
    }
    // 3 điền từ
    for (const a of ['exceeded', 'unfavorable', 'partly']) {
      await user.type(await screen.findByLabelText('Điền từ'), a)
      await user.click(screen.getByRole('button', { name: 'Kiểm tra' }))
      await user.click(screen.getByRole('button', { name: 'Câu tiếp' }))
    }
    // 2 sắp xếp
    for (const sentence of ['Marketing spend was 20% over budget due to an unplanned campaign.', 'We expect a full-year overspend of USD 45k.']) {
      await screen.findByLabelText('Câu của bạn')
      for (const w of sentence.split(' ')) {
        const btns = screen.getAllByRole('button', { name: w }).filter((b) => !(b as HTMLButtonElement).disabled)
        await user.click(btns[0])
      }
      await user.click(screen.getByRole('button', { name: 'Kiểm tra' }))
      await user.click(screen.getByRole('button', { name: 'Câu tiếp' }))
    }
    // luyện viết
    await user.type(await screen.findByLabelText('Bài viết của bạn'),
      'Marketing spend is USD 30k over budget due to an unplanned campaign. We expect a full-year overspend of USD 45k. I recommend freezing new campaigns in Q3 and the marketing lead will confirm by Friday. Thanks.')
    await user.click(screen.getByRole('button', { name: 'Chấm bài' }))
    await user.click(screen.getByRole('button', { name: 'Xem kết quả' }))

    expect(await screen.findByText('10/10 (100%)')).toBeInTheDocument()
    await waitFor(async () => {
      const saved = await repo.load()
      expect(saved.completedLessons).toContain('finance-01')
      expect(saved.sessions[0]).toMatchObject({ kind: 'exercises', score: 10, total: 10 })
      expect(saved.sessions[0].seconds).toBeGreaterThanOrEqual(1)
    })
  })

  it('flashcards: lật thẻ, chấm Nhớ, lưu lịch ôn', async () => {
    const user = userEvent.setup()
    const repo = setup('/on-tap')
    await user.click(await screen.findByRole('button', { name: 'Hiện đáp án' }))
    await user.click(screen.getByRole('button', { name: /^Nhớ/ }))
    await waitFor(async () => {
      const saved = await repo.load()
      const cards = Object.values(saved.cards)
      expect(cards).toHaveLength(1)
      expect(cards[0].intervalDays).toBe(1)
    })
  })
})
