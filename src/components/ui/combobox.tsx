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
import { ChevronsUpDown, Check, XIcon } from 'lucide-react';
import React from 'react'
import { Button } from './button'

//TODO: place label on top

function Combobox({open, onOpenChange, value, setValue, options, insertable, deletable, insertCallback, disabled }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  value: string | undefined,
  setValue: (value: string | undefined) => void,
  options?: { value: string, label: string }[]
  insertable?: boolean
  deletable?: boolean
  insertCallback?: (searchString: string) => void
  disabled?: boolean
}) {
  const [searchString, setSearchString] = React.useState('');

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation(); // Evita che il click sulla X apra/chiuda il popover
    setValue(undefined); // Setta il valore a undefined per cancellarlo
  };

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

          {deletable && value && (
            <div
              className="flex items-center justify-center p-1 rounded-sm hover:bg-accent cursor-pointer"
              onClick={handleClear}
              aria-label="Clear selection"
            >
              <XIcon className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          )}

          {/* Separatore visivo se c'è la X, altrimenti no */}
          {deletable && value && (
            <div className="w-px h-6 bg-border mx-2"></div> // Linea verticale sottile
          )}
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
                    setValue(currentValue === value ? undefined : currentValue)
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