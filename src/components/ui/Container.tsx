import { type ReactNode, type ElementType } from 'react';
import { cn } from '@/lib/cn';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  size?: 'page' | 'narrow' | 'text';
  as?: ElementType;
}

export function Container({ children, className, size = 'page', as: Tag = 'div' }: ContainerProps) {
  const sizeClass =
    size === 'page' ? 'container-page' : size === 'narrow' ? 'container-narrow' : 'container-text';
  return <Tag className={cn(sizeClass, className)}>{children}</Tag>;
}