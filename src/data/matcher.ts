import { SchemeData, UserProfile, MatchedScheme } from "./types";
import { SCHEMES } from "./schemes";

export function matchSchemes(profile: UserProfile): MatchedScheme[] {
  return SCHEMES.map((scheme) => {
    let score = 0;
    const matchReasons: string[] = [];
    const missingDocs: string[] = [];

    // Role match
    if (scheme.roles.includes(profile.role)) {
      score += 30;
      matchReasons.push(`Designed for ${profile.role}s`);
    } else {
      score += 5;
    }

    // Age match
    const { minAge, maxAge } = scheme.matchCriteria;
    if (minAge && profile.age >= minAge) score += 10;
    if (maxAge && profile.age <= maxAge) score += 10;
    if (minAge && profile.age < minAge) score -= 20;
    if (maxAge && profile.age > maxAge) score -= 20;
    if (!minAge && !maxAge) score += 10;

    // Income match
    if (scheme.matchCriteria.maxIncome) {
      if (profile.income <= scheme.matchCriteria.maxIncome) {
        score += 20;
        matchReasons.push("Your income qualifies");
      } else {
        score -= 15;
      }
    } else {
      score += 10;
    }

    // Gender match
    if (scheme.matchCriteria.gender) {
      if (scheme.matchCriteria.gender === profile.gender) {
        score += 15;
        matchReasons.push(`Specifically for ${profile.gender} applicants`);
      } else {
        score -= 30;
      }
    }

    // State match
    if (scheme.matchCriteria.states === "all") {
      score += 5;
      matchReasons.push("Available across all states");
    }

    // Occupation match
    if (scheme.matchCriteria.occupations) {
      if (scheme.matchCriteria.occupations.includes(profile.occupation)) {
        score += 15;
        matchReasons.push(`Matches your occupation`);
      }
    }

    // Disability bonus
    if (profile.disability && scheme.roles.includes("disabled")) {
      score += 20;
      matchReasons.push("Includes disability support");
    }

    // Category bonus for reserved categories
    if (["SC", "ST", "OBC"].includes(profile.category)) {
      score += 5;
      matchReasons.push("Priority for reserved categories");
    }

    // Normalize score 0–100
    score = Math.max(0, Math.min(100, score));

    // Determine missing docs (mock)
    if (!profile.disability && scheme.documents.includes("Disability Certificate")) {
      missingDocs.push("Disability Certificate");
    }

    return { ...scheme, score, matchReasons, missingDocs };
  })
    .filter((s) => s.score > 20)
    .sort((a, b) => b.score - a.score);
}
