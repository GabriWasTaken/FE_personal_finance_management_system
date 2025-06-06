import React from 'react'
import { PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useErrorManager } from '@/hooks/useErrorManager';
import { fetchPage, deleteTransaction } from '@/services/account';
import useTableMap from '@/hooks/useTableMap';
import { Categories as CategoriesType } from '@/types/types';
import ConfirmDeleteModal from '../ui/confirmDeleteModal';

function Subcategories({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState & { id_account?: string }, setPagination: React.Dispatch<React.SetStateAction<PaginationState & { id_account?: string }>> }) {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();
  
  const [idToDelete, setIdToDelete] = React.useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  
  const { financialsColumns } = useTableMap({ setIdToDelete, setIsDeleteModalOpen });

  const mutationDeleteCategory = useMutation({
    mutationKey: ['/subcategoryDelete'],
    mutationFn: deleteTransaction,
    onSuccess: () => {
      //queryClient.invalidateQueries({ queryKey: ['/financials'] });
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      //TODO insert error msg
    },
  })

  const dataQueryCategories: UseQueryResult<CategoriesType, Error> = useQuery({
    queryKey: ["/subcategories", pagination],
    queryFn: () => fetchPage(pagination, "subcategories", handleError),
  });

  const handleDeleteFinancial = () => {
    if (idToDelete) {
      mutationDeleteCategory.mutate({ id: idToDelete, handleError })
      setIdToDelete(undefined);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <>
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} handleDelete={() => handleDeleteFinancial()} />
      <TableServerSide columns={financialsColumns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Subcategories