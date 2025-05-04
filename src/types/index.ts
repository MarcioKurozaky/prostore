import { z } from "zod";

import {
  cartItemSchema,
  insertCartSchema,
  insertProductSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  shippingAddressSchema,
  type paymentResultSchema,
  type updateUserSchema,
  type insertCategorySchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating: string;
  numReviews: number;
  createdAt: Date;
};

//card type Schema
export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof cartItemSchema>;

//Shipping Address type
export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

// Order  and Order Item type
export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  createdAt: Date;
  isPaid: Boolean;
  paidAt: Date | null;
  isDelivered: Boolean;
  deliveredAt: Date | null;
  orderitems: OrderItem[];
  user: { name: string; email: string };
};

//Payment Result types
export type PaymentResult = z.infer<typeof paymentResultSchema>;

//user type Schema
export type User = z.infer<typeof updateUserSchema> & {
  id: string;
  name: string;
  email: string;
  role: string;
};

//Category type Schema
export type Category = z.infer<typeof insertCategorySchema> & {
  id: string;
  createdAt: Date;
};
