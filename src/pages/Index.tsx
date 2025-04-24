
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Vehicle Intelligence Platform
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Access comprehensive vehicle data with our cutting-edge VIN and license plate lookup tools
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/lookup/vin">
                  <Button size="lg" className="text-lg px-8">
                    Decode VIN
                  </Button>
                </Link>
                <Link to="/lookup/plate">
                  <Button size="lg" variant="outline" className="text-lg px-8">
                    Lookup Plate
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">VIN Decoder</CardTitle>
                  <CardDescription>Unlock detailed vehicle information</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our VIN decoder provides detailed information about a vehicle, including make, model, year, engine, transmission, and more.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/lookup/vin" className="w-full">
                    <Button className="w-full">Try VIN Lookup</Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-2xl">License Plate Lookup</CardTitle>
                  <CardDescription>Identify vehicles by license plate</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Search for vehicle details using any US license plate number and state. Get make, model, year, and color information.
                  </p>
                </CardContent>
                <CardFooter>
                  <Link to="/lookup/plate" className="w-full">
                    <Button className="w-full">Try Plate Lookup</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
