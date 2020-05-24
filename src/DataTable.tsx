import './DataTable.scss'

import React, { useState, useEffect } from 'react'
import { isNil, find, get, isFunction } from 'lodash'

import {
  getChunkedData,
  getSearchColumnSelector,
  getSearchKeywordData,
  getSortOption,
  getSortedData,
} from './utils/dataTableHelper'
import { SortType } from './constants'

import TableHead from './TableHead'
import Pagination from './Pagination'
import SearchInput from './SearchInput'

export interface DataTableColumn {
  name: string
  selector: string
  sortable?: boolean
  render?: (data: any) => React.ReactNode
}

interface Props {
  title?: string
  columns: DataTableColumn[]
  data: any[]
  isLoading?: boolean
  selectableRows?: boolean
  isDisableSelectAll?: boolean
  noTableHead?: boolean
  pagination?: boolean
  defaultSortField?: string
  searchable?: boolean
  defaultSearchField?: string
}

const selectedData = new Map()
export const DEFAULT_PAGE_CHUNK_SIZE = 10
const DEFAULT_CURRENT_PAGE_INDEX = 0

export default function DataTable({
  title,
  columns,
  data,
  isLoading,
  selectableRows,
  isDisableSelectAll,
  noTableHead,
  pagination,
  defaultSortField,
  searchable,
  defaultSearchField,
}: Props) {
  const [searchKeyword, setSearchKeyword] = useState<string | null>(null)
  // Select rows
  const [selectedDataSize, setSelectedDataSize] = useState(0)
  const [isSelectAll, setIsSelectAll] = useState(false)
  // Data sorting
  const [sortOption, setSortOption] = useState<[string, SortType] | null>(
    getSortOption(defaultSortField, find(columns, ['sortable', true])?.selector)
  )
  const [sortedData, setSortedData] = useState(getSortedData(data, sortOption))
  // Pagination
  const [pageChunkSize, setPageChunkSize] = useState(DEFAULT_PAGE_CHUNK_SIZE)
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_CURRENT_PAGE_INDEX)
  // Select displaying data
  const [chunkedData, setChunkedData] = useState(
    pagination
      ? getChunkedData({
          data: sortedData,
          pageChunkSize,
        })
      : sortedData
  )
  const [currentData, setCurrentData] = useState<any[]>(pagination ? chunkedData[currentPageIndex] : sortedData)

  const toggleSelectedData = (key: string) => {
    if (selectedData.get(key)) {
      selectedData.delete(key)
    } else {
      selectedData.set(key, true)
    }

    setSelectedDataSize(selectedData.size)
  }

  const onChange = (e: any) => {
    toggleSelectedData(e.target.value)
  }

  useEffect(() => {
    if (isNil(searchKeyword)) {
      return
    }

    if (!searchKeyword) {
      setSortedData(getSortedData(data, sortOption))
      return
    }

    const [columnName, keyword] = getSearchKeywordData(searchKeyword)
    const searchColumnSelector = getSearchColumnSelector({ columns, columnName, defaultSearchField })
    if (searchColumnSelector) {
      setSortedData(
        getSortedData(
          data.filter(data => get(data, searchColumnSelector).toLowerCase() === keyword?.toLowerCase()),
          sortOption
        )
      )
    }
    // eslint-disable-next-line
  }, [searchKeyword])

  useEffect(() => {
    setChunkedData(
      getChunkedData({
        data: sortedData,
        pageChunkSize,
      })
    )
    // eslint-disable-next-line
  }, [pageChunkSize, sortedData])

  useEffect(() => {
    setSortedData(getSortedData(data, sortOption))
    // eslint-disable-next-line
  }, [sortOption])

  useEffect(() => {
    setCurrentData(pagination ? chunkedData[currentPageIndex] : sortedData)
    // eslint-disable-next-line
  }, [chunkedData, currentPageIndex, pagination])

  return (
    <section>
      <h1>{title}</h1>
      <p>{isSelectAll ? data.length : selectedDataSize} item selected</p>
      {searchable ? <SearchInput setSearchKeyword={setSearchKeyword} /> : null}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table>
          {noTableHead ? null : (
            <TableHead
              isSelectAll={isSelectAll}
              selectableRows={selectableRows}
              isDisableSelectAll={isDisableSelectAll}
              sortOption={sortOption}
              columns={columns}
              setIsSelectAll={setIsSelectAll}
              setSortOption={setSortOption}
            />
          )}
          <tbody onChange={onChange}>
            {currentData?.map((d, index) => (
              <tr key={d.id}>
                {selectableRows ? (
                  <td>
                    <input type="checkbox" value={d.id} checked={isSelectAll || selectedData.get(d.id)} />
                  </td>
                ) : null}
                <td>{index + 1 + pageChunkSize * currentPageIndex}</td>
                {columns.map(({ name, selector, render }) => (
                  <td key={name}>{isFunction(render) ? render(d) : get(d, selector)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {pagination ? (
        <Pagination
          totalSize={sortedData.length}
          pageChunkSize={pageChunkSize}
          currentPageIndex={currentPageIndex}
          chunkedDataLength={chunkedData.length}
          setPageChunkSize={setPageChunkSize}
          setCurrentPageIndex={setCurrentPageIndex}
        />
      ) : null}
    </section>
  )
}
