export interface InventoryDto {
  id: string;
  title: string;
  ownerName: string;
  itemsCount: number;
  likesCount: number;
  imageUrl?: string | null;
}
