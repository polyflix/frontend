import React from 'react';
import { cn, WithClassname } from '../../common';

type ButtonProps = WithClassname & {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  type?: 'button' | 'submit' | 'reset' | undefined
  disabled?: boolean
}
export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={cn(
      'hover:bg-opacity-80 bg-opacity-90 px-2 py-1 box-border rounded flex flex-row gap-2 justify-center items-center text-white',
      className,
      disabled && 'opacity-50 pointer-events-none',
    )}
  >
    {children}
  </button>
);
