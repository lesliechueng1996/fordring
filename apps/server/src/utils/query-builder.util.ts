export function generatePageAndOrderQuery(
  currentPage: number,
  pageSize: number,
  sortField: string | null | undefined,
  sortOrder: 'DESC' | 'ASC' | '' | null | undefined,
): {
  take: number;
  skip: number;
  orderBy?: {
    [key: string]: 'asc' | 'desc';
  };
} {
  const paginationQuery = {
    take: pageSize,
    skip: (currentPage - 1) * pageSize,
  };

  if (sortField && sortOrder) {
    return {
      ...paginationQuery,
      orderBy: {
        [sortField]: sortOrder.toLowerCase() as 'asc' | 'desc',
      },
    };
  }

  return paginationQuery;
}
