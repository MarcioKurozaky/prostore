import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

// Setup WebSocket
neonConfig.webSocketConstructor = ws;

// Get connection string from environment
const connectionString = process.env.DATABASE_URL!;

//  Crie o adapter diretamente com a string de conexão
const adapter = new PrismaNeon({ connectionString });

// Prisma client com transformações customizadas
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});
