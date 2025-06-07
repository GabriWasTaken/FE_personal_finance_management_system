import React from 'react'
import { PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useErrorManager } from '@/hooks/useErrorManager';
import { fetchPage, deleteSubcategory } from '@/services/account';
import useTableMap from '@/hooks/useTableMap';
import { Categories as CategoriesType } from '@/types/types';
import ConfirmDeleteModal from '../ui/confirmDeleteModal';
import { Label } from '@radix-ui/react-label';
import Combobox from '../ui/combobox';

function Subcategories({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState & { id_category?: string }, setPagination: React.Dispatch<React.SetStateAction<PaginationState & { id_category?: string }>> }) {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();

  const [idToDelete, setIdToDelete] = React.useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [categoriesPagination, setCategoriesPagination] = React.useState<PaginationState & { search?: string }>({ pageIndex: 0, pageSize: 10, search: '' });

  const { subcategoryColumns } = useTableMap({ setIdToDelete, setIsDeleteModalOpen });

  const mutationDeleteCategory = useMutation({
    mutationKey: ['/subcategoryDelete'],
    mutationFn: deleteSubcategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/subcategories'] });
    },
    onError: () => {
      console.log("error");
      // Remove optimistic todo from the todos list
      //TODO insert error msg
    },
  })

  const dataQueryCategories: UseQueryResult<CategoriesType, Error> = useQuery({
    queryKey: ["/categories", categoriesPagination],
    queryFn: () => fetchPage(categoriesPagination, "categories", handleError),
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
      <div className="flex flex-col m-2">
        <Label htmlFor="account" className="text-left">
          Account
        </Label>
        <Combobox key="account" pagination={categoriesPagination} searchCallback={setCategoriesPagination} deletable options={dataQueryCategories?.data?.rows.map((category) => ({ value: category.id, label: category.name }))} value={pagination.id_category} setValue={(value) => setPagination({ ...pagination, id_category: value })} />
      </div>
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} handleDelete={() => handleDeleteFinancial()} />
      {!pagination.id_category || pagination.id_category === "" ? <h1 className="text-2xl font-bold">Please select a category first</h1> : 
        <TableServerSide columns={subcategoryColumns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
      }
    </>
  )
}

export default Subcategories