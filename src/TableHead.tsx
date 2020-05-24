import React from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { isNil } from 'lodash'

import { SortType } from './DataTable'
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
    // SelectAll을 하고 data를 직접 핸들링 하는 시점에 selected data를 처리한다.
    setIsSelectAll(!isSelectAll)
  }

  const onChangeSortOption = (e: any) => {
    const selector = e.target.dataset.sortfield
    if (isNil(selector)) {
      return
    }

    const isAlreadySorted = sortOption?.[0] === selector

    if (isNil(sortOption) || !isAlreadySorted) {
      setSortOption([selector, SortType.ASC])
      return
    }

    setSortOption([selector, sortOption[1] === SortType.ASC ? SortType.DESC : SortType.ASC])
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
            {column.sortable && !isNil(sortOption) && sortOption[0] === column.selector
              ? getSortIcon(sortOption[1])
              : null}
          </th>
        ))}
      </tr>
    </thead>
  )
}