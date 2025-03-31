import React from 'react'
import { ColumnDef, PaginationState } from '@tanstack/react-table';
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from '@/lib/utils';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useErrorManager } from '@/hooks/useErrorManager';
import { addFinancial } from '@/services/account';
function Financials({ dataQuery, pagination, setPagination }: { dataQuery: QueryObserverSuccessResult<unknown, Error> | QueryObserverPlaceholderResult<unknown, Error>, pagination: PaginationState, setPagination: React.Dispatch<React.SetStateAction<PaginationState>> }) {
  type ColDef = {
    name: string,
    account_name: string,
    amount: number,
    date: string,
    description: string,
    tag?: string,
    subtag?: string
  }
  type Accounts = {
    rows: [{
      id: string,
      name: string
    }]
  }

  const handleError = useErrorManager();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ['/financials'],
    mutationFn: addFinancial,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/financials'] });
      setOpen(false);
    },
    onError: () => {
      // Remove optimistic todo from the todos list
      //TODO insert error msg
    },
  })

  const fetchPage = async (pagination: PaginationState & { id_account?: string }): Promise<unknown> => {
    const queryParams = `?page=${pagination.pageIndex}&limit=${pagination.pageSize}`;
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/accounts${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
    if (!response.ok) {
      handleError({ error: response });
      throw new Error('Network response was not ok')
    }
    return response.json();
  }

  const dataQueryAccounts:UseQueryResult<Accounts, Error> = useQuery({
    queryKey: ["/accounts", pagination],
    queryFn: () => fetchPage(pagination),
  })
  console.log(dataQueryAccounts);

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  const handleSubmitFinancial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formdata = new FormData(form);
    const name = formdata.get('name') as string;
    const amount = formdata.get('amount');
    console.log(name, amount, value);
    mutation.mutate({ name, amount: Number(amount), id_account: Number(value), handleError});
    form.reset();
  }

  const columns = React.useMemo<ColumnDef<ColDef>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <div>name</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.name}</div>
        },
      },
      {
        accessorKey: "account",
        header: () => <div>account</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.account_name}</div>
        },
      },
      {
        accessorKey: "amount",
        header: () => <div>amount</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.amount}</div>
        },
      },
    ],
    []
  )
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <div className="grid grid-cols-4 items-center gap-4">
            <Button variant='secondary'>Add</Button>
          </div>
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
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        name='account'
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                      >
                        {value
                          ? dataQueryAccounts.data.rows.find((account) => account.id === value)?.name
                          : "Select account..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search account..." className="h-9" />
                        <CommandList>
                          <CommandEmpty>No account found.</CommandEmpty>
                          <CommandGroup>
                            {dataQueryAccounts.data.rows.map((account) => (
                              <CommandItem
                                key={account.id}
                                value={account.id}
                                onSelect={(currentValue) => {
                                  setValue(currentValue === value ? "" : currentValue)
                                  setOpen(false)
                                }}
                              >
                                {account.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    value === account.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type='submit'>Add!!</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <TableServerSide columns={columns} dataQuery={dataQuery} pagination={pagination} setPagination={setPagination} />
    </>
  )
}

export default Financials