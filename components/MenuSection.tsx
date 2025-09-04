import React, { forwardRef, memo } from 'react';
import Image from 'next/image';
import { CategoryWithItems } from '@/lib/types/categoryItems';
import { MenuItem as MenuItemType } from '@/lib/types/menu';
import { MenuItem as MenuItemComponent } from './MenuItem';

interface MenuSectionProps {
  category: CategoryWithItems;
  onAddToBasket: (item: MenuItemType) => void;
  isRestaurantOpen?: boolean;
}

// --- Reusable Badge Component ---
const Badge = ({ children, className }: { children: React.ReactNode; className: string }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${className}`}>{children}</span>
);

// --- Memoized MenuItem for performance ---
const MemoizedMenuItem = memo(MenuItemComponent);
MemoizedMenuItem.displayName = 'MemoizedMenuItem';

// --- Optional Category Header extraction ---
const CategoryHeader = ({ category }: { category: CategoryWithItems }) => (
  <div className="flex items-center gap-4 mb-6">
    <Image
      src={category.imageUrl}
      alt={category.categoryName}
      width={48}
      height={48}
      loading="lazy"
      className="w-12 h-12 rounded-full object-cover border-2 border-orange-200"
    />
    <div>
      <h2 className="text-2xl font-bold text-gray-900">{category.categoryName}</h2>
      <div className="flex items-center gap-2 mt-1">
        {category.vegetarian && (
          <Badge className="bg-green-100 text-green-800">Vegetarian Options</Badge>
        )}
        {category.spicy && (
          <Badge className="bg-red-100 text-red-600">Spicy Options</Badge>
        )}
      </div>
    </div>
  </div>
);

// --- Main MenuSection ---
export const MenuSection = forwardRef<HTMLDivElement, MenuSectionProps>((props, ref) => {
  const { category, onAddToBasket, isRestaurantOpen = true } = props;

  return (
    <div ref={ref} id={category.id} className="mb-12">
      <CategoryHeader category={category} />

      {/* Single column layout for all screen sizes */}
      <div className="grid grid-cols-1 gap-4">
        {category.items.map((item) => (
          <MemoizedMenuItem
            key={item.id}
            item={item}
            onAddToBasket={onAddToBasket}
            isRestaurantOpen={isRestaurantOpen}
          />
        ))}
      </div>
    </div>
  );
});

MenuSection.displayName = 'MenuSection';
