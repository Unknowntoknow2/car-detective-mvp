
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function PlateLookupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">License Plate Lookup</h1>
          <p className="text-center text-muted-foreground mb-8">
            Look up any US license plate to get information about the vehicle.
          </p>
          <PlateDecoderForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
