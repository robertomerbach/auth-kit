import React from 'react'

type LoaderProps = {
  size?: number // em px
  color?: string // Tailwind ou HEX
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 32,
  className = 'border-foreground',
}) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
  }

  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-3 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
      role="status"
      style={style}
      >
      <span
        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span>
    </div>
  )
}