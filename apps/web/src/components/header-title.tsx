import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

import { cn } from '@meeting-baas/ui';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@meeting-baas/ui/breadcrumb';

interface PathItem {
  href?: string;
  name: string;
}

interface HeaderTitleProps {
  path: PathItem[];
  border?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ path, border = true }) => {
  return (
    <header
      className={cn(
        'sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4',
        { 'border-b': border },
      )}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {path.map((item, index) => (
            <React.Fragment key={`brd_container-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.name}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export { HeaderTitle };
