import { MenuCategory } from "./category";
import { MenuItem } from "./menu";

export interface CategoryWithItems extends MenuCategory {
  items: MenuItem[];
}
