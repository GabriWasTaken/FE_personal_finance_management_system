import React, { useEffect } from 'react'
import { PaginationState } from '@tanstack/react-table';
import TableServerSide from '../listComponents/TableServerSide';
import { QueryObserverPlaceholderResult, QueryObserverSuccessResult, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  //DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useErrorManager } from '@/hooks/useErrorManager';
import { addFinancial, addCategory, fetchPage, fetchSubcategories, addSubcategory, deleteTransaction } from '@/services/account';
import useTableMap from '@/hooks/useTableMap';
import { Accounts, Categories } from '@/types/types';
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import ConfirmDeleteModal from '../ui/confirmDeleteModal';
import { Label } from '@radix-ui/react-label';
import Combobox from '../ui/combobox';
import { DatePicker } from '../ui/datepicker';
import { Input } from '../ui/input';

function Financials({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState & { id_account?: string }, setPagination: React.Dispatch<React.SetStateAction<PaginationState & { id_account?: string }>> }) {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();

  const [accountValue, setAccountValue] = React.useState<string>()

  const [categoryValue, setCategoryValue] = React.useState<string>()

  const [subcategoryValue, setSubcategoryValue] = React.useState<string>()

  const [accountToValue, setAccountToValue] = React.useState<string>()

  const [transactionDate, setTransactionDate] = React.useState<Date>(new Date());

  const [type, setType] = React.useState<string>('income');
  const [accountToOptions, setAccountToOptions] = React.useState<{ value: string; label: string; }[] | undefined>([]);

  const [idToDelete, setIdToDelete] = React.useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const { financialsColumns } = useTableMap({ setIdToDelete, setIsDeleteModalOpen });

  const mutation = useMutation({
    mutationKey: ['/financials'],
    mutationFn: addFinancial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/financials'] });
      toast.success("Transaction added");
    },
    onError: () => {
      toast.error("Error adding transaction");
      // Remove optimistic todo from the todos list
    },
  })

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

  const categoryMutation = useMutation({
    mutationKey: ['/categories'],
    mutationFn: addCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['/categories'] });
      setCategoryValue(res.rows[0].id);
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      toast.error("Error adding category");
    },
  });

  const subcategoryMutation = useMutation({
    mutationKey: ['/subcategories'],
    mutationFn: addSubcategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['/subcategories'] });
      setSubcategoryValue(res.rows[0].id);
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      toast.error("Error adding subcategory");
    },
  });

  const dataQueryAccounts: UseQueryResult<Accounts, Error> = useQuery({
    queryKey: ["/accounts", pagination],
    queryFn: () => fetchPage(pagination, "accounts", handleError),
  })

  const dataQueryCategories: UseQueryResult<Categories, Error> = useQuery({
    queryKey: ["/categories", pagination],
    queryFn: () => fetchPage(pagination, "categories", handleError),
  })

  const dataQuerySubcategories: UseQueryResult<Categories, Error> = useQuery({
    queryKey: ["/subcategories", { ...pagination, id_category: categoryValue }],
    queryFn: () => {
      if (categoryValue) {
        return fetchSubcategories({ ...pagination, id_category: categoryValue }, "subcategories", handleError)
      }
    },
  })

  useEffect(() => {
    setSubcategoryValue(undefined);
  }, [categoryValue]);

  useEffect(() => {
    if (dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0) {
      setAccountToOptions(dataQueryAccounts.data.rows.filter((account) => account.id !== accountValue).map((account) => ({ value: account.id, label: account.name })))
    }
  }, [accountValue]);

  const handleDateChange = (e: Date | undefined) => {
    if (e) {
      setTransactionDate(e);
    }
  }

  const handleSubmitFinancial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formdata = new FormData(form);
    const name = formdata.get('name') as string;
    const amount = formdata.get('amount');
    mutation.mutate({
      name, amount: Number(amount), id_account: Number(accountValue),
      id_category: Number(categoryValue), id_subcategory: Number(subcategoryValue),
      transactionDate, type, id_account_to: Number(accountToValue), handleError
    });
    form.reset();
  }

  const handleDeleteFinancial = () => {
    if (idToDelete) {
      mutationDeleteFinancial.mutate({ id: idToDelete, handleError })
      setIdToDelete(undefined);
      setIsDeleteModalOpen(false);
    }
  }

  const AddFinancialModalBody = () => {
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="name" className="text-left">
            Name
          </Label>
          <Input id="name" name='name' className="col-span-2" />
        </div>
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="amount" className="text-left">
            Amount
          </Label>
          <Input id="amount" name='amount' className="col-span-2" />
        </div>
        {dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0 && (
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="account" className="text-left">
              Account {type === 'transfer' ? 'from' : ''}
            </Label>
            <Combobox options={dataQueryAccounts.data.rows.map((account) => ({ value: account.id, label: account.name }))} value={accountValue} setValue={setAccountValue} />
          </div>
        )}
        {type === 'transfer' &&
          dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0 && (
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="account" className="text-left">
                Account {type === 'transfer' ? 'to' : ''}
              </Label>
              <Combobox disabled={!accountValue} options={accountToOptions} value={accountToValue} setValue={setAccountToValue} />
            </div>
          )
        }
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="categories" className="text-left">
            Category
          </Label>
          <Combobox insertCallback={(category) => categoryMutation.mutate({ category, handleError })} insertable options={dataQueryCategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={categoryValue} setValue={setCategoryValue} />
        </div>
        {categoryValue &&
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="subcategory" className="text-left">
              Subcategory
            </Label>
            <Combobox insertCallback={(subcategory) => subcategoryMutation.mutate({ subcategory, categoryId: categoryValue, handleError })} insertable options={dataQuerySubcategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={subcategoryValue} setValue={setSubcategoryValue} />
          </div>
        }
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="date" className="text-left">
            Date
          </Label>
          <DatePicker todayAsInitialValue onValueChange={handleDateChange} />
        </div>
      </div>
    );
  }

  return (
    <>
      {dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0 && (
        <div className="flex flex-col m-2">
          <Label htmlFor="account" className="text-left">
            Account {type === 'transfer' ? 'from' : ''}
          </Label>
          <Combobox deletable options={dataQueryAccounts.data.rows.map((account) => ({ value: account.id, label: account.name }))} value={pagination.id_account} setValue={(value) => setPagination({ ...pagination, id_account: value })} />
        </div>
      )}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='secondary'>Add</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[475px]">
          <DialogHeader>
            <DialogTitle>Add financials</DialogTitle>
            {/*<DialogDescription>
            Make changes to your profile here. Click save
          </DialogDescription>*/}
          </DialogHeader>
          <form onSubmit={handleSubmitFinancial}>
            <Tabs defaultValue="account" onValueChange={(e) => setType(e)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger className='data-[state=active]:bg-blue-500' value="income">Entrata</TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-blue-500' value="expense">Uscita</TabsTrigger>
                <TabsTrigger className='data-[state=active]:bg-blue-500' value="transfer">Trasferimento</TabsTrigger>
              </TabsList>
              {["income", "expense", "transfer"].map((type) => {
                return (
                  <TabsContent key={type} value={type}>
                    {AddFinancialModalBody()}
                  </TabsContent>
                )
              })
              }
            </Tabs>
            <DialogFooter>
              <Button type='submit'>Add!!</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <ConfirmDeleteModal isOpen={isDeleteModalOpen} setIsOpen={setIsDeleteModalOpen} handleDelete={() => handleDeleteFinancial()} />
      <TableServerSide columns={financialsColumns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Financials