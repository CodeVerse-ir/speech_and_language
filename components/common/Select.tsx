"use client";

import { useState, useRef, useEffect } from "react";

interface State {
  id: number;
  name: string;
  center: string;
  latitude: string;
  longitude: string;
}

interface City {
  id: number;
  name: string;
  state: string;
  latitude: string;
  longitude: string;
  state_id: number;
}

interface SelectProps {
  options: State[] | City[] | null;
  defaultValue: string;
  onOptionSelect: (option: string) => void;
  title: string;
  borderStyle: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  defaultValue,
  onOptionSelect,
  title,
  borderStyle,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultValue || "");
  const selectRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (name: string) => {
    setSelectedOption(name);
    setIsOpen(false);
    if (onOptionSelect) {
      onOptionSelect(name);
    }
  };

  useEffect(() => {
    if (!defaultValue) {
      setSelectedOption("");
    }
  }, [defaultValue]);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={selectRef} className="relative w-full">
      <div
        className={`flex items-center justify-between w-[280px] md:w-72 xl:w-80 h-8 px-2 bg-white dark:bg-zinc-700 outline-none border border-gray-300 ${
          isOpen && "border-orange-300"
        } rounded ${borderStyle} select-none cursor-pointer transition-colors duration-150`}
        onClick={handleToggle}
      >
        <div>
          {selectedOption ? (
            <span className="text-black dark:text-white">{selectedOption}</span>
          ) : (
            <span className="text-zinc-700 dark:text-gray-400">{`انتخاب ${title}`}</span>
          )}
        </div>
        <svg
          className={`text-primary size-5 ${
            isOpen ? "" : "rotate-180"
          } transition-all`}
        >
          <svg
            id="chevron-down-mini"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
              clipRule="evenodd"
            />
          </svg>
        </svg>
      </div>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-40 overflow-y-auto bg-white dark:bg-zinc-700 border border-gray-300 rounded">
          {!options ? (
            <div className="flex items-center justify-center gap-x-1 py-2">
              <div className="text-sm text-orange-500">منتظر بمانید</div>
              <div className="flex items-center justify-center w-6 h-1 gap-x-1 child:size-1 child:rounded-full child:bg-orange-500">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          ) : (
            options.map((option, index) => (
              <div
                key={index}
                className="p-2 text-center hover:bg-orange-300 border border-gray-300 select-none cursor-pointer"
                onClick={() => handleOptionClick(option.name)}
              >
                {option.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
