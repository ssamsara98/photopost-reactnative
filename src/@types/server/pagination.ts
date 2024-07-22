/* pagination */
// export type Pagination = {
//   count: number;
//   hasNext: boolean;
// };
export type PaginationMeta = {
  page: number;
  limit: number;
  count: number;
  itemCount: number;
  totalPages: number;
};
export type PaginationCursorMeta = {
  cursor: number;
  limit: number;
  itemCount: number;
  hasNext: boolean;
};

// export type PaginationResp<R, P = Pagination> = {
//   pagination: P;
//   result: R;
// };
export type PaginationResp<M = any, I = any> = {
  meta: M;
  items: I[];
};
