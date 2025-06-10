import React from 'react'

type LoaderProps = {
  size?: number // em px
  color?: string // Tailwind ou HEX
  className?: string
}

export const Loader: React.FC<LoaderProps> = ({
  size = 32,
  color = '#3B82F6',
  className = '',
}) => {
  const style = {
    width: `${size}px`,
    height: `${size}px`,
    borderTopColor: color,
  }

  return (
    <div className={`inline-block animate-spin rounded-full border-3 border-solid border-muted-foreground ${className}`} style={style} />
  )
}