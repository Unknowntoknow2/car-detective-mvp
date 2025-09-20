
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DealerSignupForm } from "@/components/dealer/DealerSignupForm";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Building2 } from "lucide-react";

export default function DealerSignup() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Dealership Registration
          </h1>

          <Card className="shadow-md border-blue-200">
            <CardHeader className="space-y-1 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">
                  Create Dealership Account
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <CardDescription>
                Register your dealership to access leads and exclusive dealer
                tools
              </CardDescription>
            </CardHeader>

            <CardContent>
              <DealerSignupForm />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 border-t pt-4">
              <p className="text-sm text-center text-muted-foreground">
                Already have a dealer account?
              </p>
              <Button variant="outline" asChild className="w-full">
                <Link to="/login-dealer">Sign in to Dealer Portal</Link>
              </Button>
              <div className="text-xs text-center text-muted-foreground">
                Looking for personal vehicle valuation?{" "}
                <Link to="/login-user" className="text-primary hover:underline">
                  Sign in as User
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
