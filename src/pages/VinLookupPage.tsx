
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function VinLookupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">VIN Decoder</h1>
          <p className="text-center text-muted-foreground mb-8">
            Decode any Vehicle Identification Number to get detailed information about the vehicle.
          </p>
          <VinDecoderForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
