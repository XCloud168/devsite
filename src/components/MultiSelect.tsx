// components/MultiSelect.tsx
"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultiSelectProps {
  options: { value: string; label: string }[];
  value: string[];
  onChangeAction: (value: string[]) => void; // 重命名为 onChangeAction
  maxSelections?: number;
  placeholder?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChangeAction,
  maxSelections = 5,
  placeholder = "Select options...",
}) => {
  const [open, setOpen] = React.useState(false);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      // 取消选择
      onChangeAction(value.filter((v) => v !== optionValue));
    } else if (value.length < maxSelections) {
      // 添加选择（未达到上限）
      onChangeAction([...value, optionValue]);
    }
  };

  const isMaxReached = value.length >= maxSelections;

  return (
    <Select open={open} onOpenChange={setOpen}>
      <SelectTrigger className="rounded-ful w-fit border-0">
        <SelectValue placeholder={placeholder}>
          {value.length > 0 ? value.join(", ") : placeholder}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-center space-x-2 px-2 py-1.5"
            >
              <Checkbox
                id={option.value}
                checked={value.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
                disabled={!value.includes(option.value) && isMaxReached}
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
