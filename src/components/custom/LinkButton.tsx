
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const buttonVariants = cva(
  "transition-colors"
);

export interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
  to: string;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showArrow?: boolean;
}

const LinkButton: React.FC<LinkButtonProps> = ({
  to,
  children,
  variant = "default",
  size = "default",
  className,
  onClick,
  showArrow,
  ...rest
}) => {
  return (
    <Button variant={variant} size={size} asChild className={cn(className)}>
      <Link to={to} onClick={onClick} {...rest}>
        {children}
        {showArrow && <ArrowRight className="ml-2 h-4 w-4" />}
      </Link>
    </Button>
  );
};

export default LinkButton;
