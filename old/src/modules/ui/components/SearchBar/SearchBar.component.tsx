import { SearchIcon } from "@heroicons/react/outline";

type Props = {
  placeholder?: string;
  onChange?: (search: string) => void;
};

export const SearchBar = ({ placeholder = "Search", onChange }: Props) => {
  const onSearch = ({ target }: any) => {
    if (!onChange) return;
    onChange(target.value);
  };
  return (
    <div className="flex h-12 border-3 text-nx-white border-darkgray rounded-md">
      <span className="min-w-pagination p-2 bg-darkgray flex items-center justify-center">
        <SearchIcon className="w-5" />
      </span>
      <input
        onChange={onSearch}
        placeholder={placeholder}
        className="bg-transparent py-2 px-4 w-full outline-none focus:outline-none"
        type="text"
      />
    </div>
  );
};
