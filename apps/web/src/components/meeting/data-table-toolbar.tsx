'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';

import { Button } from '@meeting-baas/ui/button';
import { Input } from '@meeting-baas/ui/input';

import { DataTableViewOptions } from './data-table-view-options';

// import { priorities, statuses } from "../data/data"
// import { DataTableFacetedFilter } from "./data-table-faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="mb-4 flex items-center gap-2 rounded-b-md border-x border-b border-border px-2 pb-2 pt-1 empty:pb-0">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter recordings by Bot ID..."
          value={(table.getColumn('botId')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('botId')?.setFilterValue(event.target.value)}
          className="w-full"
        />
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={statuses}
          />
        )}
        {table.getColumn("priority") && (
          <DataTableFacetedFilter
            column={table.getColumn("priority")}
            title="Priority"
            options={priorities}
          />
        )} */}
      </div>
      {isFiltered ? (
        <Button variant="outline" onClick={() => table.resetColumnFilters()} className="w-32">
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <DataTableViewOptions table={table} />
      )}
    </div>
  );
}
