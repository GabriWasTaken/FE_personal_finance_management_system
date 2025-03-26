import React, { useEffect } from 'react'
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useLocation } from 'react-router';
function Financials( {dataQuery, pagination, setPagination}: {dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>>} ) {
  type ColDef = {
    name: string,
    account_name: string,
    amount: number,
    date: string,
    description: string,
    tag?: string,
    subtag?: string
  }

  const location = useLocation();
  const locationState = (location.state);

  useEffect(() => {
    if (locationState) {
      setPagination((old) => ({ ...old, id_account: locationState.id_account }));
    }
  }, [locationState]);

  const mutation = useMutation({
    mutationFn: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      return fetch( import.meta.env.VITE_BASE_URL + '/fiancials', { method: 'POST' })
    },
    onSuccess: () => {
      dataQuery.refetch();
    },
    onError: () => {
      //TODO insert error msg
    },
  })

  const columns = React.useMemo<ColumnDef<ColDef>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <div>name</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.name}</div>
        },
      },
      {
        accessorKey: "account",
        header: () => <div>account</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.account_name}</div>
        },
      },
      {
        accessorKey: "amount",
        header: () => <div>amount</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.amount}</div>
        },
      },
    ],
    []
  )
  return (
    <>
      <form onSubmit={mutation.mutate}>
        <input type='text' name='name'/>
        <Button type='submit'></Button>
      </form>
      <TableServerSide columns={columns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Financials