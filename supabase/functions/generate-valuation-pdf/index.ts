import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { PDFDocument, rgb, StandardFonts } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { persistSession: false },
      },
    );

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Get valuation ID from request
    const { valuationId } = await req.json();
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "Valuation ID is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if this is a premium valuation or if user has premium access
    const serviceSB = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    const { data: premiumData } = await serviceSB.rpc("has_premium_access", {
      valuation_id: valuationId,
    });
    const hasPremiumAccess = !!premiumData;

    // Fetch valuation data
    const { data: valuation, error: valuationError } = await serviceSB
      .from("valuations")
      .select(`
        *,
        photo_scores(*),
        photo_condition_scores(*),
        vehicle_features(feature_id)
      `)
      .eq("id", valuationId)
      .single();

    if (valuationError || !valuation) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Check if user owns this valuation or is an admin
    const isOwner = valuation.user_id === user.id;
    const { data: isAdmin } = await serviceSB.rpc("is_admin", {
      user_id: user.id,
    });

    if (!isOwner && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Access denied" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Fetch features data if present
    let features = [];
    if (valuation.vehicle_features && valuation.vehicle_features.length > 0) {
      const featureIds = valuation.vehicle_features.map((vf: any) =>
        vf.feature_id
      );
      const { data: featuresData } = await serviceSB
        .from("features")
        .select("*")
        .in("id", featureIds);

      features = featuresData || [];
    }

    // Generate actual PDF
    console.log(`Generating PDF for valuation ${valuationId}`);
    
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([612, 792]); // Letter size
      const { width, height } = page.getSize();
      
      // Load fonts
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      
      let yPosition = height - 50;
      const leftMargin = 50;
      const rightMargin = width - 50;
      
      // Header
      page.drawText('Vehicle Valuation Report', {
        x: leftMargin,
        y: yPosition,
        size: 24,
        font: fontBold,
        color: rgb(0.2, 0.2, 0.8),
      });
      
      yPosition -= 40;
      
      // Vehicle Info
      const vehicleTitle = `${valuation.year || 'N/A'} ${valuation.make || 'N/A'} ${valuation.model || 'N/A'}`;
      page.drawText(vehicleTitle, {
        x: leftMargin,
        y: yPosition,
        size: 18,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      
      yPosition -= 30;
      
      // VIN
      if (valuation.vin) {
        page.drawText(`VIN: ${valuation.vin}`, {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 20;
      }
      
      // Mileage
      if (valuation.mileage) {
        page.drawText(`Mileage: ${valuation.mileage.toLocaleString()} miles`, {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 20;
      }
      
      yPosition -= 20;
      
      // Estimated Value (Main highlight)
      const estimatedValue = valuation.estimated_value || 0;
      page.drawText('Estimated Value:', {
        x: leftMargin,
        y: yPosition,
        size: 16,
        font: fontBold,
        color: rgb(0, 0, 0),
      });
      
      page.drawText(`$${estimatedValue.toLocaleString()}`, {
        x: leftMargin + 150,
        y: yPosition,
        size: 20,
        font: fontBold,
        color: rgb(0.2, 0.7, 0.2),
      });
      
      yPosition -= 40;
      
      // Confidence Score
      if (valuation.confidence_score) {
        page.drawText(`Confidence Score: ${Math.round(valuation.confidence_score)}%`, {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 20;
      }
      
      // Condition Score
      if (valuation.condition_score) {
        page.drawText(`Condition Score: ${Math.round(valuation.condition_score)}/100`, {
          x: leftMargin,
          y: yPosition,
          size: 12,
          font: font,
          color: rgb(0.3, 0.3, 0.3),
        });
        yPosition -= 20;
      }
      
      yPosition -= 20;
      
      // Features section
      if (features.length > 0) {
        page.drawText('Selected Features:', {
          x: leftMargin,
          y: yPosition,
          size: 14,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        
        for (const feature of features.slice(0, 10)) { // Limit to 10 features to fit on page
          page.drawText(`• ${feature.name}`, {
            x: leftMargin + 20,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          yPosition -= 15;
        }
        
        if (features.length > 10) {
          page.drawText(`... and ${features.length - 10} more features`, {
            x: leftMargin + 20,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0.6, 0.6, 0.6),
          });
          yPosition -= 15;
        }
        
        yPosition -= 20;
      }
      
      // Photo condition analysis
      if (valuation.photo_condition_scores && valuation.photo_condition_scores.length > 0) {
        const conditionScore = valuation.photo_condition_scores[0];
        page.drawText('Photo Analysis:', {
          x: leftMargin,
          y: yPosition,
          size: 14,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        yPosition -= 20;
        
        if (conditionScore.summary) {
          const summary = conditionScore.summary.substring(0, 200); // Limit length
          page.drawText(summary, {
            x: leftMargin,
            y: yPosition,
            size: 10,
            font: font,
            color: rgb(0.4, 0.4, 0.4),
          });
          yPosition -= 15;
        }
        
        yPosition -= 20;
      }
      
      // Footer
      const reportDate = new Date().toLocaleDateString();
      page.drawText(`Report generated on ${reportDate}`, {
        x: leftMargin,
        y: 50,
        size: 10,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
      
      page.drawText('Powered by AIN Vehicle Intelligence', {
        x: rightMargin - 200,
        y: 50,
        size: 10,
        font: font,
        color: rgb(0.6, 0.6, 0.6),
      });
      
      // Generate PDF bytes
      const pdfBytes = await pdfDoc.save();
      console.log(`PDF generated successfully. Size: ${pdfBytes.length} bytes`);
      
      // Upload to storage bucket
      const fileName = `valuation-${valuationId}-${Date.now()}.pdf`;
      const { data: uploadData, error: uploadError } = await serviceSB.storage
        .from('PDF Valuation Reports')
        .upload(fileName, pdfBytes, {
          contentType: 'application/pdf',
          upsert: true
        });
      
      if (uploadError) {
        console.error('Error uploading PDF to storage:', uploadError);
        throw new Error(`Storage upload failed: ${uploadError.message}`);
      }
      
      // Get public URL
      const { data: urlData } = serviceSB.storage
        .from('PDF Valuation Reports')
        .getPublicUrl(fileName);
      
      const pdfUrl = urlData.publicUrl;
      console.log(`PDF uploaded to: ${pdfUrl}`);
      
      // Update valuation record with PDF URL
      const { error: updateError } = await serviceSB
        .from("valuations")
        .update({
          pdf_url: pdfUrl,
          pdf_generated_at: new Date().toISOString(),
        })
        .eq("id", valuationId);
      
      if (updateError) {
        console.error('Error updating valuation with PDF URL:', updateError);
      }
      
      // Return PDF data
      return new Response(
        JSON.stringify({
          success: true,
          url: pdfUrl,
          isPremium: hasPremiumAccess,
          fileSize: pdfBytes.length,
          fileName: fileName,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
      
    } catch (pdfError) {
      console.error('PDF generation error:', pdfError);
      throw new Error(`PDF generation failed: ${pdfError.message}`);
    }
  } catch (error) {
    console.error("Error generating PDF:", error);

    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
