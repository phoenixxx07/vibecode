import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export function TerminalInput({ label, hint, className = "", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase text-muted">{label}</span>
      <input
        className={`border border-muted bg-page px-3 py-2 text-sm text-text-main ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
};

export function TerminalTextarea({ label, hint, className = "", ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase text-muted">{label}</span>
      <textarea
        className={`min-h-24 border border-muted bg-page px-3 py-2 text-sm text-text-main ${className}`}
        {...props}
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function TerminalSelect({
  label,
  hint,
  children,
  className = "",
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase text-muted">{label}</span>
      <select
        className={`border border-muted bg-page px-3 py-2 text-sm text-text-main ${className}`}
        {...props}
      >
        {children}
      </select>
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </label>
  );
}
