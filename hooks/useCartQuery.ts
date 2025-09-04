import { MenuItem } from '@/lib/types/menu';
import { useGetCartQuery } from '@/store/api/cartApi';
import { useMemo, useCallback } from 'react';


type UseCartDataOptions = {
  menuItems?: MenuItem[];
  persistTotalToSession?: boolean;
};

export function useCartData(options: UseCartDataOptions = {}) {
  const { menuItems = [], persistTotalToSession = true } = options;

  const {
    data: cart = { cartItems: [], basketId: '' },
    isLoading,
    isFetching,
    refetch,
  } = useGetCartQuery();

  const findMenuItem = useCallback(
    (id: string) => menuItems.find((m) => m.id === id),
    [menuItems]
  );

  const getItemQuantity = useCallback(
    (itemId: string) =>
      cart.cartItems.find((x) => x.itemId === itemId)?.quantity || 0,
    [cart.cartItems]
  );

  const getTotalItems = useCallback(
    () => cart.cartItems.reduce((sum, x) => sum + x.quantity, 0),
    [cart.cartItems]
  );

  const cartTotal = useMemo(() => {
    const total = cart.cartItems.reduce((sum, ci) => {
      const mi = findMenuItem(ci.itemId);
      return mi ? sum + mi.price * ci.quantity : sum;
    }, 0);
    if (persistTotalToSession && typeof window !== 'undefined') {
      sessionStorage.setItem('cartTotal', JSON.stringify(total));
    }
    return total;
  }, [cart.cartItems, findMenuItem, persistTotalToSession]);

  const getItemPriceWithMenu = useCallback(
    (itemId: string) => {
      const ci = cart.cartItems.find((x) => x.itemId === itemId);
      const mi = findMenuItem(itemId);
      const price = mi?.price ?? 0;
      const quantity = ci?.quantity ?? 0;
      return { totalPrice: price * quantity, menu: mi };
    },
    [cart.cartItems, findMenuItem]
  );

  const getMenuItem = useCallback(
    (itemId: string) => findMenuItem(itemId) ?? ({} as MenuItem),
    [findMenuItem]
  );

  return {
    // status
    isLoading: isLoading || isFetching,
    refetch,

    // data
    items: cart.cartItems,
    basketId: cart.basketId,

    // selectors/helpers
    getItemQuantity,
    getTotalItems,
    cartTotal,
    getItemPriceWithMenu,
    getMenuItem,
  };
}
