import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { Trash2 } from "lucide-react"

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
  type: string;
};

export default function useTableMap({setIdToDelete, setIsDeleteModalOpen}: {setIdToDelete: React.Dispatch<React.SetStateAction<number | undefined>>, setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>}) {
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
          return <div className={`font-medium ${row.original.type === 'expense' ? 'text-red-500' : 'text-green-500'}`}>{row.original.amount}</div>;
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
        accessorKey: "type",
        header: () => <div>Type</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.type}</div>;
        },
      },
      {
        accessorKey: "delete",
        header: () => <div>Action</div>,
        cell: ({ row }) => {
          const handleDelete = () => {
            if (setIdToDelete && setIsDeleteModalOpen) {
              setIdToDelete(row.original.id);
              setIsDeleteModalOpen(true);
            }
          }
          return <div className="font-medium"><Trash2 className="h-6 w-6 hover:cursor-pointer" onClick={handleDelete} /></div>;
        },
      },
    ],
    []
  );

  const categoryColumns = React.useMemo<ColumnDef<FinancialsColDef>[]>(
    () => [
      {
        accessorKey: "name",
        header: () => <div>name</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.name}</div>;
        },
      },
      {
        accessorKey: "delete",
        header: () => <div>Action</div>,
        cell: ({ row }) => {
          const handleDelete = () => {
            if (setIdToDelete && setIsDeleteModalOpen) {
              setIdToDelete(row.original.id);
              setIsDeleteModalOpen(true);
            }
          }
          return <div className="font-medium"><Trash2 className="h-6 w-6 hover:cursor-pointer" onClick={handleDelete} /></div>;
        },
      },
    ],
    []
  );

  return {financialsColumns, categoryColumns};
}


