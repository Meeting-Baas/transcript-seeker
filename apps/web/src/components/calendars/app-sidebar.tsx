import { CheckIcon, Command, DeleteIcon, MoreHorizontal, TrashIcon } from 'lucide-react';

import { CalendarBaasData } from '@meeting-baas/shared';
import { Button } from '@meeting-baas/ui/button';
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
} from '@meeting-baas/ui/sidebar';

import ServerAvailablity from '../server-availablity';

interface AppSidebarProps {
  calendars: CalendarBaasData[];
  deleteCalendar: (id: string) => void;
}

export function AppSidebar({ calendars, deleteCalendar }: AppSidebarProps) {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Button variant={'ghost'}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <img src={'/logo.svg'} className="size-6" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">MeetingBaas</span>
                  <span className="truncate text-xs">Transcript Seeker</span>
                </div>
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-0">Calendars</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {calendars.map((calendar) => (
                <SidebarMenuItem key={calendar.uuid}>
                  <SidebarMenuButton asChild>
                    <div className="cursor-pointer">
                      <Checkbox checked={true} />
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
                      <DropdownMenuItem className='group'>
                        <div className='rounded-md border size-4 inline-flex items-center justify-center group-hover:border-background'>
                          <CheckIcon className='size-3' />
                        </div>
                        <span>Select Calendar</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <TrashIcon />
                        <span>Delete Calendar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <ServerAvailablity />
      </SidebarFooter>
    </Sidebar>
  );
}
