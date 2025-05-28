import React, { useEffect } from "react";
import { DialogHeader, DialogFooter, Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Combobox from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/datepicker";
import { PaginationState } from "@tanstack/react-table";
import { useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { Accounts, Categories } from "@/types/types";
import { addCategory, addFinancial, addSubcategory, fetchPage, fetchSubcategories } from "@/services/account";
import { useErrorManager } from "@/hooks/useErrorManager";
import { toast } from "sonner";

const FinancialModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void }) => {
  const handleError = useErrorManager();
  const queryClient = useQueryClient();

  const [transactionDate, setTransactionDate] = React.useState<Date>(new Date());
  const [type, setType] = React.useState<string>('income');
  const [accountPaginationModal, setAccountPaginationModal] = React.useState<PaginationState & { search?: string }>({ pageIndex: 0, pageSize: 10, search: '' });
  const [accountPaginationToModal, setAccountPaginationToModal] = React.useState<PaginationState & { search?: string }>({ pageIndex: 0, pageSize: 10, search: '' });
  const [categoriesPagination, setCategoriesPagination] = React.useState<PaginationState & { search?: string }>({ pageIndex: 0, pageSize: 10, search: '' });
  const [subcategoriesPagination, setSubcategoriesPagination] = React.useState<PaginationState & { search?: string }>({ pageIndex: 0, pageSize: 10, search: '' });
  const [categoryValue, setCategoryValue] = React.useState<string>()
  const [subcategoryValue, setSubcategoryValue] = React.useState<string>()
  const [accountToValue, setAccountToValue] = React.useState<string>()
  const [accountValue, setAccountValue] = React.useState<string>()

  const dataQueryAccountsModal: UseQueryResult<Accounts, Error> = useQuery({
    queryKey: ["/accounts", accountPaginationModal],
    queryFn: () => fetchPage(accountPaginationModal, "accounts", handleError),
  });

  const dataQueryAccountsToModal: UseQueryResult<Accounts, Error> = useQuery({
    queryKey: ["/accounts", accountPaginationToModal],
    queryFn: () => fetchPage(accountPaginationToModal, "accounts", handleError),
  });

  const dataQueryCategories: UseQueryResult<Categories, Error> = useQuery({
    queryKey: ["/categories", categoriesPagination],
    queryFn: () => fetchPage(categoriesPagination, "categories", handleError),
  })

  const dataQuerySubcategories: UseQueryResult<Categories, Error> = useQuery({
    queryKey: ["/subcategories", { ...subcategoriesPagination, id_category: categoryValue }],
    queryFn: () => {
      if (categoryValue) {
        return fetchSubcategories({ ...subcategoriesPagination, id_category: categoryValue }, "subcategories", handleError)
      }
    },
  })

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

  useEffect(() => {
    setSubcategoryValue(undefined);
  }, [categoryValue]);

  const handleSubmitFinancial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formdata = new FormData(form);
    const name = formdata.get('name') as string;
    const amount = formdata.get('amount');

    let cleanedString = amount as string;
    if (amount && amount.toString().includes(',')) {
      cleanedString = amount.toString().replace(',', '.');
    }
    const amountNumber = parseFloat(cleanedString);

    mutation.mutate({
      name, amount: amountNumber, id_account: Number(accountValue),
      id_category: Number(categoryValue), id_subcategory: Number(subcategoryValue),
      transactionDate, type, id_account_to: Number(accountToValue), handleError
    });
    form.reset();
  }


  const handleDateChange = (e: Date | undefined) => {
    if (e) {
      setTransactionDate(e);
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
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="account" className="text-left">
            Account {type === 'transfer' ? 'from' : ''}
          </Label>
          <Combobox key="account-from" pagination={accountPaginationModal} searchCallback={setAccountPaginationModal} options={dataQueryAccountsModal?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={accountValue} setValue={setAccountValue} />
        </div>
        {type === 'transfer' &&
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="account" className="text-left">
              Account {type === 'transfer' ? 'to' : ''}
            </Label>
            <Combobox key="account-to" pagination={accountPaginationToModal} searchCallback={setAccountPaginationToModal} disabled={!accountValue} options={dataQueryAccountsToModal?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={accountToValue} setValue={setAccountToValue} />
          </div>
        }
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="categories" className="text-left">
            Category
          </Label>
          <Combobox key="categories" pagination={categoriesPagination} searchCallback={setCategoriesPagination} insertCallback={(category) => categoryMutation.mutate({ category, handleError })} insertable options={dataQueryCategories && dataQueryCategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={categoryValue} setValue={setCategoryValue} />
        </div>
        {categoryValue &&
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="subcategory" className="text-left">
              Subcategory
            </Label>
            <Combobox key="subcategories" pagination={subcategoriesPagination} searchCallback={setSubcategoriesPagination} insertCallback={(subcategory) => subcategoryMutation.mutate({ subcategory, categoryId: categoryValue, handleError })} insertable options={dataQuerySubcategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={subcategoryValue} setValue={setSubcategoryValue} />
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <TabsTrigger className='data-[state=active]:bg-green-500' value="income">Entrata</TabsTrigger>
              <TabsTrigger className='data-[state=active]:bg-red-500' value="expense">Uscita</TabsTrigger>
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
  )
}

export default FinancialModal;