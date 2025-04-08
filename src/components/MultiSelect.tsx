// components/MultiSelect.tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChangeAction: (value: string[]) => void;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChangeAction,
  placeholder = "Select options...",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChangeAction(value.filter((v) => v !== optionValue));
    } else {
      onChangeAction([...value, optionValue]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // 全选：选中所有选项
      onChangeAction(options.map((opt) => opt.value));
    } else {
      // 取消全选：清空所有选项
      onChangeAction([]);
    }
  };

  const isAllSelected = options.every((opt) => value.includes(opt.value));

  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder={placeholder}>
          {value.length > 0 ? value.join(", ") : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {/* 全选选项 */}
          <div className="flex items-center space-x-2 px-2 py-1.5">
            <Checkbox
              id="select-all"
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="cursor-pointer">
              All
            </Label>
          </div>
          {/* 分割线 */}
          <div className="my-1 border-t" />
          {/* 其他选项 */}
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 px-2 py-1.5"
            >
              <Checkbox
                id={option.value}
                checked={value.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <Label htmlFor={option.value} className="cursor-pointer">
                {option.label}
              </Label>
            </div>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
