import React, { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'

import { DEFAULT_PAGE_CHUNK_SIZE } from './DataTable'

interface Props {
  pageChunkSize: number
  totalSize: number
  currentPageIndex: number
  chunkedDataLength: number
  setPageChunkSize: Dispatch<SetStateAction<number>>
  setCurrentPageIndex: Dispatch<SetStateAction<number>>
}

const getCurrentRange = ({ currentPageIndex, pageChunkSize, totalSize }: { [key: string]: number }) => {
  const startPageNumber = currentPageIndex * pageChunkSize + 1
  const lastPageNumber = (currentPageIndex + 1) * pageChunkSize

  return `${startPageNumber} - ${lastPageNumber > totalSize ? totalSize : lastPageNumber}`
}
const PAGE_CHUNK_SIZE_OPTIONS = [10, 15, 20, 30]

export default function Pagination({
  pageChunkSize,
  totalSize,
  currentPageIndex,
  chunkedDataLength,
  setPageChunkSize,
  setCurrentPageIndex,
}: Props) {
  const onChange = (e: any) => {
    setPageChunkSize(e.target.value)
  }

  return (
    <div className="Pagination">
      <label>
        Rows per page:
        <select onChange={onChange} defaultValue={DEFAULT_PAGE_CHUNK_SIZE}>
          {PAGE_CHUNK_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
      <div>
        {getCurrentRange({ currentPageIndex, pageChunkSize, totalSize })} of {totalSize}
      </div>
      <ul>
        <li>
          <button onClick={() => setCurrentPageIndex(0)} disabled={currentPageIndex === 0}>
            맨 앞으로
          </button>
        </li>
        <li>
          <button onClick={() => setCurrentPageIndex(currentPageIndex - 1)} disabled={currentPageIndex - 1 < 0}>
            한 페이지 앞으로
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
            disabled={currentPageIndex + 1 >= chunkedDataLength}
          >
            한 페이지 뒤로
          </button>
        </li>
        <li>
          <button
            onClick={() => setCurrentPageIndex(chunkedDataLength - 1)}
            disabled={currentPageIndex === chunkedDataLength - 1}
          >
            맨 뒤로
          </button>
        </li>
      </ul>
    </div>
  )
}
