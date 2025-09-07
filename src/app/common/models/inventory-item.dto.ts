export interface InventoryItemDto {
  id: string;
  customId: string;
  createdByName: string;
  createdAt: string;
  likesCount: number;
  userLike: boolean;
  fields: ItemFieldValueDto[];
}

export interface ItemFieldValueDto {
  fieldId: string;
  fieldTitle: string;
  type: number;
  stringValue?: string | null;
  numericValue?: number | null;
  boolValue?: boolean | null;
}
