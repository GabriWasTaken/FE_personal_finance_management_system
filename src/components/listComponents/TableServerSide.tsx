import React, { useState } from 'react'

import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  PaginationState,
} from '@tanstack/react-table'
import { QueryObserverSuccessResult, QueryObserverPlaceholderResult } from '@tanstack/react-query'
import i18next from 'i18next'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  dataQuery:  QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>
  pagination: PaginationState & { id_account?: string, id_category?: string, sortKey?: string, sortDirection?: string }
  setPagination: React.Dispatch<React.SetStateAction<PaginationState & { id_account?: string, id_category?: string, sortKey?: string, sortDirection?: string }>>
  defaultSort?: {id: string, direction: 'asc' | 'desc' }
}

function TableServerSide<TData, TValue>( {columns, dataQuery, pagination, setPagination, defaultSort}: DataTableProps<TData, TValue> ) {
  const defaultData = React.useMemo(() => [], [])

  const table = useReactTable({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    rowCount: dataQuery.data?.rowCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true, //we're doing manual "server-side" pagination
    defaultColumn: {
      minSize: 60,
      maxSize: 800,
    },
    columnResizeMode: 'onChange',
  });
  const [sorting, setSorting] = useState<{id: string, direction: 'asc' | 'desc' }>(defaultSort || {id: '', direction: 'asc' });

  const columnSizeVars = React.useMemo(() => {
    const headers = table.getFlatHeaders()
    const colSizes: { [key: string]: number } = {}
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i]!
      colSizes[`--header-${header.id}-size`] = header.getSize()
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
    }
    return colSizes
  }, [table.getState().columnSizingInfo, table.getState().columnSizing])

  return (
    <div>
      <div className="h-2" />
      <div
          {...{
            className: 'divTable',
            style: {
              ...columnSizeVars, //Define column sizes on the <table> element
              width: table.getTotalSize(),
            },
          }}
        >
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div className='relative border p-2' style={{ width: `calc(var(--header-${header?.id}-size) * 1px)`}}>
                        <div onClick={ () => {
                          if (header.column.id === "delete") return;
                          const prevSortingDirection = sorting?.id === header.column.id ? sorting.direction : 'asc'
                          setPagination({ ...pagination, sortKey: header.column.id, sortDirection: prevSortingDirection === 'asc' ? 'desc' : 'asc'})
                          const newSorting: {id: string, direction: 'asc' | 'desc' } = { id: header.column.id, direction: prevSortingDirection === 'asc' ? 'desc' : 'asc' };
                          setSorting(newSorting);
                        }}>
                          <div className='flex justify-between'>
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.id === sorting?.id ? sorting.direction === 'asc' ? <ChevronUp /> : <ChevronDown /> : ''}
                          </div>
                        </div>
                        <div className={`resizer ${header.column.getIsResizing() ? ' isResizing' : ''}`} onDoubleClick={header.column.resetSize} onMouseDown={header.getResizeHandler()}></div>
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        {table.getRowModel().rows.length === 0 
          && <tbody><tr><td className='border p-2' colSpan={table.getAllLeafColumns().length}>No results.</td></tr></tbody>
        }
        <tbody>
          {table.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td className='border p-2' key={cell.id} style={{width: `calc(var(--col-${cell.column.id}-size) * 1px)`}}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>{i18next.t('Table.page')}</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | {i18next.t('Table.go_to_page')} :
          <input
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              table.setPageIndex(page)
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => {
            table.setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {i18next.t('Table.rows')} {pageSize}
            </option>
          ))}
        </select>
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
    </div>
  )
}

export default TableServerSide