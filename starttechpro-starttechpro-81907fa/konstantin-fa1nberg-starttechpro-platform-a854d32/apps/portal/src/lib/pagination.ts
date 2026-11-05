/**
 * Pagination — утилита для пагинации API-ответов
 */

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResult {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

/**
 * Парсинг параметров пагинации из URL
 */
export function parsePaginationParams(
  searchParams: URLSearchParams,
  defaults: { page?: number; pageSize?: number } = {}
): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get("page") || String(defaults.page || 1), 10))
  const pageSize = Math.min(
    100,
    Math.max(1, parseInt(searchParams.get("pageSize") || String(defaults.pageSize || 20), 10))
  )
  return { page, pageSize }
}

/**
 * Создание результата пагинации
 */
export function createPaginationResult(
  params: PaginationParams,
  total: number
): PaginationResult {
  const totalPages = Math.ceil(total / params.pageSize)
  return {
    page: params.page,
    pageSize: params.pageSize,
    total,
    totalPages,
    hasNext: params.page < totalPages,
    hasPrev: params.page > 1,
  }
}

/**
 * Получение диапазона SQL LIMIT/OFFSET
 */
export function getSqlRange(params: PaginationParams): { limit: number; offset: number } {
  return {
    limit: params.pageSize,
    offset: (params.page - 1) * params.pageSize,
  }
}