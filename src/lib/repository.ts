import { LocalStorageRepository, type ProgressRepository } from './storage'

// Đổi dòng này sang SupabaseRepository khi sẵn sàng (xem PROJECT.md, mục "Việc tiếp theo").
export const repository: ProgressRepository = new LocalStorageRepository()
