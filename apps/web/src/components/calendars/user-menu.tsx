'use client';

import type { Session, User } from 'better-auth';
import { signOut } from '@/lib/auth';
import { BadgeCheck, ChevronsUpDown, LogOut, PlusIcon, UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@meeting-baas/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@meeting-baas/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@meeting-baas/ui/sidebar';

import ServerAvailablity from '../server-availablity';
import SignOut from '../sign-out';
import { CreateCalendar } from './create-calendar';

function UserMenu({
  session,
  mutate,
}: {
  session: { session: Session | null; user: User | null } | null;
  mutate: () => Promise<void>;
}) {
  if (!session || !session.user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {session.user.image && (
                  <AvatarImage src={session.user.image} alt={session.user.name} />
                )}
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{session.user.name}</span>
                <span className="truncate text-xs">{session.user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {session.user.image && (
                    <AvatarImage src={session.user.image} alt={session.user.name} />
                  )}
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{session.user.name}</span>
                  <span className="truncate text-xs">{session.user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-0 p-0">
                <CreateCalendar
                  variant="ghost"
                  size={'icon'}
                  className="flex h-full w-full items-center gap-2 rounded-sm px-2 py-1.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                  mutate={mutate}
                />
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  to="/settings"
                  className="flex h-full w-full items-center gap-2 rounded-sm px-2 py-1.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
                >
                  <UserIcon />
                  Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ServerAvailablity />
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />

            <DropdownMenuItem  className="p-0">
              <SignOut className="flex h-full w-full items-center gap-2 rounded-sm px-2 py-1.5 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default UserMenu;
