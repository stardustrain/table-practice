import './DataTable.scss'

import React, { useState, useEffect } from 'react'
import { chunk } from 'lodash'

import Pagination from './Pagination'

declare function selector(row: any): string

interface DataTableColumns {
  name: string
  selector: string | typeof selector
}

interface Props {
  title?: string
  columns: DataTableColumns[]
  data: any[]
  isLoading?: boolean
  selectableRows?: boolean
  isDisableSelectAll?: boolean
  noTableHead?: boolean
  pagination?: boolean
}

export const DEFAULT_PAGE_CHUNK_SIZE = 10
const selectedData = new Map()
const DEFAULT_CURRENT_PAGE_INDEX = 0

interface ChunkedDataParams {
  data: any[]
  pageChunkSize: number
}

const getChunkedData = ({ data, pageChunkSize }: ChunkedDataParams) => chunk(data, pageChunkSize)

export default function DataTable({
  title,
  columns,
  data,
  isLoading,
  selectableRows,
  isDisableSelectAll,
  noTableHead,
  pagination,
}: Props) {
  const [selectedDataSize, setSelectedDataSize] = useState(0)
  const [isSelectAll, setIsSelectAll] = useState(false)
  const [pageChunkSize, setPageChunkSize] = useState(DEFAULT_PAGE_CHUNK_SIZE)
  const [chunkedData, setChunkedData] = useState(
    getChunkedData({
      data,
      pageChunkSize,
    })
  )
  const [currentPageIndex, setCurrentPageIndex] = useState(DEFAULT_CURRENT_PAGE_INDEX)
  const [currentData, setCurrentData] = useState<any[]>(pagination ? chunkedData[currentPageIndex] : data)

  const onSelectAll = () => {
    // SelectAll을 하고 data를 직접 핸들링 하는 시점에 selected data를 처리한다.
    setIsSelectAll(!isSelectAll)
  }

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

  const onClick = (id: string) => {
    toggleSelectedData(id)
  }

  useEffect(() => {
    setChunkedData(
      getChunkedData({
        data,
        pageChunkSize,
      })
    )
  }, [pageChunkSize])

  useEffect(() => {
    setCurrentData(pagination ? chunkedData[currentPageIndex] : data)
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
            <thead>
              <tr>
                {selectableRows ? (
                  <th>{isDisableSelectAll ? null : <input type="checkbox" onChange={onSelectAll} />}</th>
                ) : null}
                <th>Index</th>
                {columns.map(column => (
                  <th key={column.name}>{column.name}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody onChange={onChange}>
            {currentData.map((d, index) => (
              <tr key={d.id} onClick={() => onClick(d.id)}>
                {selectableRows ? (
                  <td>
                    <input type="checkbox" value={d.id} checked={isSelectAll || selectedData.get(d.id)} />
                  </td>
                ) : null}
                <td>{index + 1 + pageChunkSize * currentPageIndex}</td>
                {columns.map(column => {
                  return (
                    <td key={column.name}>
                      {typeof column.selector === 'string' ? d[column.selector] : column.selector(d)}
                    </td>
                  )
                })}
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
