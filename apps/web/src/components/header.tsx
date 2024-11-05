import React from 'react';
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

import { ModeToggle } from './mode-toggle';

interface PathItem {
  href?: string;
  name: string;
}

interface HeaderProps {
  path: PathItem[];
}

const Header: React.FC<HeaderProps> = ({ path }) => {
  return (
    <header
      className={cn(
        'sticky top-0 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background px-4',
      )}
    >
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {path.map((item, index) => (
            <React.Fragment key={`brd_container-${index}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink asChild>
                    <Link to={item.href}>{item.name}</Link>
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.name}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <ModeToggle />
    </header>
  );
};

export { Header };
