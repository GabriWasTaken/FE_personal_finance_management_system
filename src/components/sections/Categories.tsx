import React from 'react'
import { PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorManager } from '@/hooks/useErrorManager';
import { deleteCategory } from '@/services/account';
import useTableMap from '@/hooks/useTableMap';
import ConfirmDeleteModal from '../ui/confirmDeleteModal';

function Categories({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState & { id_account?: string }, setPagination: React.Dispatch<React.SetStateAction<PaginationState & { id_account?: string }>> }) {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();
  
  const [idToDelete, setIdToDelete] = React.useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  
  const { categoryColumns } = useTableMap({ setIdToDelete, setIsDeleteModalOpen });

  const mutationDeleteCategory = useMutation({
    mutationKey: ['/categoryDelete'],
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/categories'] });
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      //TODO insert error msg
    },
  })

  const handleDeleteCategory = () => {
    if (idToDelete) {
      mutationDeleteCategory.mutate({ id: idToDelete, handleError })
      setIdToDelete(undefined);
      setIsDeleteModalOpen(false);
    }
  }

  return (
    <>
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} handleDelete={() => handleDeleteCategory()} />
      <TableServerSide columns={categoryColumns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Categories