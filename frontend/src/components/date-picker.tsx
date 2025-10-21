"use client"

import React from 'react'
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Popover,PopoverContent,PopoverTrigger } from "@/components/ui/popover";
import { Span } from 'next/dist/trace';
import { Calendar } from './ui/calendar';

interface DatePickerProps {
    value : Date | undefined;
    onChange : (date : Date) => void;
    className ?: string;
    placeholder ?: string
}

export default function DatePicker({value,onChange,className,placeholder="Select a date"}: DatePickerProps) {
  return (
    <Popover>
        <PopoverTrigger>
            <Button variant="outline" size="lg" className={cn('w-full justify-start text-left font-normal px-3',!value && "text-muted-foreground",className)}>
                <CalendarIcon className='mr-2 h-4 w-4'></CalendarIcon>
                {value ? format(value,"PPP") : <span>{placeholder}</span>}
            </Button>
        </PopoverTrigger>
        <PopoverContent>
            <Calendar
                mode="single"
                selected={value}
                onSelect={(date)=>onChange(date as Date)}
                initialFocus
            >

            </Calendar>
        </PopoverContent>
    </Popover>
  )
}
