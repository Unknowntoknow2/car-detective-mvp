
import React, { useState } from "react";
import { SigninForm } from "@/components/auth/forms/SigninForm";
import { SignupForm } from "@/components/auth/forms/SignupForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UnifiedAuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={mode} className="w-full" onValueChange={(v) => setMode(v as "signin" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SigninForm />
            </TabsContent>
            <TabsContent value="signup">
              <SignupForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
