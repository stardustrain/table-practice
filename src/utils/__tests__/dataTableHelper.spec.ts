import { getSearchColumnSelector, getSearchKeywordData, getSortOption, getSortedData } from '../dataTableHelper'
import { SortType } from '../../constants'

describe('dataTableHelper', () => {
  describe('getSortOption(defaultSortField?: string, sortableColumn?: string): [string, SortType] | null', () => {
    test('should return [selector, SortType.ASC] when received one of valid parameter.', () => {
      expect(getSortOption('defaultSortField')).toEqual(['defaultSortField', SortType.ASC])
      expect(getSortOption('defaultSortField', 'Selector')).toEqual(['defaultSortField', SortType.ASC])
      expect(getSortOption(undefined, 'Selector')).toEqual(['Selector', SortType.ASC])
    })

    test('should return null when received all of invalid parameters.', () => {
      expect(getSortOption()).toEqual(null)
    })
  })

  describe('getSortedData(data: any[], sortOption: [string, SortType] | null): SortedData[]', () => {
    test('should return sorted data array when received sort option.', () => {
      expect(getSortedData([{ name: 'a' }, { name: 'b' }, { name: 'c' }], ['name', SortType.ASC])).toEqual([
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
      ])
      expect(getSortedData([{ name: 'a' }, { name: 'b' }, { name: 'c' }], ['name', SortType.DESC])).toEqual([
        { name: 'c' },
        { name: 'b' },
        { name: 'a' },
      ])
    })

    test('should return received data array when does not pass to sort option.', () => {
      expect(getSortedData([{ name: 'a' }, { name: 'b' }, { name: 'c' }], null)).toEqual([
        { name: 'a' },
        { name: 'b' },
        { name: 'c' },
      ])
    })
  })

  describe('getSearchKeywordData(searchKeyword: string): [(string | undefined), string]', () => {
    test('should return [columnName, string] array when received keyword includes ":" between words.', () => {
      expect(getSearchKeywordData('colName:keyword')).toEqual(['colName', 'keyword'])
      expect(getSearchKeywordData('c:keyword')).toEqual(['c', 'keyword'])
      expect(getSearchKeywordData('colName:k')).toEqual(['colName', 'k'])
    })

    test('should return [undefined, string] array when does not received keyword includes ":" between words.', () => {
      expect(getSearchKeywordData('keyword')).toEqual([undefined, 'keyword'])
      expect(getSearchKeywordData(':keyword')).toEqual([undefined, ':keyword'])
      expect(getSearchKeywordData('colName:')).toEqual([undefined, 'colName:'])
    })
  })

  describe('getSearchColumnSelector({ columns, columnName, defaultSearchField }: GetSearchColumnSelectorParam): string | undefined', () => {
    const columns = [
      {
        name: 'Name',
        selector: 'breeds[0].name',
        sortable: true,
      },
      {
        name: 'Origin',
        selector: 'breeds[0].origin',
      },
      {
        name: 'ID',
        selector: 'id',
      },
      {
        name: 'URL',
        selector: 'url',
        sortable: true,
      },
    ]

    test('should return selector of defaultSearchField when received valid defaultSearchField parameter.', () => {
      expect(
        getSearchColumnSelector({
          columns,
          defaultSearchField: 'Name',
        })
      ).toEqual('breeds[0].name')

      expect(
        getSearchColumnSelector({
          columns,
          columnName: 'ID',
          defaultSearchField: 'Name',
        })
      ).toEqual('breeds[0].name')
    })

    test('should return selector of columnName when received columnName and does not exist defaultSearchField.', () => {
      expect(
        getSearchColumnSelector({
          columns,
          columnName: 'Origin',
        })
      ).toEqual('breeds[0].origin')
    })

    test('should return selector of first element of columns when does not exist columnName and defaultSearchField.', () => {
      expect(
        getSearchColumnSelector({
          columns,
        })
      ).toEqual('breeds[0].name')
    })

    test('should return undefined when received invalid columnName and defaultSearchField.', () => {
      expect(
        getSearchColumnSelector({
          columns,
          defaultSearchField: 'invalidSearchField',
        })
      ).toBeUndefined
      expect(
        getSearchColumnSelector({
          columns,
          columnName: 'invalidSearchField',
        })
      ).toBeUndefined
      expect(
        getSearchColumnSelector({
          columns,
          columnName: 'Name',
          defaultSearchField: 'invalidSearchField',
        })
      ).toEqual('breeds[0].name')
    })
  })
})
