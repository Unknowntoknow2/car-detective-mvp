
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

interface ChecklistItem {
  id: string;
  text: string;
  isChecked: boolean;
  status: 'passed' | 'failed' | 'pending';
  notes: string;
}

interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

export function AuditChecklist() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Initialize the audit checklist data
  const [sections, setSections] = useState<ChecklistSection[]>([
    {
      title: "CORE FEATURES",
      items: [
        { id: "vin-flow", text: "VIN Lookup → Valuation → Result", isChecked: false, status: 'pending', notes: "" },
        { id: "plate-flow", text: "Plate Lookup → Valuation → Result", isChecked: false, status: 'pending', notes: "" },
        { id: "manual-flow", text: "Manual Entry → Valuation → Result", isChecked: false, status: 'pending', notes: "" },
        { id: "prediction-load", text: "PredictionResult loads for all flows", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "VALUATION LOGIC",
      items: [
        { id: "valuation-factors", text: "Includes mileage, condition, feature logic", isChecked: false, status: 'pending', notes: "" },
        { id: "zip-multipliers", text: "Pulls ZIP-based market multipliers from Supabase", isChecked: false, status: 'pending', notes: "" },
        { id: "ai-override", text: "AI photo condition overrides if confidence > 70%", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "PHOTO AI SYSTEM",
      items: [
        { id: "photo-upload", text: "Upload up to 5 vehicle photos", isChecked: false, status: 'pending', notes: "" },
        { id: "photo-scoring", text: "Each image scored via GPT or backend AI", isChecked: false, status: 'pending', notes: "" },
        { id: "score-storage", text: "Results saved in photo_condition_scores", isChecked: false, status: 'pending', notes: "" },
        { id: "fallback-logic", text: "Manual fallback logic applies if no valid photos", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "GPT INTEGRATION",
      items: [
        { id: "gpt-explanation", text: "GPT-based valuation explanation displays properly", isChecked: false, status: 'pending', notes: "" },
        { id: "regenerate", text: "Supports regenerate", isChecked: false, status: 'pending', notes: "" },
        { id: "pdf-integration", text: "Injected into downloadable PDF", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "PDF REPORT SYSTEM",
      items: [
        { id: "pdf-content", text: "Generates valuation + condition + explanation", isChecked: false, status: 'pending', notes: "" },
        { id: "pdf-styling", text: "Branding and styling match MVP design", isChecked: false, status: 'pending', notes: "" },
        { id: "premium-badge", text: "Premium badge displays for unlocked reports", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "STRIPE CHECKOUT",
      items: [
        { id: "checkout-function", text: "Stripe session created via create-checkout function", isChecked: false, status: 'pending', notes: "" },
        { id: "webhook-confirmation", text: "stripe-webhook confirms payment in DB", isChecked: false, status: 'pending', notes: "" },
        { id: "premium-flag", text: "premium_unlocked set in valuations", isChecked: false, status: 'pending', notes: "" },
        { id: "success-page", text: "/premium-success confirms based on DB verification", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "AUTH & RLS POLICIES",
      items: [
        { id: "rls-enabled", text: "RLS enabled for valuations, orders, photo scores", isChecked: false, status: 'pending', notes: "" },
        { id: "data-access", text: "Users only access their own data", isChecked: false, status: 'pending', notes: "" },
        { id: "dealer-access", text: "Dealer dashboard properly restricted", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "MY VALUATIONS PAGE",
      items: [
        { id: "valuation-list", text: "Valuation list loads cleanly", isChecked: false, status: 'pending', notes: "" },
        { id: "no-duplicates", text: "No duplicate records", isChecked: false, status: 'pending', notes: "" },
        { id: "correct-routing", text: "Links route to correct report (premium or free)", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "TESTING SUITE",
      items: [
        { id: "unit-tests", text: "Unit tests cover valuation engine", isChecked: false, status: 'pending', notes: "" },
        { id: "e2e-flows", text: "E2E tests cover VIN / Plate / Manual entry flows", isChecked: false, status: 'pending', notes: "" },
        { id: "e2e-pdf", text: "E2E tests cover PDF generation", isChecked: false, status: 'pending', notes: "" },
        { id: "e2e-gpt", text: "E2E tests cover GPT flow", isChecked: false, status: 'pending', notes: "" },
        { id: "e2e-stripe", text: "E2E tests cover Stripe payment", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "DEV TEST PANEL",
      items: [
        { id: "test-stripe", text: "Stripe Checkout test", isChecked: false, status: 'pending', notes: "" },
        { id: "test-valuation", text: "Valuation fetch test", isChecked: false, status: 'pending', notes: "" },
        { id: "test-profile", text: "Profile fetch test", isChecked: false, status: 'pending', notes: "" },
        { id: "test-rls", text: "RLS protection verified", isChecked: false, status: 'pending', notes: "" },
      ]
    },
    {
      title: "AI CHAT BUBBLE",
      items: [
        { id: "chat-appearance", text: "Appears after valuation", isChecked: false, status: 'pending', notes: "" },
        { id: "chat-explanation", text: "Can explain price and guide user", isChecked: false, status: 'pending', notes: "" },
        { id: "chat-response", text: "Responds via text + popups", isChecked: false, status: 'pending', notes: "" },
      ]
    },
  ]);

  // Function to update the checklist item status
  const updateItemStatus = (sectionIndex: number, itemIndex: number, status: 'passed' | 'failed' | 'pending') => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex].status = status;
    newSections[sectionIndex].items[itemIndex].isChecked = status === 'passed';
    setSections(newSections);
  };

  // Function to update item notes
  const updateItemNotes = (sectionIndex: number, itemIndex: number, notes: string) => {
    const newSections = [...sections];
    newSections[sectionIndex].items[itemIndex].notes = notes;
    setSections(newSections);
  };

  // Calculate overall progress
  const totalItems = sections.reduce((sum, section) => sum + section.items.length, 0);
  const checkedItems = sections.reduce((sum, section) => 
    sum + section.items.filter(item => item.status === 'passed').length, 0);
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="container py-8 max-w-5xl">
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Car Detective — MVP Final Validation Audit Checklist
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Audited by 100K+ SMEs
            </div>
          </div>
          <CardDescription>Date: {currentDate}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm font-medium">
              Progress: {progress}% Complete ({checkedItems}/{totalItems})
            </div>
            <div className="relative w-48 h-2 bg-gray-200 rounded">
              <div 
                className="absolute top-0 left-0 h-2 bg-primary rounded"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {sections.map((section, sectionIndex) => (
        <Card key={section.title} className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold">
              🧠 {section.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={item.id} className="flex flex-col space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <Checkbox 
                        id={item.id}
                        checked={item.isChecked}
                        onCheckedChange={() => updateItemStatus(
                          sectionIndex, 
                          itemIndex, 
                          item.status === 'passed' ? 'pending' : 'passed'
                        )}
                      />
                      <label
                        htmlFor={item.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {item.text}
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => updateItemStatus(sectionIndex, itemIndex, 'passed')}
                      >
                        <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        Pass
                      </button>
                      <button
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => updateItemStatus(sectionIndex, itemIndex, 'failed')}
                      >
                        <AlertCircle className="h-3 w-3 inline mr-1" />
                        Fail
                      </button>
                      <button
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}
                        onClick={() => updateItemStatus(sectionIndex, itemIndex, 'pending')}
                      >
                        <Clock className="h-3 w-3 inline mr-1" />
                        Pending
                      </button>
                    </div>
                  </div>
                  <div className="pl-7">
                    <textarea
                      className="w-full p-2 text-sm border rounded-md"
                      placeholder="Add notes here..."
                      value={item.notes}
                      onChange={(e) => updateItemNotes(sectionIndex, itemIndex, e.target.value)}
                      rows={1}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            ✅ Output Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.title}>
                  <TableCell className="font-medium">{section.title}</TableCell>
                  <TableCell>
                    {(() => {
                      const passedCount = section.items.filter(item => item.status === 'passed').length;
                      const totalCount = section.items.length;
                      const percent = Math.round((passedCount / totalCount) * 100);
                      
                      let statusElement;
                      if (percent === 100) {
                        statusElement = <span className="text-green-600">✅ PASSED</span>;
                      } else if (percent === 0) {
                        statusElement = <span className="text-red-600">❌ FAILED</span>;
                      } else {
                        statusElement = <span className="text-yellow-600">⏳ IN PROGRESS ({percent}%)</span>;
                      }
                      
                      return statusElement;
                    })()}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {section.items.filter(item => item.notes).map(item => (
                      <div key={item.id} className="mb-1">
                        <span className="font-medium">{item.text}: </span>
                        {item.notes}
                      </div>
                    ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
