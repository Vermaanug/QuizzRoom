import {
  Disclosure as HeadlessDisclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

export interface DisclosureProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

const Disclosure = ({
  title,
  children,
  defaultOpen = false,
  className = "",
}: DisclosureProps) => {
  return (
    <HeadlessDisclosure
      as="div"
      defaultOpen={defaultOpen}
      className={`border bg-surface ${className}`}
    >
      <DisclosureButton className="group flex h-14 w-full items-center justify-between gap-4 px-5 text-left text-ink outline-none transition hover:text-primary-500 focus-visible:ring-2 focus-visible:ring-primary-700">
        <span className="min-w-0 truncate font-display text-sm uppercase tracking-[0.1em]">
          {title}
        </span>

        <ChevronDown
          size={18}
          strokeWidth={1.8}
          aria-hidden="true"
          className="shrink-0 text-muted transition duration-200 group-data-open:rotate-180 group-data-open:text-primary-500"
        />
      </DisclosureButton>

      <DisclosurePanel className="border-t px-5 py-4 text-sm leading-6 text-muted">
        {children}
      </DisclosurePanel>
    </HeadlessDisclosure>
  );
};

export default Disclosure;