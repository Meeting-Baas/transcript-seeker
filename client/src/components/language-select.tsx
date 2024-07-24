'use client';

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  FormControl,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { formSchema } from '@/routes/upload';

import { z } from 'zod';

const languages = [
  { label: 'English', value: 'en' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Spanish', value: 'es' },
  { label: 'Portuguese', value: 'pt' },
  { label: 'Russian', value: 'ru' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Chinese', value: 'zh' },
] as const;

interface ComboboxProps {
  form: UseFormReturn<z.infer<typeof formSchema>>
  field: ControllerRenderProps<z.infer<typeof formSchema>, 'language'>;
}

export default function LanguageCombobox({ form, field }: ComboboxProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn('font-normal px-3 py-2 w-full justify-between', !field.value && 'text-muted-foreground')}
          >
            {field.value
              ? languages.find((language) => language.value === field.value)?.label
              : 'Select language'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="p-0 popover-content-width-full" align='start'>
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No language found.</CommandEmpty>
            <CommandList>
            <CommandGroup>
              {languages.map((language) => (
                <CommandItem
                  value={language.label}
                  key={language.value}
                  onSelect={() => {
                    form.setValue('language', language.value);
                  }}
                >
                  {language.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      language.value === field.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            </CommandList>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
