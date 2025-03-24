import React from 'react'
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useNavigate } from "react-router";

function Accounts( {dataQuery, pagination, setPagination}: {dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>>} ) {
  type ColDef = {
    id: string,
    name: string,
  }
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      return fetch( import.meta.env.VITE_BASE_URL + '/accounts', { method: 'POST', body: JSON.stringify({ name: event.target[0].value }) })
    },
    onSuccess: (result, variables, context) => {
      dataQuery.refetch();
    },
    onError: (error, variables, context) => {
      // Remove optimistic todo from the todos list
      //TODO insert error msg
    },
  })

  const columns = React.useMemo<ColumnDef<ColDef>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <div>name</div>,
        cell: ({ row }) => {
          return <div className="font-medium" onClick={() => navigate('/financials', {
            state: {
              id_account: row.original.id,
            }
          })}>{row.original.name}</div>
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

export default Accounts