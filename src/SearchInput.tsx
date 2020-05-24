import React from 'react'
import type { Dispatch, SetStateAction, ChangeEvent } from 'react'
import { debounce } from 'lodash'

interface Props {
  setSearchKeyword: Dispatch<SetStateAction<string | null>>
}

export default function SearchInput({ setSearchKeyword }: Props) {
  const debouncedSetSearchKeyword = debounce((keyword: string) => setSearchKeyword(keyword), 300)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchKeyword(e.target.value)
  }

  return (
    <label>
      Search:
      <input type="text" onChange={handleChange} placeholder="Input 'keyword' or 'column:keyword'" />
    </label>
  )
}
