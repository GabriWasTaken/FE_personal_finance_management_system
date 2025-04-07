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
import React from 'react'
import { Button } from './button'

function Combobox({open, onOpenChange, value, setValue, options, insertable, insertCallback, disabled }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  value: string | undefined,
  setValue: (value: string) => void,
  options?: { value: string, label: string }[]
  insertable?: boolean
  insertCallback?: (searchString: string) => void
  disabled?: boolean
}) {
  const [searchString, setSearchString] = React.useState('')
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          name='account'
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value && options
            ? options.find((option) => option.value === value)?.label
            : "Select..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onChange={(e: React.ChangeEvent<HTMLInputElement >) => setSearchString(e.target.value)}>
          <CommandInput placeholder="Search account..." className="h-9" />
          <CommandList>
            {insertable && insertCallback ? 
              <CommandEmpty onClick={() => insertCallback(searchString)}>+ {searchString}</CommandEmpty>
              : <CommandEmpty>No results found.</CommandEmpty>
            }
            <CommandGroup>
              {options && options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onOpenChange(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox