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
import { Input } from '../ui/input';
import { Label } from "../ui/label"
import { useErrorManager } from '@/hooks/useErrorManager';
import { addFinancial, addCategory, fetchPage, fetchSubcategories, addSubcategory } from '@/services/account';
import Combobox from '../ui/combobox';
import useTableMap from '@/hooks/useTableMap';
import { Accounts, Categories } from '@/types/types';
import { DatePicker } from '../ui/datepicker';
import { toast } from "sonner"

function Financials({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>> }) {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();
  const { financialsColumns } = useTableMap();

  const [accountOpen, setAccountOpen] = React.useState(false)
  const [accountValue, setAccountValue] = React.useState<string>()

  const [categoryOpen, setCategoryOpen] = React.useState(false)
  const [categoryValue, setCategoryValue] = React.useState<string>()

  const [subcategoryOpen, setSubcategoryOpen] = React.useState(false)
  const [subcategoryValue, setSubcategoryValue] = React.useState<string>()

  const [transactionDate, setTransactionDate] = React.useState<Date>(new Date());

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

  const categoryMutation = useMutation({
    mutationKey: ['/categories'],
    mutationFn: addCategory,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['/categories'] });
      setCategoryOpen(false);
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
      setSubcategoryOpen(false);
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
      transactionDate, handleError
    });
    form.reset();
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='secondary'>Add</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add financials</DialogTitle>
            {/*<DialogDescription>
            Make changes to your profile here. Click save
          </DialogDescription>*/}
          </DialogHeader>
          <form onSubmit={handleSubmitFinancial}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input id="name" name='name' className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" name='amount' className="col-span-3" />
              </div>
              {dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0 && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="account" className="text-right">
                    Account
                  </Label>
                  <Combobox onOpenChange={setAccountOpen} open={accountOpen} options={dataQueryAccounts.data.rows.map((account) => ({ value: account.id, label: account.name }))} value={accountValue} setValue={setAccountValue} />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="categories" className="text-right">
                  Category
                </Label>
                <Combobox insertCallback={(category) => categoryMutation.mutate({ category, handleError })} insertable onOpenChange={setCategoryOpen} open={categoryOpen} options={dataQueryCategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={categoryValue} setValue={setCategoryValue} />
              </div>
              {categoryValue &&
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="subcategory" className="text-right">
                    Subcategory
                  </Label>
                  <Combobox insertCallback={(subcategory) => subcategoryMutation.mutate({ subcategory, categoryId: categoryValue, handleError })} insertable onOpenChange={setSubcategoryOpen} open={subcategoryOpen} options={dataQuerySubcategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={subcategoryValue} setValue={setSubcategoryValue} />
                </div>
              }
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <DatePicker todayAsInitialValue onValueChange={handleDateChange}/>
              </div>
            </div>
            <DialogFooter>
              <Button type='submit'>Add!!</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <TableServerSide columns={financialsColumns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Financials