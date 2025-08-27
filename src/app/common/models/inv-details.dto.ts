export interface InvDetailsDto {
  id: string;
  title: string;
  ownerName: string;
  descriptionMarkdown: string;
  imageUrl: string;
  createdAt: string;
  itemsCount: number;
  likesCount: number;
  tags: string[];
  fields: InvField[];
}

export interface InvField {
  id: string;
  title: string;
  type: string;
  showInTable: boolean;
  order: number;
}
