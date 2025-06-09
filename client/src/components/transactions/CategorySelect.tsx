// client/src/components/transactions/CategorySelect.tsx
import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { TRANSACTION_CATEGORIES, CATEGORY_COLORS } from '../../constants';

interface CategorySelectProps {
  currentCategory: string;
  transactionId: string;
  plaidId: string;
  onCategoryChange: (plaidId: string, category: string) => Promise<void>;
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  currentCategory,
  transactionId,
  plaidId,
  onCategoryChange,
  disabled = false
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleCategoryChange = async (newCategory: string) => {
    if (newCategory === currentCategory || isUpdating) return;
    
    setIsUpdating(true);
    try {
      await onCategoryChange(plaidId, newCategory);
    } catch (error) {
      console.error('Failed to update category:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getCategoryColor = (category: string) => {
    return CATEGORY_COLORS[category] || 'hsl(0, 0%, 60%)';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled || isUpdating}
          className="h-8 justify-start px-2 py-1 text-xs"
        >
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getCategoryColor(currentCategory) }}
            />
            <span className="truncate max-w-[100px]">{currentCategory}</span>
            <ChevronDown className="w-3 h-3 ml-1" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {TRANSACTION_CATEGORIES.map((category) => (
          <DropdownMenuItem
            key={category}
            onClick={() => handleCategoryChange(category)}
            className="flex items-center space-x-2"
          >
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getCategoryColor(category) }}
            />
            <span className="flex-1">{category}</span>
            {category === currentCategory && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};