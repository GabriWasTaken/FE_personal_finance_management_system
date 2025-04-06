import React from 'react'
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useNavigate } from "react-router";
import { addAccount } from '@/services/account';
import { useErrorManager } from '@/hooks/useErrorManager';
import i18next from 'i18next';
import { toast } from "sonner"

function Accounts({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>> }) {
  type ColDef = {
    id: string,
    name: string,
  }
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleError = useErrorManager();

  const mutation = useMutation({
    mutationKey: ['/accounts'],
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/accounts'] });
      toast.error("account added");
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      toast.error("Error adding account");
    },
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formdata = new FormData(form);
    const name = formdata.get('name') as string;
    mutation.mutate({name, handleError});
    form.reset();
  }

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
      <form onSubmit={handleSubmit}>
        <input type='text' name='name' />
        <Button type='submit' variant='secondary'>{i18next.t('Common.add')}</Button>
      </form>
      <TableServerSide columns={columns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Accounts