import React from 'react'
import { PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useErrorManager } from '@/hooks/useErrorManager';
import { fetchPage, deleteTransaction } from '@/services/account';
import useTableMap from '@/hooks/useTableMap';
import { Accounts } from '@/types/types';
import ConfirmDeleteModal from '../ui/confirmDeleteModal';
import { Label } from '@radix-ui/react-label';
import Combobox from '../ui/combobox';
import FinancialModal from './partials/FinancialModal';
import { Button } from '../ui/button';

function Financials({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState & { id_account?: string }, setPagination: React.Dispatch<React.SetStateAction<PaginationState & { id_account?: string }>> }) {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();

  const [idToDelete, setIdToDelete] = React.useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isFinancialModalOpen, setIsFinancialModalOpen] = React.useState(false);
  const [accountPagination, setAccountPagination] = React.useState<PaginationState & { search?: string }>({ pageIndex: 0, pageSize: 10, search: '' });

  const { financialsColumns } = useTableMap({ setIdToDelete, setIsDeleteModalOpen });

  const mutationDeleteFinancial = useMutation({
    mutationKey: ['/financialsDelete'],
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/financials'] });
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      //TODO insert error msg
    },
  })

  const dataQueryAccounts: UseQueryResult<Accounts, Error> = useQuery({
    queryKey: ["/accounts", accountPagination],
    queryFn: () => fetchPage(accountPagination, "accounts", handleError),
  });

  const handleDeleteFinancial = () => {
    if (idToDelete) {
      mutationDeleteFinancial.mutate({ id: idToDelete, handleError })
      setIdToDelete(undefined);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-col m-2">
        <Label htmlFor="account" className="text-left">
          Account
        </Label>
        <Combobox key="account" pagination={accountPagination} searchCallback={setAccountPagination} deletable options={dataQueryAccounts?.data?.rows.map((account) => ({ value: account.id, label: account.name }))} value={pagination.id_account} setValue={(value) => setPagination({ ...pagination, id_account: value })} />
      </div>
      <Button onClick={() => setIsFinancialModalOpen(true)}>Add</Button>
      <FinancialModal isOpen={isFinancialModalOpen} setIsOpen={setIsFinancialModalOpen} />
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} handleDelete={() => handleDeleteFinancial()} />
      <TableServerSide defaultSort={ {id: "transaction_date", direction: "desc"} } columns={financialsColumns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Financials