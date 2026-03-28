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
    const { profile } = await req.json();
    if (!profile) {
      return new Response(
        JSON.stringify({ error: "Profile is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all schemes from DB
    const { data: schemes, error: dbError } = await supabase
      .from("schemes")
      .select("*");

    if (dbError) throw new Error(`DB error: ${dbError.message}`);

    // Build AI prompt
    const systemPrompt = `You are an expert Indian government scheme eligibility advisor. Given a user profile and a list of government schemes, analyze eligibility and return a ranked JSON array.

For each scheme, calculate:
- score (0-100): How well the user matches this scheme
- matchReasons: Array of specific reasons why this scheme fits
- missingDocs: Documents the user might need to prepare
- aiExplanation: A 1-2 sentence personalized explanation in simple language

Consider: age eligibility, income limits, gender requirements, occupation match, state availability, social category benefits, and disability support.

IMPORTANT: Return ONLY valid JSON array, no markdown, no explanation outside JSON.`;

    const userPrompt = `User Profile:
- Role: ${profile.role}
- Age: ${profile.age}
- Gender: ${profile.gender}
- State: ${profile.state}
- Annual Income: ₹${profile.income?.toLocaleString("en-IN")}
- Education: ${profile.education}
- Occupation: ${profile.occupation}
- Social Category: ${profile.category}
- Disability: ${profile.disability ? "Yes" : "No"}
- Family Size: ${profile.familySize || 4}

Available Schemes:
${JSON.stringify(
  schemes?.map((s: any) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    ministry: s.ministry,
    description: s.description,
    benefits: s.benefits,
    eligibility: s.eligibility,
    documents: s.documents,
    deadline: s.deadline,
    category: s.category,
    roles: s.roles,
    matchCriteria: s.match_criteria,
    benefitAmount: s.benefit_amount,
    difficulty: s.difficulty,
    confidence: s.confidence,
  })),
  null,
  2
)}

Return a JSON array of objects with: { schemeId, slug, score, matchReasons, missingDocs, aiExplanation }
Sort by score descending. Only include schemes with score > 20.`;

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
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "AI rate limit exceeded, please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errText);
      throw new Error("AI gateway error");
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "[]";

    // Strip markdown code fences if present
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let matchResults;
    try {
      matchResults = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      matchResults = [];
    }

    // Enrich with full scheme data
    const enrichedResults = matchResults
      .map((match: any) => {
        const scheme = schemes?.find(
          (s: any) => s.id === match.schemeId || s.slug === match.slug
        );
        if (!scheme) return null;
        return {
          ...scheme,
          score: match.score,
          matchReasons: match.matchReasons || [],
          missingDocs: match.missingDocs || [],
          aiExplanation: match.aiExplanation || "",
        };
      })
      .filter(Boolean);

    // Save to match history
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const adminClient = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data } = await adminClient.auth.getClaims(token);
      userId = data?.claims?.sub || null;
    }

    await supabase.from("match_history").insert({
      user_id: userId,
      profile_data: profile,
      matched_schemes: enrichedResults,
      ai_explanation: `Found ${enrichedResults.length} matching schemes for ${profile.role} in ${profile.state}`,
    });

    return new Response(JSON.stringify({ schemes: enrichedResults }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-match error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
