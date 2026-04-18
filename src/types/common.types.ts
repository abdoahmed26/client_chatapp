/** Generic wrapper for paginated API responses. */

export interface PaginationMeta {
  currentPage: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
export type IPaginatedResponse<K extends string, T> = {
  [P in K]: T[];
} & {
  pagination: PaginationMeta;
};