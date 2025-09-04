export interface Info {
  restaurantId: string;
  currentDay: string;
  openingHours: TimeRange[];
  isOpenNow: boolean;
  nextOpeningTime: string;
}
interface TimeRange {
  start: string;
  end: string;
}
