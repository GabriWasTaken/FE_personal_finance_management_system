import React, { useEffect } from "react";
import Combobox from "@/components/ui/combobox";
import { DatePicker } from "@/components/ui/datepicker";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

export const AddFinancialModalBody = ({ dataQueryAccounts, dataQueryCategories, dataQuerySubcategories, categoryMutation, subcategoryMutation, accountValue, categoryValue, accountOpen, categoryOpen, subcategoryOpen, setSubcategoryOpen, setAccountOpen, setCategoryOpen, handleError, handleDateChange, setAccountValue, setCategoryValue, subcategoryValue, setSubcategoryValue, type, setAccountToOpen, accountToValue, setAccountToValue, accountToOpen }: any) => {
  const [accountToOptions, setAccountToOptions] = React.useState([]);
  
  useEffect(() => {
    if(dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0) {
      setAccountToOptions(dataQueryAccounts.data.rows.filter((account) => account.id !== accountValue).map((account) => ({ value: account.id, label: account.name })))
    }
  }, [accountValue]);

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
          <Combobox onOpenChange={setAccountOpen} open={accountOpen} options={dataQueryAccounts.data.rows.map((account) => ({ value: account.id, label: account.name }))} value={accountValue} setValue={setAccountValue} />
        </div>
      )}
      {type === 'transfer' &&
        dataQueryAccounts.data && dataQueryAccounts.data.rows && dataQueryAccounts.data.rows.length > 0 && (
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="account" className="text-left">
              Account {type === 'transfer' ? 'to' : ''}
            </Label>
            <Combobox disabled={!accountValue} onOpenChange={setAccountToOpen} open={accountToOpen} options={accountToOptions} value={accountToValue} setValue={setAccountToValue} />
          </div>
        )
      }
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="categories" className="text-left">
          Category
        </Label>
        <Combobox insertCallback={(category) => categoryMutation.mutate({ category, handleError })} insertable onOpenChange={setCategoryOpen} open={categoryOpen} options={dataQueryCategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={categoryValue} setValue={setCategoryValue} />
      </div>
      {categoryValue &&
        <div className="grid grid-cols-3 items-center gap-4">
          <Label htmlFor="subcategory" className="text-left">
            Subcategory
          </Label>
          <Combobox insertCallback={(subcategory) => subcategoryMutation.mutate({ subcategory, categoryId: categoryValue, handleError })} insertable onOpenChange={setSubcategoryOpen} open={subcategoryOpen} options={dataQuerySubcategories?.data?.rows?.map((account) => ({ value: account.id, label: account.name }))} value={subcategoryValue} setValue={setSubcategoryValue} />
        </div>
      }
      <div className="grid grid-cols-3 items-center gap-4">
        <Label htmlFor="date" className="text-left">
          Date
        </Label>
        <DatePicker todayAsInitialValue onValueChange={handleDateChange}/>
      </div>
    </div>
  );
}