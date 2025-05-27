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
import { ChevronsUpDown, Check, XIcon, LoaderCircle } from 'lucide-react';
import React from 'react'
import { Button } from './button'
import { PaginationState } from "@tanstack/react-table";

//TODO: place label on top

function Combobox({ value, setValue, options, insertable, deletable, insertCallback, disabled, searchCallback, pagination }: {
  value: string | undefined,
  setValue: (value: string | undefined) => void,
  options?: { value: string, label: string }[],
  insertable?: boolean,
  deletable?: boolean,
  insertCallback?: (searchString: string) => void,
  disabled?: boolean,
  searchCallback?: React.Dispatch<React.SetStateAction<PaginationState & { search?: string; }>>,
  pagination?: PaginationState & { search?: string }
}) {
  const [searchString, setSearchString] = React.useState('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isApiLoading, setIsApiLoading] = React.useState<boolean>(false);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>(null);
  const searchTimeoutRef2 = React.useRef<NodeJS.Timeout>(null);

  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setIsApiLoading(true);

    searchTimeoutRef.current = setTimeout(() => {
      if (searchCallback) {
        searchCallback((prev) => ({ ...prev, search: searchString }));
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchString, searchCallback, pagination]);

  React.useEffect(() => {
    setIsApiLoading(false);
  }, [options]);

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setValue(undefined);
    setSearchString(''); // Reset della stringa di ricerca anche in caso di clear
    setIsApiLoading(false); // Reset dello stato di caricamento
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchString('');
      setIsApiLoading(false);
    }
  };

  const handleSearchStringChange = (input: string) => {
    setSearchString(input);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight) {
      if (searchTimeoutRef2.current) {
        clearTimeout(searchTimeoutRef2.current);
      }
      if (searchCallback) {
        setIsApiLoading(true);
        searchTimeoutRef2.current = setTimeout(() => {
          if (searchCallback) {
            searchCallback((prev) => ({ ...prev, pageSize: prev.pageSize + 10 }));
          }
        }, 500);
      }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          name='account'
          variant="outline"
          role="combobox"
          aria-expanded={isOpen}
          className="w-[200px] justify-between"
        >
          {value && options
            ? options.find((option) => option.value === value)?.label
            : "Select..."}

          {deletable && value && (
            <>
              <div
                className="flex items-center justify-center p-1 rounded-sm hover:bg-accent cursor-pointer"
                onClick={handleClear}
                aria-label="Clear selection"
              >
                <XIcon className="h-4 w-4 shrink-0 opacity-50" />
              </div>
              <div className="w-px h-6 bg-border mx-2"></div>
            </>
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command shouldFilter={searchCallback ? false : true}>
          <CommandInput
            placeholder="Search account..."
            className="h-9"
            value={searchString}
            onValueChange={handleSearchStringChange}
          />
          <CommandList onScroll={handleScroll} onScrollCapture={handleScroll}>
            {isApiLoading ? (
              <CommandItem
                key="loading"
                disabled
                value="loading"
                className="h-11 justify-center text-muted-foreground"
              >
                <LoaderCircle className="mr-2 animate-spin" />
              </CommandItem>
            ) : (
              options && options.length > 0 ? (
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? undefined : currentValue)
                        toggleOpen()
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
              ) : (
                insertable && insertCallback ?
                  <CommandEmpty
                    onClick={() => {
                      insertCallback(searchString);
                      toggleOpen();
                    }}>
                    + {searchString}
                  </CommandEmpty>
                  : <CommandEmpty>No results found.</CommandEmpty>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default Combobox