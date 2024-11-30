'use client';

import { CheckCircle2 } from 'lucide-react';

interface TimelineItemProps {
  title: string;
  date?: string;
  isCompleted: boolean;
  isLast?: boolean;
}

export function TimelineItem({ title, date, isCompleted, isLast }: TimelineItemProps) {
  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className={`rounded-full p-1 ${
          isCompleted ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'
        }`}>
          <CheckCircle2 
            className={`w-5 h-5 ${
              isCompleted 
                ? 'text-green-500 dark:text-green-400' 
                : 'text-gray-300 dark:text-gray-600'
            }`} 
          />
        </div>
        {!isLast && (
          <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-2" />
        )}
      </div>
      <div className="pb-6">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </p>
        {date && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}

interface TimelineProps {
  items: Array<{
    title: string;
    date?: string;
    isCompleted: boolean;
  }>;
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <TimelineItem
          key={index}
          {...item}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
