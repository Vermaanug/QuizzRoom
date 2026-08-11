import { Fragment, type ReactNode } from "react";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";

export interface DropdownItem {
  label: string;
  description?: string;
  icon?: ReactNode;
  tone?: "default" | "danger";
  onSelect?: () => void | Promise<void>;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: "start" | "end";
  panelClassName?: string;
}

const alignmentClasses = {
  start: "left-0 origin-top-left",
  end: "right-0 origin-top-right",
};

const Dropdown = ({ trigger, items, align = "end", panelClassName = "" }: DropdownProps) => (
  <Menu as="div" className="relative z-[70] inline-block text-left">
    <MenuButton className="group inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-left text-xs text-ink transition duration-200 hover:border-primary-700 hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-700 sm:text-sm">
      {trigger}
    </MenuButton>

    <Transition
      as={Fragment}
      enter="transition ease-out duration-150"
      enterFrom="translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-100"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-2 opacity-0"
    >
      <MenuItems
        className={`absolute z-[90] mt-2 w-64 overflow-hidden rounded-xl border border-line bg-[#111111] p-1.5 shadow-card ${alignmentClasses[align]} ${panelClassName}`}
      >
        {items.map((item) => (
          <MenuItem key={item.label} disabled={item.disabled}>
            {({ focus, disabled }) => (
              <button
                className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition ${
                  focus ? "bg-white/5 text-ink" : "text-muted"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""} ${
                  item.tone === "danger" ? "hover:bg-danger/10 hover:text-danger" : "hover:bg-primary-500/10 hover:text-ink"
                }`}
                disabled={disabled}
                onClick={() => item.onSelect?.()}
                type="button"
              >
                {item.icon && <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-primary-500">{item.icon}</span>}
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-xs uppercase tracking-[0.12em]">{item.label}</span>
                  {item.description && <span className="mt-1 block text-[11px] leading-4 text-muted">{item.description}</span>}
                </span>
              </button>
            )}
          </MenuItem>
        ))}
      </MenuItems>
    </Transition>
  </Menu>
);

export default Dropdown;
