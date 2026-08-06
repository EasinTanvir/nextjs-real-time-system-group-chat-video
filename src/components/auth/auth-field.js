export default function AuthField({
  label,
  id,
  error,
  registration,
  type = "text",
  autoComplete,
  placeholder,
}) {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-[15px] text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${error ? "border-red-400 focus:border-red-500 focus:ring-red-100" : "border-slate-200 hover:border-slate-300"}`}
        {...registration}
      />
      <p
        id={errorId}
        aria-live="polite"
        className={`mt-1.5 min-h-5 text-xs font-medium ${error ? "text-red-600" : "text-transparent"}`}
      >
        {error?.message || "Validation message"}
      </p>
    </div>
  );
}
