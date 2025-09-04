import { useRef, useCallback } from 'react';
import type { BasketItem } from '@/lib/types/basket';
import { SpicyLevel } from '@/lib/types/enums';
import { MenuItem } from '@/lib/types/menu';
import { useGetCartQuery, useUpdateCartMutation } from '@/store/api/cartApi';

export type UpdateCustomization = {
  notes: string;
  options: string[];
  spicyLevel: SpicyLevel;
};

export function useCartActions() {
  // Read current cache for building the next full-replacement payloads
  const { data: cart = { cartItems: [], basketId: '' } } = useGetCartQuery();
  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation();

  // Serialize operations to avoid races without dropping user actions
  const queueRef = useRef<Promise<unknown>>(Promise.resolve());

  const enqueue = useCallback<<T>(fn: () => Promise<T>) => Promise<T>>((fn) => {
    const next = queueRef.current.then(fn);
    // Keep the queue alive regardless of outcome
    queueRef.current = next.then(
      () => undefined,
      () => undefined
    );
    return next;
  }, []);

  // Helpers to build next cart array (full replacement)
  const upsertLine = (lines: BasketItem[], item: MenuItem) => {
    const next = [...lines];
    const idx = next.findIndex((l) => l.itemId === item.id);
    if (idx >= 0) {
      const q = next[idx].quantity + 1;
      next[idx] = { ...next[idx], quantity: q, price: item.price * q };
    } else {
      next.push({ itemId: item.id, itemName: item.name, quantity: 1, price: item.price });
    }
    return next;
  };

  const decrementOrRemove = (lines: BasketItem[], item: MenuItem) => {
    const next = [...lines];
    const idx = next.findIndex((l) => l.itemId === item.id);
    if (idx >= 0) {
      const q = next[idx].quantity - 1;
      if (q > 0) next[idx] = { ...next[idx], quantity: q, price: item.price * q };
      else next.splice(idx, 1);
    }
    return next;
  };

  const removeLine = (lines: BasketItem[], itemId: string) =>
    lines.filter((l) => l.itemId !== itemId);

  // Public actions
  const addToCart = useCallback(
    (item: MenuItem) =>
      enqueue(async () => {
        const next = upsertLine(cart.cartItems, item);
        return updateCart({ cart: next }).unwrap();
      }),
    [cart.cartItems, enqueue, updateCart]
  );

  const removeFromCart = useCallback(
    (item: MenuItem) =>
      enqueue(async () => {
        const next = decrementOrRemove(cart.cartItems, item);
        return updateCart({ cart: next }).unwrap();
      }),
    [cart.cartItems, enqueue, updateCart]
  );

  const deleteItemFromCart = useCallback(
    (itemId: string) =>
      enqueue(async () => {
        const next = removeLine(cart.cartItems, itemId);
        return updateCart({ cart: next }).unwrap();
      }),
    [cart.cartItems, enqueue, updateCart]
  );

  const clearCart = useCallback(
    () =>
      enqueue(async () => {
        return updateCart({ cart: [], isCartEmpty: true }).unwrap();
      }),
    [enqueue, updateCart]
  );

  const updateItemCustomization = useCallback(
    (itemId: string, customization: UpdateCustomization) =>
      enqueue(async () => {
        const next = cart.cartItems.map((l) =>
          l.itemId === itemId ? { ...l, customization } : l
        );
        return updateCart({ cart: next }).unwrap();
      }),
    [cart.cartItems, enqueue, updateCart]
  );

  return {
    isUpdating,
    addToCart,
    removeFromCart,
    deleteItemFromCart,
    clearCart,
    updateItemCustomization,
  };
}
