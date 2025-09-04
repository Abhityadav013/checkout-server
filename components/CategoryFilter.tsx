import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { CategoryWithItems } from '@/lib/types/categoryItems';

interface CategoryListProps {
  categories: CategoryWithItems[];
  activeCategory: string;
  onCategoryClick: (categoryId: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  activeCategory,
  onCategoryClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeCategoryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeCategoryRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const activeElement = activeCategoryRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const elementRect = activeElement.getBoundingClientRect();
      
      if (elementRect.left < containerRect.left || elementRect.right > containerRect.right) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeCategory]);

  return (
    <div className="sticky top-32 lg:top-32 md:top-32 xs:top-0 sm:top-0 z-30 bg-white border-b border-gray-200 px-4 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 overflow-x-auto scrollbar-hide p-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              ref={activeCategory === category.id ? activeCategoryRef : null}
              onClick={() => onCategoryClick(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
              }`}
            >
              <Image
                src={category.imageUrl ?? ''}
                alt={category.categoryName}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover"
              />
              {category.categoryName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};