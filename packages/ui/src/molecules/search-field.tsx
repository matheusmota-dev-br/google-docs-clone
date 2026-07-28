"use client";

import * as React from "react";
import { SearchIcon, XIcon } from "lucide-react";

import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { cn } from "../lib/utils";

export interface SearchFieldProps extends Omit<
  React.ComponentPropsWithoutRef<"form">,
  "onSubmit" | "onChange"
> {
  value: string;
  onValueChange: (value: string) => void;
  /** Fired on submit (Enter or the magnifier button). */
  onSearch?: (value: string) => void;
  /** Fired when the clear button is pressed. */
  onClear?: () => void;
  placeholder?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * The pill-shaped search bar in the app header. Fully controlled so the caller
 * owns where the query lives — URL state in the app, `useState` in Storybook.
 */
const SearchField = ({
  value,
  onValueChange,
  onSearch,
  onClear,
  placeholder = "Search documents",
  className,
  inputRef,
  ...props
}: SearchFieldProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch?.(value);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn("relative w-full max-w-[720px]", className)}
      {...props}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-12 w-full rounded-full border-none bg-muted px-14 text-base transition-colors placeholder:text-muted-foreground focus-visible:bg-background focus-visible:shadow-pill focus-visible:ring-0"
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        aria-label="Search"
        className="absolute left-2 top-1/2 size-9 -translate-y-1/2 rounded-full [&_svg]:size-5"
      >
        <SearchIcon />
      </Button>
      {value.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Clear search"
          onClick={onClear}
          className="absolute right-2 top-1/2 size-9 -translate-y-1/2 rounded-full [&_svg]:size-5"
        >
          <XIcon />
        </Button>
      )}
    </form>
  );
};
SearchField.displayName = "SearchField";

export { SearchField };
