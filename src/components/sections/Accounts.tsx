import React from 'react'
import { ColumnDef, PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { useNavigate } from "react-router";
import { addAccount, deleteAccount } from '@/services/account';
import { useErrorManager } from '@/hooks/useErrorManager';
import i18next from 'i18next';
import { toast } from "sonner"
import { Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../ui/confirmDeleteModal';

function Accounts({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>> }) {
  type ColDef = {
    id: number,
    name: string,
    net_total: string
  }
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const handleError = useErrorManager();
  const [idToDelete, setIdToDelete] = React.useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

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

  const mutationDeleteFinancial = useMutation({
    mutationKey: ['/accountsDelete'],
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/accounts'] });
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      //TODO insert error msg
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

  const handleDeleteFinancial = () => {
    if (idToDelete) {
      mutationDeleteFinancial.mutate({ id: idToDelete, handleError })
      setIdToDelete(undefined);
      setIsDeleteModalOpen(false);
    }
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
      {
        accessorKey: "amount",
        header: () => <div>Amount</div>,
        cell: ({ row }) => {
          return <div className="font-medium" onClick={() => navigate('/financials', {
            state: {
              id_account: row.original.id,
            }
          })}>{Number(row.original.net_total).toFixed(2)}</div>
        },
      },
      {
        accessorKey: "delete",
        header: () => <div>Action</div>,
        cell: ({ row }) => {
          const handleDelete = () => {
            console.log(row.original.id);
            if (setIdToDelete && setIsDeleteModalOpen) {
              setIdToDelete(row.original.id);
              setIsDeleteModalOpen(true);
            }
          }
          return <div className="font-medium"><Trash2 className="h-6 w-6 hover:cursor-pointer" onClick={handleDelete} /></div>;
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
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} handleDelete={() => handleDeleteFinancial()} />
    </>
  )
}

export default Accounts