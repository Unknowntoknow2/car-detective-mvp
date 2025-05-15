
import React, { useState } from 'react';
import { Heading, Paragraph } from '@/components/ui-kit/typography';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { User, LockKeyhole, Building2, Bell, Upload } from 'lucide-react';

const DealerProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <Heading level={1} className="text-3xl font-bold">Dealer Profile Settings</Heading>
        <Paragraph className="text-muted-foreground mt-2">
          Manage your account, business information, and notification preferences
        </Paragraph>
      </div>

      <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8 w-full sm:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <LockKeyhole size={16} />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="business" className="flex items-center gap-2">
            <Building2 size={16} />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="logo" className="flex items-center gap-2">
            <Upload size={16} />
            <span className="hidden sm:inline">Logo</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell size={16} />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal and business contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input 
                    id="full-name" 
                    defaultValue="John Smith" 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input 
                    id="business-name" 
                    defaultValue="Smith Auto Sales" 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue="john@smithauto.com" 
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">Contact support to change your email address</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    defaultValue="(555) 123-4567" 
                    disabled={!isEditing} 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Dealership Address</Label>
                  <Input 
                    id="address" 
                    defaultValue="123 Main St, Anytown, CA 90210" 
                    disabled={!isEditing} 
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and account security options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="2fa" className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch id="2fa" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-2">Activity Log</h3>
                <div className="space-y-2 text-sm">
                  <p>Last login: Yesterday at 2:30 PM</p>
                  <p>IP Address: 192.168.1.1</p>
                  <p>Browser: Chrome on Windows</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Security Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Manage your dealership business details and documentation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-number">Dealership License Number</Label>
                  <Input id="license-number" defaultValue="DL-12345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <select 
                    id="state"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dealer-type">Dealer Type</Label>
                  <select 
                    id="dealer-type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="independent">Independent</option>
                    <option value="franchise">Franchise</option>
                    <option value="online">Online</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID (optional)</Label>
                  <Input id="tax-id" defaultValue="12-3456789" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="mb-2 block">Upload W-9 or Business Certificate</Label>
                <div className="border-2 border-dashed rounded-md p-8 text-center">
                  <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
                  <p className="text-xs text-muted-foreground mb-4">PDF, JPG or PNG up to 5MB</p>
                  <Button size="sm" variant="secondary">
                    Browse Files
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Business Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="logo">
          <Card>
            <CardHeader>
              <CardTitle>Logo Upload</CardTitle>
              <CardDescription>
                Upload your dealership logo for your profile and reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center">
                <Avatar className="h-32 w-32">
                  <div className="flex h-full w-full items-center justify-center bg-muted text-xl font-semibold">
                    S
                  </div>
                </Avatar>
                <p className="text-sm text-muted-foreground mt-2">
                  Current dealership logo
                </p>
              </div>

              <div className="border-2 border-dashed rounded-md p-8 text-center">
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm font-medium mb-1">Drag and drop a new logo</p>
                <p className="text-xs text-muted-foreground mb-4">JPG, PNG or SVG up to 2MB</p>
                <Button size="sm" variant="secondary">
                  Browse Files
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Update Logo</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications when someone views your inventory</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive SMS alerts for lead inquiries</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications" className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch id="push-notifications" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DealerProfileSettings;
