"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { FormEvent, useState } from "react";
import config from "../../../../../../middleware";

type CheckoutFormProps = {
  product: {
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
  clientSecret: string;
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export function CheckoutForm({ product, clientSecret }: CheckoutFormProps) {
  return (
    <>
      <div className="max-w5xl w-full mx-auto space-y-8">
        <div className="flex gap-4 items-center">
          <div className="aspect-video flex-shrink-0 w-1/3 relative">
            <Image
              src={product.imagePath}
              fill
              alt={product.name}
              className="object-cover"
            />
          </div>
          <div>
            <div className="text-lg">
              {formatCurrency(product.priceInCents / 100)}
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <div className="line-clamp-3 text-muted-foreground">
              {product.description}
            </div>
          </div>
        </div>
        <Elements options={{ clientSecret }} stripe={stripePromise}>
          <Form priceInCents={product.priceInCents} />
        </Elements>
      </div>
    </>
  );
}

function Form({ priceInCents }: { priceInCents: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (stripe == null || elements == null) return;

    setIsLoading(true);

    // TODO: Check for existing order

    stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
      },
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription className="text-destructive">Error</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentElement />
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            size="lg"
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Purchasing..."
              : `Purchase - ${formatCurrency(priceInCents / 100)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
