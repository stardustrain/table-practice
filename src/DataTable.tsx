import './DataTable.scss'

import React, { useState, useEffect } from 'react'
import { chunk, isNil, find, orderBy, get, isFunction } from 'lodash'

import TableHead from './TableHead'
import Pagination from './Pagination'

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
}

export const DEFAULT_PAGE_CHUNK_SIZE = 10
const selectedData = new Map()
const DEFAULT_CURRENT_PAGE_INDEX = 0
const SORT_FIELD_NAME = 0
const SORT_TYPE = 1
export enum SortType {
  ASC = 'asc',
  DESC = 'desc',
}

interface ChunkedDataParams {
  data: any[]
  pageChunkSize: number
}

const getChunkedData = ({ data, pageChunkSize }: ChunkedDataParams) => chunk(data, pageChunkSize)
const getSortOption = (defaultSortField?: string, sortableColumn?: string): [string, SortType] | null => {
  const sortField = defaultSortField ?? sortableColumn
  return isNil(sortField) ? null : [sortField, SortType.ASC]
}
const getSortedData = (data: any[], sortOption: [string, SortType]) =>
  orderBy(data, [sortOption[SORT_FIELD_NAME]], [sortOption[SORT_TYPE]])

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
}: Props) {
  // Select rows
  const [selectedDataSize, setSelectedDataSize] = useState(0)
  const [isSelectAll, setIsSelectAll] = useState(false)
  // Data sorting
  const [sortOption, setSortOption] = useState<[string, SortType] | null>(
    getSortOption(defaultSortField, find(columns, ['sortable', true])?.selector)
  )
  const [sortedData, setSortedData] = useState(sortOption ? getSortedData(data, sortOption) : data)
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
    setChunkedData(
      getChunkedData({
        data: sortedData,
        pageChunkSize,
      })
    )
  }, [pageChunkSize, sortedData])

  useEffect(() => {
    setSortedData(sortOption ? getSortedData(data, sortOption) : data)
  }, [sortOption])

  useEffect(() => {
    setCurrentData(pagination ? chunkedData[currentPageIndex] : sortedData)
  }, [chunkedData, currentPageIndex, pagination])

  return (
    <section>
      <h1>{title}</h1>
      <p>{isSelectAll ? data.length : selectedDataSize} item selected</p>
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
            {currentData.map((d, index) => (
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
          totalSize={data.length}
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
