import { Fragment, type ReactNode } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  panelClassName?: string;
}

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  panelClassName = "",
}: ModalProps) => (
  <Transition appear show={open} as={Fragment}>
    <Dialog as="div" className="relative z-[100]" onClose={onClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[2px]" aria-hidden="true" />
      </TransitionChild>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-6">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
            enterTo="translate-y-0 opacity-100 sm:scale-100"
            leave="ease-in duration-150"
            leaveFrom="translate-y-0 opacity-100 sm:scale-100"
            leaveTo="translate-y-4 opacity-0 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              className={`w-full max-w-lg border border-line bg-[#111111] p-5 text-ink shadow-card outline-none sm:p-6 ${panelClassName}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <DialogTitle className="font-display text-2xl uppercase tracking-[-0.02em] text-ink">
                    {title}
                  </DialogTitle>
                  {description && (
                    <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                  )}
                </div>

                <button
                  aria-label="Close modal"
                  className="flex h-10 w-10 shrink-0 items-center justify-center border border-line text-lg text-muted transition hover:border-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-primary-700"
                  onClick={onClose}
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="mt-5">{children}</div>

              {footer && <div className="mt-6 border-t border-line pt-5">{footer}</div>}
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default Modal;
