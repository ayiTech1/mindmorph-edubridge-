import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
}

type InputProps = FieldProps & React.InputHTMLAttributes<HTMLInputElement>;
type TextareaProps = FieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>;
type SelectProps = FieldProps &
  React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode };

const baseField =
  "block w-full h-12 px-4 rounded-lg border bg-white text-brand-charcoal " +
  "border-[#C8D8EA] focus:border-brand-navy focus:ring-0 outline-none " +
  "transition-colors";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={inputId} className="text-[13px] font-semibold text-brand-charcoal">
        {label}
        {rest.required && <span className="text-brand-amber"> *</span>}
      </label>
      <input
        id={inputId}
        ref={ref}
        aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
        aria-invalid={!!error || undefined}
        className={cn(baseField, error && "border-red-500")}
        {...rest}
      />
      {hint && !error && (
        <p id={`${inputId}-hint`} className="text-xs text-brand-slate">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${inputId}-err`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, className, id, ...rest },
  ref
) {
  const inputId = id ?? rest.name;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={inputId} className="text-[13px] font-semibold text-brand-charcoal">
        {label}
        {rest.required && <span className="text-brand-amber"> *</span>}
      </label>
      <textarea
        id={inputId}
        ref={ref}
        aria-describedby={error ? `${inputId}-err` : undefined}
        aria-invalid={!!error || undefined}
        className={cn(baseField, "h-32 py-3 resize-y", error && "border-red-500")}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-brand-slate">{hint}</p>}
      {error && (
        <p id={`${inputId}-err`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});

export function Select({
  label,
  hint,
  error,
  className,
  id,
  children,
  ...rest
}: SelectProps) {
  const inputId = id ?? rest.name;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={inputId} className="text-[13px] font-semibold text-brand-charcoal">
        {label}
        {rest.required && <span className="text-brand-amber"> *</span>}
      </label>
      <select
        id={inputId}
        className={cn(baseField, "appearance-none pr-10 bg-no-repeat bg-[right_1rem_center]",
          error && "border-red-500")}
        {...rest}
      >
        {children}
      </select>
      {hint && !error && <p className="text-xs text-brand-slate">{hint}</p>}
      {error && (
        <p id={`${inputId}-err`} className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
