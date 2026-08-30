import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

function Input({
  label,
  error,
  id,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`w-full rounded-lg border px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 ${
          error ? 'border-red-500' : 'border-slate-300'
        } ${className}`}
        {...props}
      />

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input