import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function Dialog({ isOpen, onClose, children, className }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className={cn("relative", className)}>
          {children}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export function DialogContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-4", className)}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)}>
      {children}
    </h2>
  );
}

interface DialogTriggerProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
}

export function DialogTrigger({ children, onClick, className }: DialogTriggerProps) {
  return (
    <div onClick={onClick} className={cn("cursor-pointer", className)}>
      {children}
    </div>
  );
}
