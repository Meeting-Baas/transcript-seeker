import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderTitleProps {
  path: string;
  title: string;
  subtitle?: React.ReactNode;
  border?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ path, title, subtitle, border = true }) => {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="flex w-full flex-row items-center">
          <div className="flex-shrink-0">
            <Link
              to={path}
              className="flex w-min items-center gap-1 py-2 text-lg hover:text-muted-foreground"
            >
              <ArrowLeft />
                <h1 className="text-2xl font-bold">{title}</h1>
            </Link>
          </div>
          <div className="flex flex-grow flex-col items-end md:items-center">
          </div>
        </div>

        <div
          className={cn('w-full', {
            hidden: !border,
          })}
        >
          <Separator />
        </div>

        {subtitle && (
          <>
            <p className="hidden text-left text-muted-foreground md:block md:text-center md:text-sm">
              {typeof subtitle === 'string'
                ? subtitle
                : React.Children.map(subtitle, (child) =>
                    typeof child === 'string'
                      ? child
                      : React.cloneElement(child as React.ReactElement, {
                          className: 'text-muted-foreground hover:underline',
                        }),
                  )}
            </p>
          </>
        )}
      </div>
    </>
  );
};

export { HeaderTitle };
