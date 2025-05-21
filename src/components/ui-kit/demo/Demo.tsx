import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

// Add TableColumn type definition
interface TableColumn<T> {
  header: string;
  accessor: string;
  cell?: (row: T) => React.ReactNode;
}

interface DemoProps {
  title?: string;
  description?: string;
}

export function Demo({ title = "UI Components Demo", description = "Explore our UI components" }: DemoProps) {
  const [activeTab, setActiveTab] = useState("buttons");
  const [switchValue, setSwitchValue] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSwitchChange = (checked: boolean) => {
    setSwitchValue(checked);
    toast.success(`Switch ${checked ? 'enabled' : 'disabled'}`);
  };

  // Define specific interfaces for your data types
  interface CarData {
    id: number;
    name: string;
    price: string;
    year: number;
    condition: string;
  }

  const carColumns: TableColumn<CarData>[] = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "price" },
    { header: "Year", accessor: "year" },
    { header: "Condition", accessor: "condition", 
      cell: (row) => (
        <Badge variant={row.condition === "Excellent" ? "default" : 
                        row.condition === "Good" ? "secondary" : 
                        row.condition === "Fair" ? "outline" : "destructive"}>
          {row.condition}
        </Badge>
      )
    }
  ];

  const tableData = [
    { id: 1, name: "Toyota Camry", price: "$25,000", year: 2020, condition: "Excellent" },
    { id: 2, name: "Honda Accord", price: "$22,500", year: 2019, condition: "Good" },
    { id: 3, name: "Ford Mustang", price: "$35,000", year: 2021, condition: "Excellent" },
    { id: 4, name: "Chevrolet Malibu", price: "$18,750", year: 2018, condition: "Fair" },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>

      <Tabs defaultValue="buttons" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="forms">Form Controls</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="avatars">Avatars & Badges</TabsTrigger>
        </TabsList>

        <TabsContent value="buttons" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Button Variants</h2>
          <div className="flex flex-wrap gap-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>

          <h2 className="text-xl font-semibold mb-4 mt-8">Button Sizes</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </TabsContent>

        <TabsContent value="cards">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>A simple card with header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a basic card component with a header, description, and content area.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
                <CardDescription>A card with actions in the footer</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card includes a footer with action buttons.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="forms">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Controls</CardTitle>
                <CardDescription>Text inputs and labels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" value={inputValue} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toggle Controls</CardTitle>
                <CardDescription>Checkboxes and switches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="notifications" checked={switchValue} onCheckedChange={handleSwitchChange} />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Data Table</CardTitle>
              <CardDescription>A table displaying vehicle information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>List of available vehicles</TableCaption>
                <TableHeader>
                  <TableRow>
                    {carColumns.map((column) => (
                      <TableHead key={column.accessor}>{column.header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((row: any) => (
                    <TableRow key={row.id}>
                      {carColumns.map((column) => (
                        <TableCell key={`${row.id}-${column.accessor}`}>
                          {column.cell ? column.cell(row) : row[column.accessor as keyof typeof row]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avatars">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Avatars</CardTitle>
                <CardDescription>User profile images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarImage src="https://github.com/vercel.png" alt="@vercel" />
                    <AvatarFallback>VC</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Demo;
