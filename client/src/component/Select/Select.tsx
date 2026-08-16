import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface SelectOptionItem<T extends string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOptionItem<T>[];
  placeholder?: string;
  disabled?: boolean;
  "aria-label"?: string;
  className?: string;
}

const Select = <T extends string>({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  disabled = false,
  "aria-label": ariaLabel,
  className = "",
}: SelectProps<T>) => {
  const selectedOption = options.find(
    (option) => option.value === value,
  );

  return (
    <Listbox
      value={value}
      onChange={onChange}
      disabled={disabled}
    >
      <div className={`relative ${className}`}>
        <ListboxButton
          aria-label={ariaLabel}
          className="flex h-14 w-full min-w-0 items-center justify-between gap-4 border border-line bg-surface px-5 text-left text-ink outline-none transition hover:border-muted focus-visible:border-primary-700 focus-visible:ring-2 focus-visible:ring-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="min-w-0">
            {selectedOption ? (
              <span className="block truncate font-display text-sm uppercase tracking-[0.1em]">
                {selectedOption.label}
              </span>
            ) : (
              <span className="block truncate text-sm text-muted">
                {placeholder}
              </span>
            )}
          </span>

          <ChevronDown
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
            className="shrink-0 text-muted"
          />
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          className="z-[90] mt-2 w-[var(--button-width)] border border-line bg-surface p-1 shadow-card [--anchor-gap:8px] focus:outline-none"
        >
          {options.map((option) => (
            <ListboxOption
              key={option.value}
              value={option.value}
              disabled={option.disabled}
              className="group flex cursor-pointer items-center gap-3 px-3 py-3 outline-none data-[focus]:bg-primary-500/10 data-[focus]:text-ink data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center text-primary-500">
                {option.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-display text-xs uppercase tracking-[0.12em]">
                  {option.label}
                </span>

                {option.description && (
                  <span className="mt-1 block text-[11px] leading-4 text-muted">
                    {option.description}
                  </span>
                )}
              </span>

              <Check
                size={16}
                strokeWidth={2}
                aria-hidden="true"
                className="invisible shrink-0 text-primary-500 group-data-[selected]:visible"
              />
            </ListboxOption>
          ))}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};

export default Select;