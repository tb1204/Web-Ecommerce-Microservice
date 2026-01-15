interface CartProduct {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  color?: string;
  size?: string;
}

interface Cart {
  products: CartProduct[];
  totalPrice: number;
}

export type { CartProduct, Cart };
