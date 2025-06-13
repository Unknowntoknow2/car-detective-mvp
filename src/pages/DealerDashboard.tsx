import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, FileTextIcon, LineChartIcon, UploadIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DealerDashboardContent = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Valuations This Week",
      value: "54",
      icon: <LineChartIcon className="h-6 w-6" />,
    },
    {
      title: "Average Vehicle Price",
      value: "$18,450",
      icon: <FileTextIcon className="h-6 w-6" />,
    },
    {
      title: "Inventory Uploaded",
      value: "128",
      icon: <UploadIcon className="h-6 w-6" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition">
            <CardHeader className="flex items-center space-x-4">
              {stat.icon}
              <CardTitle>{stat.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold">Manage Your Inventory</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Upload, edit, and manage your active listings.
            </p>
          </div>
          <Button
            className="mt-6 w-full"
            onClick={() => navigate("/dealer/inventory")}
          >
            Go to Inventory <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Card>

        <Card className="p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold">Valuation Tools</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Run VIN, plate, or manual valuations and view saved reports.
            </p>
          </div>
          <Button
            className="mt-6 w-full"
            onClick={() => navigate("/dealer/tools")}
          >
            Open Tools <ArrowRightIcon className="ml-2 h-4 w-4" />
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default DealerDashboardContent;
