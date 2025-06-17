import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

const OfferSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  zipCode: z.string().min(5, {
    message: "Zip code must be at least 5 digits.",
  }),
  contactPreference: z.enum(["email", "phone"]),
  tradeIn: z.boolean().default(false),
  tradeInDetails: z.string().optional(),
});

type OfferValues = z.infer<typeof OfferSchema>;

export default function ViewOfferPage() {
  const router = useRouter();
  const { token } = router.query;
  const [offer, setOffer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchOffer = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Mock API call
        setTimeout(() => {
          const mockOffer = {
            id: token,
            estimatedValue: 18500,
            vehicle: {
              make: "Toyota",
              model: "Camry",
              year: 2020,
            },
            dealer: {
              name: "Best Auto Deals",
              location: "123 Main St, Anytown",
            },
          };
          setOffer(mockOffer);
          setIsLoading(false);
        }, 1000);
      } catch (err: any) {
        setError(err.message || "Failed to load offer");
        setIsLoading(false);
      }
    };

    fetchOffer();
  }, [token]);

  const form = useForm<OfferValues>({
    resolver: zodResolver(OfferSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zipCode: "",
      contactPreference: "email",
      tradeIn: false,
      tradeInDetails: "",
    },
  });

  const handleAcceptOffer = async (
    contactInfo: OfferValues,
    estimatedValue: number,
  ) => {
    try {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        toast.success(
          `Offer accepted! We'll contact you soon.`,
        );
        setIsAccepted(true);
        setIsLoading(false);
      }, 1000);
    } catch (error: any) {
      toast.error("Failed to accept offer. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      {isLoading && <p>Loading offer...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {offer && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">
              Offer Details
            </CardTitle>
            <CardDescription>
              Review the offer details and accept to proceed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Vehicle</h3>
              <p>
                {offer.vehicle.year} {offer.vehicle.make} {offer.vehicle.model}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Estimated Value</h3>
              <p className="text-xl font-bold text-green-600">
                ${offer.estimatedValue}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Dealer</h3>
              <p>{offer.dealer.name}</p>
              <p className="text-muted-foreground">{offer.dealer.location}</p>
            </div>

            {!isAccepted ? (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((values) =>
                    handleAcceptOffer(
                      values,
                      offer?.estimatedValue || 0
                    ))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your.email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123-456-7890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactPreference"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Contact Preference</FormLabel>
                        <div className="space-y-2">
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "email"}
                                onCheckedChange={() => field.onChange("email")}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Email</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value === "phone"}
                                onCheckedChange={() => field.onChange("phone")}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">Phone</FormLabel>
                          </FormItem>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="tradeIn"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-md border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Trade-in Vehicle?
                          </FormLabel>
                          <FormDescription>
                            Do you have a vehicle to trade in?
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {form.watch("tradeIn") && (
                    <FormField
                      control={form.control}
                      name="tradeInDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trade-in Details</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter details about your trade-in vehicle"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full">
                    Accept Offer
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center">
                <p className="text-green-600 font-semibold">
                  Offer Accepted!
                </p>
                <p>We will contact you soon to finalize the details.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
