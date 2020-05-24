import { isNil, chunk, orderBy, find, first } from 'lodash'
import type { DataTableColumn } from '../DataTable'
import { SortType, SORT_FIELD_NAME, SORT_TYPE } from '../constants'

interface ChunkedDataParams {
  data: any[]
  pageChunkSize: number
}
export const getChunkedData = ({ data, pageChunkSize }: ChunkedDataParams) => chunk(data, pageChunkSize)

export const getSortOption = (defaultSortField?: string, sortableColumn?: string): [string, SortType] | null => {
  const sortField = defaultSortField ?? sortableColumn
  return isNil(sortField) ? null : [sortField, SortType.ASC]
}

export const getSortedData = (data: any[], sortOption: [string, SortType] | null) =>
  sortOption ? orderBy(data, [sortOption[SORT_FIELD_NAME]], [sortOption[SORT_TYPE]]) : data

export const getSearchKeywordData = (searchKeyword: string) => {
  const isIncludeColumnName = /\w\:\w/.test(searchKeyword)
  if (isIncludeColumnName) {
    return searchKeyword.split(':')
  }

  return [, searchKeyword]
}

interface GetSearchColumnSelectorParam {
  columns: DataTableColumn[]
  columnName?: string
  defaultSearchField?: string
}
export const getSearchColumnSelector = ({ columns, columnName, defaultSearchField }: GetSearchColumnSelectorParam) => {
  if (!isNil(defaultSearchField)) {
    return find(columns, column => column.name.toLowerCase() === defaultSearchField.toLowerCase())?.selector
  }

  if (columnName) {
    return find(columns, column => column.name.toLowerCase() === columnName.toLowerCase())?.selector
  }

  return first(columns)?.selector
}
