import './App.scss'
import React, { useState } from 'react'

import DataTable from './DataTable'

import cats from './cats.json'

type Cat = typeof cats[number]

const columns = [
  {
    name: 'Name',
    selector: (cat: Cat) => cat.breeds[0].name,
  },
  {
    name: 'Origin',
    selector: (cat: Cat) => cat.breeds[0].origin,
  },
  {
    name: 'ID',
    selector: 'id',
  },
  {
    name: 'URL',
    selector: 'url',
  },
]

function App() {
  const [isLoading, setIsLoading] = useState(false)
  const [selectableRows, setselectableRows] = useState(false)
  const [isDisableSelectAll, setIsDisableSelectAll] = useState(false)
  const [noTableHead, setNoTableHead] = useState(false)
  const [pagination, setPagination] = useState(false)

  return (
    <div className="App">
      <div>
        <label>
          <input type="checkbox" onChange={() => setIsLoading(!isLoading)} />
          Simulate Loading State
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" onChange={() => setselectableRows(!selectableRows)} />
          Selectable Rows
        </label>
        {selectableRows ? (
          <>
            <label>
              <input type="checkbox" onChange={() => setIsDisableSelectAll(!isDisableSelectAll)} />
              Disable Select All Rows
            </label>
            <label>
              <input type="checkbox" onChange={() => setNoTableHead(!noTableHead)} />
              No Table Head
            </label>
          </>
        ) : null}
      </div>
      <div>
        <label>
          <input type="checkbox" onChange={() => setPagination(!pagination)} checked={pagination} />
          Pagination
        </label>
      </div>
      <DataTable
        title="Cat list"
        columns={columns}
        data={cats}
        isLoading={isLoading}
        selectableRows={selectableRows}
        isDisableSelectAll={isDisableSelectAll}
        noTableHead={noTableHead}
        pagination={pagination}
      />
    </div>
  )
}

export default App
