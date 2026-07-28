"use client";

import { useRef, useState } from "react";
import { SearchField } from "@repo/ui/molecules";

import { useSearchParam } from "@/hooks/use-search-param";

/**
 * Connects the design system's `<SearchField>` to the `?search=` query
 * parameter. The draft value is kept locally and only committed to the URL on
 * submit, so typing does not re-run the Convex query on every keystroke.
 */
export const SearchInput = () => {
  const [search, setSearch] = useSearchParam();
  const [value, setValue] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <SearchField
      inputRef={inputRef}
      value={value}
      onValueChange={setValue}
      onSearch={(next) => {
        setSearch(next);
        inputRef.current?.blur();
      }}
      onClear={() => {
        setValue("");
        setSearch("");
        inputRef.current?.blur();
      }}
    />
  );
};
