export interface SchemeData {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string;
  eligibility: string[];
  documents: string[];
  deadline: string;
  applicationLink: string;
  lastUpdated: string;
  category: string;
  roles: string[];
  matchCriteria: {
    minAge?: number;
    maxAge?: number;
    maxIncome?: number;
    gender?: string;
    occupations?: string[];
    states?: string | string[];
  };
  benefitAmount: number;
  difficulty: "Easy" | "Moderate" | "Hard";
  confidence: number;
}

export interface UserProfile {
  role: string;
  age: number;
  gender: string;
  state: string;
  income: number;
  education: string;
  occupation: string;
  category: string;
  disability: boolean;
  familySize: number;
}

export interface MatchedScheme extends SchemeData {
  score: number;
  matchReasons: string[];
  missingDocs: string[];
}
