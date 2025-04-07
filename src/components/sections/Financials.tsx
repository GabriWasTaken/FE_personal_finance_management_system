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
import { addFinancial, addCategory, fetchPage, fetchSubcategories, addSubcategory } from '@/services/account';
import useTableMap from '@/hooks/useTableMap';
import { Accounts, Categories } from '@/types/types';
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { AddFinancialModalBody } from './partials/modalBody';

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

  const [accountToOpen, setAccountToOpen] = React.useState(false)
  const [accountToValue, setAccountToValue] = React.useState<string>()

  const [transactionDate, setTransactionDate] = React.useState<Date>(new Date());

  const [type, setType] = React.useState<string>('income');

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
      transactionDate, type, id_account_to: Number(accountToValue), handleError
    });
    form.reset();
  }

  return (
    <>
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
              <TabsContent value="income">
                {AddFinancialModalBody({dataQueryAccounts, dataQueryCategories, dataQuerySubcategories, categoryMutation, subcategoryMutation, accountValue, categoryValue, accountOpen, categoryOpen, subcategoryOpen, setSubcategoryOpen, setAccountOpen, setCategoryOpen, handleError, handleDateChange, setAccountValue, setCategoryValue, subcategoryValue, setSubcategoryValue, type: "income", accountToValue, setAccountToValue, accountToOpen, setAccountToOpen })}
              </TabsContent>
              <TabsContent value="expense">
                {AddFinancialModalBody({dataQueryAccounts, dataQueryCategories, dataQuerySubcategories, categoryMutation, subcategoryMutation, accountValue, categoryValue, accountOpen, categoryOpen, subcategoryOpen, setSubcategoryOpen, setAccountOpen, setCategoryOpen, handleError, handleDateChange, setAccountValue, setCategoryValue, subcategoryValue, setSubcategoryValue, type: "expense", accountToValue, setAccountToValue, accountToOpen, setAccountToOpen })}
              </TabsContent>
              <TabsContent value="transfer">
                {AddFinancialModalBody({dataQueryAccounts, dataQueryCategories, dataQuerySubcategories, categoryMutation, subcategoryMutation, accountValue, categoryValue, accountOpen, categoryOpen, subcategoryOpen, setSubcategoryOpen, setAccountOpen, setCategoryOpen, handleError, handleDateChange, setAccountValue, setCategoryValue, subcategoryValue, setSubcategoryValue, type: "transfer", accountToValue, setAccountToValue, accountToOpen, setAccountToOpen })}
              </TabsContent>
            </Tabs>
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