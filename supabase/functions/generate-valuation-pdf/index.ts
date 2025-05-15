
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

// Environment variables from Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ValuationData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
  };
  isPremium: boolean;
  explanation?: string;
  photoScore?: number;
}

interface PDFGenerationRequest {
  valuationId: string;
  userId: string;
}

/**
 * Main function to handle PDF generation requests
 */
serve(async (req: Request) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
  };

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers, status: 204 });
  }

  try {
    // Parse the request body
    const { valuationId, userId } = await req.json() as PDFGenerationRequest;

    if (!valuationId || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { headers, status: 400 }
      );
    }

    // Create Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the valuation data
    const { data: valuation, error: valuationError } = await supabase
      .from("valuations")
      .select("*, photo_scores(*), photo_condition_scores(*)")
      .eq("id", valuationId)
      .single();

    if (valuationError || !valuation) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }),
        { headers, status: 404 }
      );
    }

    // Verify the user has access to this valuation
    if (valuation.user_id !== userId) {
      // Check if user is admin or dealer 
      const { data: userRole } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .single();

      // If not admin or dealer and not the owner of the valuation, deny access
      if (!userRole || (userRole.role !== "admin" && userRole.role !== "dealer")) {
        return new Response(
          JSON.stringify({ error: "Not authorized to access this valuation" }),
          { headers, status: 403 }
        );
      }
    }

    // Prepare valuation data for PDF generation
    const valuationData: ValuationData = {
      id: valuation.id,
      make: valuation.make || "Unknown",
      model: valuation.model || "Vehicle",
      year: valuation.year || new Date().getFullYear(),
      mileage: valuation.mileage || 0,
      condition: valuation.condition || "Good",
      zipCode: valuation.state || valuation.zip || "00000",
      estimatedValue: valuation.estimated_value || 0,
      confidenceScore: valuation.confidence_score || 75,
      priceRange: valuation.price_range || [
        Math.round((valuation.estimated_value || 0) * 0.9),
        Math.round((valuation.estimated_value || 0) * 1.1)
      ],
      isPremium: valuation.premium_unlocked || false,
      explanation: valuation.explanation || "",
      photoScore: valuation.photo_score
    };

    // Parse adjustments if stored as string
    if (valuation.adjustments) {
      if (typeof valuation.adjustments === 'string') {
        try {
          valuationData.adjustments = JSON.parse(valuation.adjustments);
        } catch (e) {
          console.error("Failed to parse adjustments:", e);
        }
      } else {
        valuationData.adjustments = valuation.adjustments;
      }
    }

    // Check if PDF already exists in storage
    const pdfPath = `${valuationId}.pdf`;
    const { data: existingPdf } = await supabase
      .storage
      .from("pdf_exports")
      .download(pdfPath);

    // If PDF exists, return the URL
    if (existingPdf) {
      const { data: publicUrl } = supabase
        .storage
        .from("pdf_exports")
        .getPublicUrl(pdfPath);

      return new Response(
        JSON.stringify({ url: publicUrl.publicUrl }),
        { headers, status: 200 }
      );
    }

    // Generate the PDF
    const pdfBytes = await generatePdf(valuationData);

    // Upload the PDF to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("pdf_exports")
      .upload(pdfPath, pdfBytes, {
        contentType: "application/pdf",
        upsert: true
      });

    if (uploadError) {
      return new Response(
        JSON.stringify({ error: "Failed to upload PDF" }),
        { headers, status: 500 }
      );
    }

    // Get the public URL
    const { data: publicUrl } = supabase
      .storage
      .from("pdf_exports")
      .getPublicUrl(pdfPath);

    return new Response(
      JSON.stringify({ url: publicUrl.publicUrl }),
      { headers, status: 200 }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      { headers, status: 500 }
    );
  }
});

/**
 * Generates a PDF for a valuation report
 */
async function generatePdf(data: ValuationData): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  
  // Get font
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  
  // Define colors and styles
  const primaryColor = rgb(0.1, 0.1, 0.8);
  const textColor = rgb(0.1, 0.1, 0.1);
  const secondaryColor = rgb(0.5, 0.5, 0.5);
  
  // Document margins
  const margin = 50;
  const pageWidth = page.getWidth();
  const contentWidth = pageWidth - (margin * 2);
  
  // Start position for content
  let y = page.getHeight() - margin;
  
  // Draw header with logo and branding
  page.drawText("Car Detective", {
    x: margin,
    y: y - 30,
    size: 24,
    font: helveticaBold,
    color: primaryColor
  });
  
  page.drawText("Vehicle Valuation Report", {
    x: margin,
    y: y - 60,
    size: 16,
    font: helvetica,
    color: textColor
  });
  
  page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
    x: margin,
    y: y - 80,
    size: 10,
    font: helvetica,
    color: secondaryColor
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: y - 95 },
    end: { x: pageWidth - margin, y: y - 95 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  // Vehicle summary section
  y = y - 130;
  page.drawText("Vehicle Summary", {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: primaryColor
  });
  
  y -= 30;
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y,
    size: 16,
    font: helveticaBold,
    color: textColor
  });
  
  y -= 25;
  page.drawText(`Mileage: ${data.mileage.toLocaleString()} miles`, {
    x: margin,
    y,
    size: 12,
    font: helvetica,
    color: textColor
  });
  
  y -= 20;
  page.drawText(`Condition: ${data.condition}`, {
    x: margin,
    y,
    size: 12,
    font: helvetica,
    color: textColor
  });
  
  y -= 20;
  page.drawText(`Location: ${data.zipCode}`, {
    x: margin,
    y,
    size: 12,
    font: helvetica,
    color: textColor
  });
  
  // Market valuation section
  y -= 40;
  page.drawText("Market Valuation", {
    x: margin,
    y,
    size: 14,
    font: helveticaBold,
    color: primaryColor
  });
  
  y -= 30;
  page.drawText(`Estimated Value: $${data.estimatedValue.toLocaleString()}`, {
    x: margin,
    y,
    size: 16,
    font: helveticaBold,
    color: textColor
  });
  
  if (data.priceRange) {
    y -= 25;
    page.drawText(`Price Range: $${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
  }
  
  y -= 20;
  page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
    x: margin,
    y,
    size: 12,
    font: helvetica,
    color: textColor
  });
  
  // Valuation factors section
  if (data.adjustments && data.adjustments.length > 0) {
    y -= 40;
    page.drawText("Valuation Factors", {
      x: margin,
      y,
      size: 14,
      font: helveticaBold,
      color: primaryColor
    });
    
    for (const adjustment of data.adjustments) {
      y -= 25;
      const factorText = `${adjustment.factor}: $${adjustment.impact.toLocaleString()}`;
      page.drawText(factorText, {
        x: margin,
        y,
        size: 12,
        font: helvetica,
        color: textColor
      });
      
      // Only show description for premium users
      if (data.isPremium && adjustment.description) {
        y -= 15;
        page.drawText(`  ${adjustment.description}`, {
          x: margin + 20,
          y,
          size: 10,
          font: helvetica,
          color: secondaryColor
        });
      }
    }
  }
  
  // AI Condition Assessment (premium only)
  if (data.aiCondition && data.isPremium) {
    y -= 40;
    page.drawText("AI Condition Assessment", {
      x: margin,
      y,
      size: 14,
      font: helveticaBold,
      color: primaryColor
    });
    
    y -= 25;
    page.drawText(`AI Condition Rating: ${data.aiCondition.condition}`, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
    
    y -= 20;
    page.drawText(`Confidence: ${data.aiCondition.confidenceScore}%`, {
      x: margin,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
    
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      y -= 20;
      page.drawText("Issues Detected:", {
        x: margin,
        y,
        size: 12,
        font: helveticaBold,
        color: textColor
      });
      
      for (const issue of data.aiCondition.issuesDetected) {
        y -= 15;
        page.drawText(`• ${issue}`, {
          x: margin + 20,
          y,
          size: 10,
          font: helvetica,
          color: textColor
        });
      }
    }
  } else if (!data.isPremium) {
    // Upgrade prompt for non-premium users
    y -= 40;
    page.drawText("Premium Features (Locked)", {
      x: margin,
      y,
      size: 14,
      font: helveticaBold,
      color: primaryColor
    });
    
    y -= 25;
    page.drawText("Upgrade to Premium to unlock:", {
      x: margin,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
    
    y -= 20;
    page.drawText("• AI Condition Assessment", {
      x: margin + 20,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
    
    y -= 20;
    page.drawText("• Detailed Market Analysis", {
      x: margin + 20,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
    
    y -= 20;
    page.drawText("• Full Adjustment Explanations", {
      x: margin + 20,
      y,
      size: 12,
      font: helvetica,
      color: textColor
    });
  }
  
  // Market explanation (premium only)
  if (data.explanation && data.isPremium) {
    y -= 40;
    page.drawText("Market Insights", {
      x: margin,
      y,
      size: 14,
      font: helveticaBold,
      color: primaryColor
    });
    
    // Split explanation text into multiple lines
    const words = data.explanation.split(' ');
    let line = '';
    const lines: string[] = [];
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      if (helvetica.widthOfTextAtSize(testLine, 10) > contentWidth) {
        lines.push(line);
        line = word + ' ';
      } else {
        line = testLine;
      }
    });
    
    if (line.trim()) {
      lines.push(line);
    }
    
    // Draw each line
    for (const textLine of lines) {
      y -= 15;
      page.drawText(textLine, {
        x: margin,
        y,
        size: 10,
        font: helvetica,
        color: textColor
      });
    }
  }
  
  // Footer
  const footerY = margin + 30;
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: footerY + 15 },
    end: { x: pageWidth - margin, y: footerY + 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  page.drawText("Disclaimer: This valuation is an estimate based on market data and vehicle details provided.", {
    x: margin,
    y: footerY,
    size: 8,
    font: helvetica,
    color: secondaryColor
  });
  
  page.drawText(`Report ID: ${data.id}`, {
    x: margin,
    y: footerY - 12,
    size: 8,
    font: helvetica,
    color: secondaryColor
  });
  
  // If premium, add premium badge
  if (data.isPremium) {
    page.drawText("PREMIUM REPORT", {
      x: pageWidth - margin - 120,
      y: y - 80,
      size: 16,
      font: helveticaBold,
      color: rgb(0.8, 0.7, 0.2) // Gold color
    });
  }
  
  // Serialize the PDF document
  return await pdfDoc.save();
}
