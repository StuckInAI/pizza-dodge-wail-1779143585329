import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './Button.module.css';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'primary' | 'ghost' | 'danger';
  children: ReactNode;
};

export default function Button({ variant = 'default', className, children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        styles.btn,
        variant === 'primary' && styles.primary,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        className,
      )}
    >
      {children}
    </button>
  );
}
