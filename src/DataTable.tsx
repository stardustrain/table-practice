import './DataTable.scss'

import React, { useState } from 'react'

declare function selector(args: any): string

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
}

const selectedData = new Map()

export default function DataTable({
  title,
  columns,
  data,
  isLoading,
  selectableRows,
  isDisableSelectAll,
  noTableHead,
}: Props) {
  const [selectedDataSize, setSelectedDataSize] = useState(0)
  const [isSelectAll, setIsSelectAll] = useState(false)

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
                {columns.map(column => (
                  <th key={column.name}>{column.name}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody onChange={onChange}>
            {data.map(d => (
              <tr key={d.id} onClick={() => onClick(d.id)}>
                {selectableRows ? (
                  <td>
                    <input type="checkbox" value={d.id} checked={isSelectAll || selectedData.get(d.id)} />
                  </td>
                ) : null}
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
    </section>
  )
}
