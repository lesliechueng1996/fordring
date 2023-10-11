import { SelectQueryBuilder } from 'typeorm';

export function withPageQuery<T>(
  queryBuilder: SelectQueryBuilder<T>,
  currentPage: number,
  pageSize: number,
) {
  return queryBuilder.limit(pageSize).offset((currentPage - 1) * pageSize);
}

export function withOrderQuery<T>(
  queryBuilder: SelectQueryBuilder<T>,
  sortField: string | null | undefined,
  sortOrder: 'DESC' | 'ASC' | '' | null | undefined,
) {
  if (sortField && sortOrder) {
    return queryBuilder.orderBy(sortField, sortOrder);
  }
  return queryBuilder;
}

export function withPageAndOrderQuery<T>(
  queryBuilder: SelectQueryBuilder<T>,
  currentPage: number,
  pageSize: number,
  sortField: string | null | undefined,
  sortOrder: 'DESC' | 'ASC' | '' | null | undefined,
) {
  return withOrderQuery(
    withPageQuery(queryBuilder, currentPage, pageSize),
    sortField,
    sortOrder,
  );
}
