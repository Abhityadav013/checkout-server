export enum SpicyLevel {
  NO_SPICY = "no_spicy",
  SPICY = "spicy",
  VERY_SPICY = "very_spicy",
}

export enum OrderType {
  DELIVERY = "DELIVERY",
  PICKUP = "PICKUP",
}

export enum OrderStatus {
  PENDING = "PENDING", // Order received but not yet accepted by the restaurant
  ACCEPTED = "ACCEPTED", // Restaurant has accepted the order
  PREPARING = "PREPARING", // Order is being prepared (merged with "IN_PROGRESS")
  IN_PROGRESS = "IN_PROGRESS", // Being prepared (merged with "PREPARING")
  COOKED = "COOKED", // Cooking/preparation is done
  READY = "READY", // Order is ready for pickup/delivery
  READY_FOR_PICKUP = "READY_FOR_PICKUP", // For pickup orders, ready at counter
  OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY", // For delivery orders, delivery person picked it
  DELIVERED = "DELIVERED", // Customer received the order
  CANCELLED = "CANCELLED", // Order was cancelled
  FAILED = "FAILED", // Payment or processing failure (optional)
  COMPLETED = "COMPLETED", // Final state (DELIVERED or PICKED_UP with confirmation)
}
