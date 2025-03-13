import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  to: string;
  className?: string;
  onClick?: () => void;
}

const buttonVariants = cva(
  "transition-colors"
);

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  children,
  variant,
  size,
  className,
  onClick,
  ...rest
}) => {
  return (
    <Button variant={variant} size={size} asChild className={cn(className)}>
      <Link to={to} onClick={onClick} {...rest}>
        {children}
      </Link>
    </Button>
  );
};

export default LinkButton;
