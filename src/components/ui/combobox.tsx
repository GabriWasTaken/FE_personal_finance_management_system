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

function Combobox({ value, setValue, options, insertable, deletable, insertCallback, disabled, searchCallback, pagination, rowCount }: {
  value: string | undefined,
  setValue: (value: string | undefined) => void,
  options?: { value: string, label: string }[],
  insertable?: boolean,
  deletable?: boolean,
  insertCallback?: (searchString: string) => void,
  disabled?: boolean,
  searchCallback?: React.Dispatch<React.SetStateAction<PaginationState & { search?: string; }>>,
  pagination?: PaginationState & { search?: string }
  rowCount?: number
}) {
  const [searchString, setSearchString] = React.useState('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [isApiLoading, setIsApiLoading] = React.useState<boolean>(false);
  const [paginatedOptions, setPaginatedOptions] = React.useState<{ value: string, label: string }[] | undefined>(options? [...options] : []);
  const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const scrollPositionRef = React.useRef<number>(0);
  const commandListRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    setIsApiLoading(true);

    searchTimeoutRef.current = setTimeout(() => {
      if (searchCallback) {
        setPaginatedOptions([]);
        searchCallback((prev) => ({ ...prev, search: searchString, pageIndex: 0 }));
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchString, searchCallback]);

  React.useEffect(() => {
    setIsApiLoading(false);
    if(options && paginatedOptions) {
      const optionsSum = Array.from([...paginatedOptions, ...options]
          .reduce((m, o) => m.set(o.value, o), new Map)
          .values()
      );
    setPaginatedOptions(optionsSum);
    }
    // Restore scroll position after options are loaded and not in initial mount
    if (commandListRef.current && scrollPositionRef.current > 0) {
      commandListRef.current.scrollBy({
        top: scrollPositionRef.current,
        behavior: "instant",
      });
    }
  }, [options]);

  const handleClear = (event: React.MouseEvent) => {
    event.stopPropagation();
    setValue(undefined);
    setSearchString(''); // Reset search string on clear
    setIsApiLoading(false); // Reset loading state
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchString('');
      setIsApiLoading(false);
      scrollPositionRef.current = 0; // Reset scroll position when closing
    }
  };

  const handleSearchStringChange = (input: string) => {
    setSearchString(input);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if(pagination?.pageIndex >= (Math.ceil(rowCount/pagination?.pageSize) -1)) return;
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop === clientHeight) {
      if (searchCallback) {
        scrollPositionRef.current = scrollTop;
        searchCallback((prev) => ({ ...prev, search: searchString, pageIndex: prev.pageIndex + 1 }));
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
          {value && paginatedOptions
            ? paginatedOptions.find((option) => option.value === value)?.label
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
          <CommandList ref={commandListRef} onScroll={handleScroll}> {/* Attach ref here */}
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
              paginatedOptions && paginatedOptions.length > 0 ? (
                <CommandGroup>
                  {paginatedOptions.map((option) => (
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