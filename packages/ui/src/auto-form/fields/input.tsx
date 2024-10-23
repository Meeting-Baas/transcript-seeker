import { FormControl, FormItem, FormMessage } from '@meeting-baas/ui/form';
import { Input } from '@meeting-baas/ui/input';

import type { AutoFormInputComponentProps } from '../types';
import AutoFormLabel from '../common/label';
import AutoFormTooltip from '../common/tooltip';

export default function AutoFormInput({
  label,
  isRequired,
  fieldConfigItem,
  fieldProps,
}: AutoFormInputComponentProps) {
  const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps;
  const showLabel = _showLabel === undefined ? true : _showLabel;
  const type = fieldProps.type || 'text';

  return (
    <div className="flex flex-row items-center space-x-2">
      <FormItem className="flex w-full flex-col justify-start">
        {showLabel && (
          <AutoFormLabel label={fieldConfigItem.label || label} isRequired={isRequired} />
        )}
        <FormControl>
          <Input type={type} {...fieldPropsWithoutShowLabel} />
        </FormControl>
        <AutoFormTooltip fieldConfigItem={fieldConfigItem} />
        <FormMessage />
      </FormItem>
    </div>
  );
}
