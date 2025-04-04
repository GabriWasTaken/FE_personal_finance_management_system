import { ColumnDef } from "@tanstack/react-table";
import React from "react";

type FinancialsColDef = {
  name: string;
  account_name: string;
  amount: number;
  date?: string;
  description?: string;
  category_id?: string;
  subcategory_id?: string;
};

export default function useTableMap() {
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
        accessorKey: "category_id",
        header: () => <div>category_id</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.category_id}</div>;
        },
      },
      {
        accessorKey: "subcategory_id",
        header: () => <div>subcategory_id</div>,
        cell: ({ row }) => {
          return <div className="font-medium">{row.original.subcategory_id}</div>;
        },
      },
    ],
    []
  );

  return {financialsColumns};
}


