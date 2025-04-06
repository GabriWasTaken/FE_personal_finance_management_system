import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/services/account";
import { useErrorManager } from "./useErrorManager";

type FinancialsColDef = {
  id: number;
  name: string;
  account_name: string;
  amount: number;
  date?: string;
  description?: string;
  category_name?: string;
  subcategory_name?: string;
  transaction_date: string;
};

export default function useTableMap() {

  const queryClient = useQueryClient();
  const handleError = useErrorManager();

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

   const financialsColumns = React.useMemo<ColumnDef<FinancialsColDef>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <div>name</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.name}</div>;
        },
      },
      {
        accessorKey: "account",
        header: () => <div>account</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.account_name}</div>;
        },
      },
      {
        accessorKey: "amount",
        header: () => <div>amount</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.amount}</div>;
        },
      },
      {
        accessorKey: "category_name",
        header: () => <div>category</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.category_name}</div>;
        },
      },
      {
        accessorKey: "subcategory_name",
        header: () => <div>subcategory</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.subcategory_name}</div>;
        },
      },
      {
        accessorKey: "transaction_date",
        header: () => <div>Date</div>,
        cell: ({ row }) => {
          const date = new Date(row.original.transaction_date);
          return <div className="font-medium">{date.toLocaleDateString()}</div>;
        },
      },
      {
        accessorKey: "delete",
        header: () => <div>Action</div>,
        cell: ({ row }) => {
          return <div className="font-medium"><Trash2 className="h-6 w-6 hover:cursor-pointer" onClick={() => mutationDeleteFinancial.mutate({id: row.original.id, handleError}) } /></div>;
        },
      },
    ],
    []
  );

  return {financialsColumns};
}


