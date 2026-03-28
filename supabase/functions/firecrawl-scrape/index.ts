import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { url, action } = await req.json();

    const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Search for government schemes
    if (action === "search") {
      const query = url || "Indian government schemes 2026 eligibility benefits";
      const response = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          limit: 10,
          lang: "en",
          country: "IN",
          scrapeOptions: { formats: ["markdown"] },
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        return new Response(
          JSON.stringify({ success: false, error: data.error || "Search failed" }),
          { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Scrape a specific URL for scheme details
    if (!url) {
      return new Response(
        JSON.stringify({ success: false, error: "URL is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let formattedUrl = url.trim();
    if (!formattedUrl.startsWith("http")) formattedUrl = `https://${formattedUrl}`;

    console.log("Scraping:", formattedUrl);

    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ["markdown", "links"],
        onlyMainContent: true,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: data.error || "Scrape failed" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use AI to extract structured scheme data from scraped content
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (LOVABLE_API_KEY && data.data?.markdown) {
      const aiResponse = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content: `Extract government scheme information from the scraped content. Return a JSON object with: name, ministry, description, benefits, eligibility (array), documents (array), deadline, applicationLink, category, roles (array from: student/individual/worker/farmer/entrepreneur/woman/senior/disabled), matchCriteria (object with minAge, maxAge, maxIncome, gender, occupations, states), benefitAmount (number), difficulty (Easy/Moderate/Hard), confidence (0-100). Return ONLY valid JSON.`,
              },
              {
                role: "user",
                content: `URL: ${formattedUrl}\n\nContent:\n${data.data.markdown.slice(0, 8000)}`,
              },
            ],
          }),
        }
      );

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        let parsed = aiData.choices?.[0]?.message?.content || "";
        parsed = parsed.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

        try {
          const schemeData = JSON.parse(parsed);
          // Upsert to DB
          const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
          );

          const slug = schemeData.name
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

          await supabase.from("schemes").upsert(
            {
              slug,
              name: schemeData.name,
              ministry: schemeData.ministry || "Government of India",
              description: schemeData.description || "",
              benefits: schemeData.benefits || "",
              eligibility: schemeData.eligibility || [],
              documents: schemeData.documents || [],
              deadline: schemeData.deadline || "Rolling",
              application_link: schemeData.applicationLink || formattedUrl,
              category: schemeData.category || "General",
              roles: schemeData.roles || ["individual"],
              match_criteria: schemeData.matchCriteria || {},
              benefit_amount: schemeData.benefitAmount || 0,
              difficulty: schemeData.difficulty || "Moderate",
              confidence: schemeData.confidence || 70,
              source_url: formattedUrl,
              scraped_at: new Date().toISOString(),
            },
            { onConflict: "slug" }
          );

          return new Response(
            JSON.stringify({ success: true, scheme: schemeData, raw: data }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } catch {
          console.error("Failed to parse AI extraction");
        }
      }
    }

    return new Response(JSON.stringify({ success: true, ...data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Scrape error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Failed to scrape",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
