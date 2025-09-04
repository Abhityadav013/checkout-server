import React from 'react';
import Image from 'next/image';
import { Plus, Leaf, Flame } from 'lucide-react';
import { MenuItem as MenuItemType} from '@/lib/types/menu';

interface MenuItemProps {
  item: MenuItemType;
  onAddToBasket: (item: MenuItemType) => void;
  isRestaurantOpen?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({ item, onAddToBasket, isRestaurantOpen = true }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="relative w-full sm:w-32 h-32 sm:h-24 flex-shrink-0 overflow-hidden">
          <Image
            src={item.imageURL}
            alt={item.name}
            width={128}
            height={128}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex gap-1">
            {item.vegetarian && (
              <div className="bg-green-100 text-green-800 p-1 rounded-full shadow-sm">
                <Leaf className="h-3 w-3" />
              </div>
            )}
            {!item.vegetarian && (
              <div className="bg-red-100 text-red-800 p-1 rounded-full shadow-sm">
                <Leaf className="h-3 w-3" />
              </div>
            )}
            {item.spicy && (
              <div className="bg-red-100 text-red-600 p-1 rounded-full shadow-sm">
                <Flame className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2">
                {item.name}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{item.description}</p>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
              <span className="text-xl font-bold text-gray-900">€{item.price.toFixed(2)}</span>
              <button
                onClick={() => onAddToBasket(item)}
                disabled={!isRestaurantOpen}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm ${
                  isRestaurantOpen
                    ? 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-md transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={!isRestaurantOpen ? 'Restaurant is currently closed' : 'Add to cart'}
              >
                <Plus className="h-4 w-4" />
                {isRestaurantOpen ? 'Add' : 'Closed'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};