export interface OrderLineDTO {
  articleId: string;
  quantity: number;
  price: number;
}

export interface OrderDTO {
  sellerName: string;
  saleDate: string;
  email: string;
  dailySummary: number,
  items: OrderLineDTO[];
}
