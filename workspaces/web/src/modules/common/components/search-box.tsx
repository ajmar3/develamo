import { PlusIcon } from "@heroicons/react/24/outline";
import { ReactElement, useEffect, useRef, useState } from "react";

interface ISearchBox {
  options: any[];
  selectOptionFunc: (args?: any) => void;
}

export function SearchBox(props: ISearchBox): ReactElement {
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [addDisabled, setAddDisabled] = useState(true);

  const [filteredOptions, setFilteredOptions] = useState(props.options);

  useEffect(() => {
    if (searchInput) {
      const newOptions = props.options.filter((x) =>
        x.title.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredOptions(newOptions);
    } else {
      setFilteredOptions(props.options);
      setAddDisabled(false);
    }
  }, [props.options, searchInput]);

  useEffect(() => {
    if (selected && searchInput) {
      setAddDisabled(true);
    } else {
      setAddDisabled(false);
    }
  }, [selected, searchInput]);

  useEffect(() => {
    if (
      !filteredOptions
        .map((x) => x.title.toLowerCase())
        .includes(searchInput.toLowerCase())
    ) {
      setSelected(null);
    }
  }, [filteredOptions, searchInput]);

  return (
    <div className="w-full relative">
      <div className="flex w-full">
        <input
          className="bg-base-300 text-white p-2 rounded-l-md outline-none h-10 w-2/3"
          placeholder="Search tags..."
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
        />
        <button
          className={`w-10 h-10 bg-secondary disabled:bg-base-200 p-2 rounded-r-md`}
          disabled={!selected}
          onClick={() => {
            props.selectOptionFunc(selected);
            setSearchInput("");
          }}
        >
          <PlusIcon />
        </button>
      </div>
      {searchInput && filteredOptions.length > 0 && !selected && (
        <div className="w-2/3 absolute top-12 rounded-md bg-base-300 border border-base-400 flex flex-col gap-1">
          {filteredOptions.map((option) => (
            <div
              className="w-full p-2 text-sm hover:bg-base-100 cursor-pointer"
              key={option.id}
              onClick={() => {
                setSearchInput(option.title);
                setSelected(option.id);
              }}
            >
              {option.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
