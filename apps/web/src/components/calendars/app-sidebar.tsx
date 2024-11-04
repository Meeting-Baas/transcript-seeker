'use client';

import { CheckIcon, MoreHorizontal, TrashIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { CalendarBaasData } from '@meeting-baas/shared';
import { Checkbox } from '@meeting-baas/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@meeting-baas/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from '@meeting-baas/ui/sidebar';

import ServerAvailablity from '../server-availablity';
import { CreateCalendar } from './create-calendar';

interface AppSidebarProps {
  calendars?: CalendarBaasData[] | null;
  isLoading: boolean;
  deleteCalendar: (id: string) => void;
  mutate: () => Promise<void>;
}

export function AppSidebar({ calendars, isLoading, deleteCalendar, mutate }: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={'/'}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={'/logo.svg'} className="size-6" alt="MeetingBaas logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MeetingBaas</span>
                  <span className="truncate text-xs">Transcript Seeker</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-0">Calendars</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuSkeleton />
                  </SidebarMenuItem>
                ))
              ) : Array.isArray(calendars) && calendars.length > 0 ? (
                calendars.map((calendar) => (
                  <SidebarMenuItem key={calendar.uuid}>
                    <SidebarMenuButton asChild>
                      <div
                        className="flex cursor-pointer items-center gap-2"
                        // onClick={() => toggleCalendarVisibility(calendar.uuid)}
                      >
                        <Checkbox
                          // checked={visibleCalendarIds.includes(calendar.uuid)}
                          // onCheckedChange={() => toggleCalendarVisibility(calendar.uuid)}
                          className="pointer-events-none"
                        />
                        <span>{calendar.name}</span>
                      </div>
                    </SidebarMenuButton>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuAction>
                          <MoreHorizontal />
                        </SidebarMenuAction>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem
                          className="group"
                          // onClick={() => toggleCalendarVisibility(calendar.uuid)}
                        >
                          <div className="inline-flex size-4 items-center justify-center rounded-md border group-hover:border-background">
                            <CheckIcon className="size-3" />
                          </div>
                          <span>
                            {/* {visibleCalendarIds.includes(calendar.uuid) ? 'Hide' : 'Show'} Calendar */}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => deleteCalendar(calendar.uuid)}>
                          <TrashIcon />
                          <span>Delete Calendar</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </SidebarMenuItem>
                ))
              ) : (
                <p>You don't have any calendars yet</p>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <CreateCalendar mutate={mutate} />
        <ServerAvailablity />
      </SidebarFooter>
    </Sidebar>
  );
}
