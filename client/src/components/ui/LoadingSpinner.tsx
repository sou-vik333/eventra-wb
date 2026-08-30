interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
}

function LoadingSpinner({
  size = 'medium',
}: LoadingSpinnerProps) {
  const sizeStyles = {
    small: 'h-4 w-4',
    medium: 'h-6 w-6',
    large: 'h-10 w-10',
  }

  return (
    <div
      className={`animate-spin rounded-full border-4 border-slate-200 border-t-purple-600 ${sizeStyles[size]}`}
      aria-label="Loading"
    />
  )
}

export default LoadingSpinner