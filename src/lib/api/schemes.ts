import { supabase } from "@/integrations/supabase/client";
import type { UserProfile, MatchedScheme } from "@/data/types";

export async function aiMatchSchemes(profile: UserProfile): Promise<MatchedScheme[]> {
  const { data, error } = await supabase.functions.invoke("ai-match", {
    body: { profile },
  });

  if (error) {
    console.error("AI match error:", error);
    throw new Error(error.message || "Failed to get AI matches");
  }

  // Transform DB schema to frontend types
  return (data?.schemes || []).map((s: any) => ({
    id: s.slug || s.id,
    name: s.name,
    ministry: s.ministry,
    description: s.description,
    benefits: s.benefits,
    eligibility: s.eligibility || [],
    documents: s.documents || [],
    deadline: s.deadline,
    applicationLink: s.application_link || "",
    lastUpdated: s.last_updated || s.updated_at || "",
    category: s.category,
    roles: s.roles || [],
    matchCriteria: s.match_criteria || {},
    benefitAmount: s.benefit_amount || 0,
    difficulty: s.difficulty || "Moderate",
    confidence: s.confidence || 80,
    score: s.score || 0,
    matchReasons: s.matchReasons || [],
    missingDocs: s.missingDocs || [],
    aiExplanation: s.aiExplanation || "",
  }));
}

export async function fetchSchemes() {
  const { data, error } = await supabase.from("schemes").select("*");
  if (error) throw error;
  return data;
}

export async function saveScheme(schemeId: string, matchScore?: number, matchReasons?: string[]) {
  // Get the UUID scheme id from the schemes table
  const { data: scheme } = await supabase
    .from("schemes")
    .select("id")
    .eq("slug", schemeId)
    .single();

  if (!scheme) throw new Error("Scheme not found");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("saved_schemes").upsert({
    user_id: user.id,
    scheme_id: scheme.id,
    match_score: matchScore,
    match_reasons: matchReasons || [],
  }, { onConflict: "user_id,scheme_id" });

  if (error) throw error;
}

export async function removeSavedScheme(schemeId: string) {
  const { data: scheme } = await supabase
    .from("schemes")
    .select("id")
    .eq("slug", schemeId)
    .single();

  if (!scheme) return;

  const { error } = await supabase
    .from("saved_schemes")
    .delete()
    .eq("scheme_id", scheme.id);

  if (error) throw error;
}

export async function getSavedSchemes() {
  const { data, error } = await supabase
    .from("saved_schemes")
    .select("*, schemes(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}
