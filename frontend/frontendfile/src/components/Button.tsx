import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
  'aria-label'?: string; // Add aria-label for accessibility
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseStyles = 'font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out';

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-green-600',
    secondary: 'bg-secondary text-darkText hover:bg-gray-100 border border-gray-200',
    accent: 'bg-accent text-white hover:bg-blue-600',
    outline: 'bg-transparent text-primary hover:bg-primary hover:text-white border border-primary',
  };

  const sizeStyles = {
    small: 'text-sm py-1 px-3',
    medium: 'text-base py-2 px-4',
    large: 'text-lg py-3 px-6',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
