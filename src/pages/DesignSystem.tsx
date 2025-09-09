
import React from "react";
import { ProfessionalButton, buttonVariants } from "@/components/ui/enhanced/ProfessionalButton";
import { 
  ProfessionalCard, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/enhanced/ProfessionalCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { 
  Car, 
  Search, 
  Star, 
  Heart, 
  Settings, 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar
} from "lucide-react";

const DesignSystem = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
            Professional Design System
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive collection of polished, professional UI components designed for excellence.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Color Palette */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Color Palette</h2>
            <ProfessionalCard variant="elevated" className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Primary</h3>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-primary rounded-lg"></div>
                    <div className="w-full h-8 bg-primary-light rounded-lg"></div>
                    <div className="w-full h-8 bg-primary-dark rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Success</h3>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-success rounded-lg"></div>
                    <div className="w-full h-8 bg-success-light rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Warning</h3>
                  <div className="space-y-2">
                    <div className="w-full h-12 bg-warning rounded-lg"></div>
                    <div className="w-full h-8 bg-warning-light rounded-lg"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Neutral</h3>
                  <div className="space-y-2">
                    <div className="w-full h-8 bg-muted rounded-lg"></div>
                    <div className="w-full h-8 bg-muted-foreground rounded-lg"></div>
                    <div className="w-full h-8 bg-border rounded-lg"></div>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </section>

          {/* Typography */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Typography</h2>
            <ProfessionalCard variant="elevated" className="p-8">
              <div className="space-y-8">
                <div>
                  <h1 className="text-5xl font-bold mb-2">Heading 1</h1>
                  <p className="text-sm text-muted-foreground">text-5xl font-bold</p>
                </div>
                <div>
                  <h2 className="text-4xl font-bold mb-2">Heading 2</h2>
                  <p className="text-sm text-muted-foreground">text-4xl font-bold</p>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">Heading 3</h3>
                  <p className="text-sm text-muted-foreground">text-3xl font-bold</p>
                </div>
                <div>
                  <p className="text-xl mb-2">Large body text for emphasis and readability.</p>
                  <p className="text-sm text-muted-foreground">text-xl</p>
                </div>
                <div>
                  <p className="text-base mb-2">Regular body text for content and descriptions.</p>
                  <p className="text-sm text-muted-foreground">text-base</p>
                </div>
                <div>
                  <p className="text-sm mb-2 text-muted-foreground">Small text for captions and secondary information.</p>
                  <p className="text-sm text-muted-foreground">text-sm text-muted-foreground</p>
                </div>
              </div>
            </ProfessionalCard>
          </section>

          {/* Buttons */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Buttons</h2>
            <ProfessionalCard variant="elevated" className="p-8">
              <div className="space-y-8">
                
                {/* Button Variants */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Button Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <ProfessionalButton>Primary Button</ProfessionalButton>
                    <ProfessionalButton variant="outline">Outline Button</ProfessionalButton>
                    <ProfessionalButton variant="secondary">Secondary Button</ProfessionalButton>
                    <ProfessionalButton variant="premium">Premium Button</ProfessionalButton>
                    <ProfessionalButton variant="success">Success Button</ProfessionalButton>
                    <ProfessionalButton variant="warning">Warning Button</ProfessionalButton>
                    <ProfessionalButton variant="ghost">Ghost Button</ProfessionalButton>
                  </div>
                </div>

                {/* Button Sizes */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Button Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <ProfessionalButton size="sm">Small</ProfessionalButton>
                    <ProfessionalButton size="default">Default</ProfessionalButton>
                    <ProfessionalButton size="lg">Large</ProfessionalButton>
                    <ProfessionalButton size="xl">Extra Large</ProfessionalButton>
                  </div>
                </div>

                {/* Button States */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Button States</h3>
                  <div className="flex flex-wrap gap-4">
                    <ProfessionalButton icon={<Car className="w-4 h-4" />}>With Icon</ProfessionalButton>
                    <ProfessionalButton loading>Loading</ProfessionalButton>
                    <ProfessionalButton disabled>Disabled</ProfessionalButton>
                    <ProfessionalButton 
                      icon={<Search className="w-4 h-4" />}
                      iconPosition="right"
                    >
                      Icon Right
                    </ProfessionalButton>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </section>

          {/* Cards */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Default Card */}
              <ProfessionalCard variant="default">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    Default Card
                  </CardTitle>
                  <CardDescription>
                    A standard card with default styling and subtle shadow effects.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Perfect for displaying content in an organized, visually appealing way.
                  </p>
                </CardContent>
                <CardFooter>
                  <ProfessionalButton size="sm" className="w-full">Learn More</ProfessionalButton>
                </CardFooter>
              </ProfessionalCard>

              {/* Elevated Card */}
              <ProfessionalCard variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Elevated Card
                  </CardTitle>
                  <CardDescription>
                    Enhanced with larger shadows and hover effects for emphasis.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ideal for highlighting important content or featured items.
                  </p>
                </CardContent>
                <CardFooter>
                  <ProfessionalButton size="sm" variant="outline" className="w-full">Explore</ProfessionalButton>
                </CardFooter>
              </ProfessionalCard>

              {/* Premium Card */}
              <ProfessionalCard variant="premium">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Premium Card
                  </CardTitle>
                  <CardDescription>
                    Featuring gradient backgrounds and premium styling.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Perfect for premium features or upgrade prompts.
                  </p>
                </CardContent>
                <CardFooter>
                  <ProfessionalButton size="sm" variant="premium" className="w-full">Upgrade</ProfessionalButton>
                </CardFooter>
              </ProfessionalCard>
            </div>
          </section>

          {/* Form Elements */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Form Elements</h2>
            <ProfessionalCard variant="elevated" className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name"
                      placeholder="Enter your full name"
                      className="focus-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className="focus-ring"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="select">Select Option</Label>
                    <Select>
                      <SelectTrigger className="focus-ring">
                        <SelectValue placeholder="Choose an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="option1">Option 1</SelectItem>
                        <SelectItem value="option2">Option 2</SelectItem>
                        <SelectItem value="option3">Option 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message"
                      placeholder="Enter your message..."
                      className="focus-ring"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Notifications</Label>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Email notifications</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS notifications</span>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Volume ({75}%)</Label>
                    <Slider defaultValue={[75]} max={100} step={1} />
                  </div>

                  <div className="space-y-2">
                    <Label>Progress</Label>
                    <Progress value={60} className="w-full" />
                  </div>

                  <div className="space-y-3">
                    <Label>Badges</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Default</Badge>
                      <Badge variant="secondary">Secondary</Badge>
                      <Badge variant="outline">Outline</Badge>
                      <Badge variant="destructive">Destructive</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </ProfessionalCard>
          </section>

          {/* Tabs */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Tabs & Navigation</h2>
            <ProfessionalCard variant="elevated" className="p-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Analytics
                  </TabsTrigger>
                  <TabsTrigger value="reports" className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Reports
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { icon: <Mail className="w-8 h-8" />, title: "Messages", value: "127" },
                      { icon: <Phone className="w-8 h-8" />, title: "Calls", value: "43" },
                      { icon: <MapPin className="w-8 h-8" />, title: "Locations", value: "8" },
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-6 rounded-xl bg-muted/50">
                        <div className="text-primary mb-2 flex justify-center">{stat.icon}</div>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="text-sm text-muted-foreground">{stat.title}</div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-6">
                  <p className="text-muted-foreground">Analytics dashboard content goes here...</p>
                </TabsContent>
                
                <TabsContent value="reports" className="mt-6">
                  <p className="text-muted-foreground">Reports and data visualization content...</p>
                </TabsContent>
                
                <TabsContent value="settings" className="mt-6">
                  <p className="text-muted-foreground">Settings and configuration options...</p>
                </TabsContent>
              </Tabs>
            </ProfessionalCard>
          </section>

          {/* Animation Showcase */}
          <section className="animate-slide-in-bottom">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Animations & Effects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ProfessionalCard variant="default" className="text-center p-6 animate-fade-in">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Fade In</h3>
                <p className="text-sm text-muted-foreground">animate-fade-in</p>
              </ProfessionalCard>

              <ProfessionalCard variant="default" className="text-center p-6 animate-slide-in-bottom">
                <Search className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Slide Bottom</h3>
                <p className="text-sm text-muted-foreground">animate-slide-in-bottom</p>
              </ProfessionalCard>

              <ProfessionalCard variant="default" className="text-center p-6 animate-scale-in">
                <Star className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Scale In</h3>
                <p className="text-sm text-muted-foreground">animate-scale-in</p>
              </ProfessionalCard>

              <ProfessionalCard variant="default" className="text-center p-6 animate-pulse-slow">
                <Heart className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Pulse</h3>
                <p className="text-sm text-muted-foreground">animate-pulse-slow</p>
              </ProfessionalCard>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default DesignSystem;
