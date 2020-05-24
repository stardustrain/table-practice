import React from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { isNil } from 'lodash'

import { SortType, SORT_TYPE, SORT_FIELD_SELECTOR_NAME } from './constants'
import type { DataTableColumn } from './DataTable'

interface Props {
  isSelectAll: boolean
  selectableRows?: boolean
  isDisableSelectAll?: boolean
  sortOption: [string, SortType] | null
  columns: DataTableColumn[]
  setIsSelectAll: Dispatch<SetStateAction<Props['isSelectAll']>>
  setSortOption: Dispatch<SetStateAction<Props['sortOption']>>
}

const getSortIcon = (sortType: SortType) => (sortType === SortType.ASC ? '⬆' : '⬇')

export default function TableHead({
  isSelectAll,
  selectableRows,
  isDisableSelectAll,
  sortOption,
  columns,
  setSortOption,
  setIsSelectAll,
}: Props) {
  const onSelectAll = () => {
    // NOTE: SelectAll을 하고 data를 직접 핸들링 하는 시점에 selected data를 처리한다.
    setIsSelectAll(!isSelectAll)
  }

  const onChangeSortOption = (e: any) => {
    const selector = e.target.dataset.sortfield
    if (isNil(selector)) {
      return
    }

    const isAlreadySorted = sortOption?.[SORT_FIELD_SELECTOR_NAME] === selector

    if (isNil(sortOption) || !isAlreadySorted) {
      setSortOption([selector, SortType.ASC])
      return
    }

    setSortOption([selector, sortOption[SORT_TYPE] === SortType.ASC ? SortType.DESC : SortType.ASC])
  }

  return (
    <thead>
      <tr onClick={onChangeSortOption}>
        {selectableRows ? (
          <th>{isDisableSelectAll ? null : <input type="checkbox" onChange={onSelectAll} />}</th>
        ) : null}
        <th>Index</th>
        {columns.map(column => (
          <th key={column.name} data-sortfield={column.sortable && !isNil(sortOption) && column.selector}>
            {column.name}{' '}
            {column.sortable && !isNil(sortOption) && sortOption[SORT_FIELD_SELECTOR_NAME] === column.selector
              ? getSortIcon(sortOption[SORT_TYPE])
              : null}
          </th>
        ))}
      </tr>
    </thead>
  )
}
