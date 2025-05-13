import { DollarSign, Headset, ShoppingBag, WalletCards } from "lucide-react";
import { Card, CardContent } from "../ui/card";

const features = [
  {
    icon: <ShoppingBag className="w-6 h-6 text-primary" />,
    title: "Free Shipping",
    description: "Free shipping on orders above $100",
  },
  {
    icon: <DollarSign className="w-6 h-6 text-primary" />,
    title: "Money Back Guarantee",
    description: "Within 30 days of purchase",
  },
  {
    icon: <WalletCards className="w-6 h-6 text-primary" />,
    title: "Flexible Payment",
    description: "Pay with credit card, PayPal or COD",
  },
  {
    icon: <Headset className="w-6 h-6 text-primary" />,
    title: "24/7 Support",
    description: "Get support at any time",
  },
];

export default function IconBoxes() {
  return (
    <Card className="bg-muted/50 border-none shadow-md rounded-2xl">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 p-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center space-y-2 hover:bg-muted/30 p-4 rounded-xl transition-colors duration-300"
          >
            <div className="bg-primary/10 p-3 rounded-full">{feature.icon}</div>
            <div className="text-base font-semibold">{feature.title}</div>
            <div className="text-sm text-muted-foreground">
              {feature.description}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
