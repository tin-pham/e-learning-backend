import { SelectQueryBuilder } from 'kysely';
import { PaginateDTO } from '../dto/paginate.dto';

export async function paginate(query: SelectQueryBuilder<any, any, any>, dto: PaginateDTO) {
  const { limit, page } = dto;

  const response = await query.execute();
  const totalItems = response.length;

  const offset = (page - 1) * limit;
  query = query.limit(limit).offset(offset);

  const data = await query.execute();

  // get total page
  const totalPage = Math.ceil(totalItems / limit);

  return {
    data,
    meta: {
      itemsPerPage: limit,
      totalItems,
      totalPage,
      currentPage: offset / limit + 1,
    },
  };
}
