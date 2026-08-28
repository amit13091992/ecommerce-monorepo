export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
