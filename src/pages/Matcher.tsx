import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield } from "lucide-react";
import { ROLES, STATES } from "@/data/schemes";
import { UserProfile } from "@/data/types";

const EDUCATION_OPTIONS = ["Below 10th", "10th Pass", "12th Pass", "Graduate", "Post-Graduate", "Diploma/ITI"];
const OCCUPATION_OPTIONS = ["Student", "Salaried", "Self-Employed", "Farmer", "Daily Wage", "Homemaker", "Retired", "Unemployed"];
const CATEGORY_OPTIONS = ["General", "OBC", "SC", "ST", "EWS"];
const INCOME_OPTIONS = [
  { label: "Below ₹1 Lakh", value: 80000 },
  { label: "₹1-3 Lakh", value: 200000 },
  { label: "₹3-5 Lakh", value: 400000 },
  { label: "₹5-8 Lakh", value: 650000 },
  { label: "₹8-12 Lakh", value: 1000000 },
  { label: "Above ₹12 Lakh", value: 1500000 },
];

interface QuestionConfig {
  id: string;
  question: string;
  type: "select" | "grid" | "toggle";
  options?: { label: string; value: string | number }[];
  field: keyof UserProfile;
}

const Matcher = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get("role") || "";

  const [step, setStep] = useState(preselectedRole ? 1 : 0);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    role: preselectedRole,
    disability: false,
  });

  const questions: QuestionConfig[] = [
    {
      id: "role",
      question: "What best describes you?",
      type: "grid",
      options: ROLES.map((r) => ({ label: `${r.icon} ${r.label}`, value: r.id })),
      field: "role",
    },
    {
      id: "gender",
      question: "What is your gender?",
      type: "grid",
      options: [
        { label: "👨 Male", value: "male" },
        { label: "👩 Female", value: "female" },
        { label: "🧑 Other", value: "other" },
      ],
      field: "gender",
    },
    {
      id: "age",
      question: "What is your age group?",
      type: "grid",
      options: [
        { label: "Below 18", value: 15 },
        { label: "18-25", value: 22 },
        { label: "26-35", value: 30 },
        { label: "36-45", value: 40 },
        { label: "46-59", value: 52 },
        { label: "60+", value: 65 },
      ],
      field: "age",
    },
    {
      id: "state",
      question: "Which state do you live in?",
      type: "select",
      options: STATES.map((s) => ({ label: s, value: s })),
      field: "state",
    },
    {
      id: "income",
      question: "What is your annual family income?",
      type: "grid",
      options: INCOME_OPTIONS.map((o) => ({ label: o.label, value: o.value })),
      field: "income",
    },
    {
      id: "education",
      question: "What is your education level?",
      type: "grid",
      options: EDUCATION_OPTIONS.map((e) => ({ label: e, value: e })),
      field: "education",
    },
    {
      id: "occupation",
      question: "What is your current occupation?",
      type: "grid",
      options: OCCUPATION_OPTIONS.map((o) => ({ label: o, value: o.toLowerCase().replace(" ", "-") })),
      field: "occupation",
    },
    {
      id: "category",
      question: "What is your social category?",
      type: "grid",
      options: CATEGORY_OPTIONS.map((c) => ({ label: c, value: c })),
      field: "category",
    },
    {
      id: "disability",
      question: "Do you have a disability?",
      type: "grid",
      options: [
        { label: "Yes", value: "true" },
        { label: "No", value: "false" },
      ],
      field: "disability",
    },
  ];

  const currentQ = questions[step];
  const totalSteps = questions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleSelect = (value: string | number) => {
    const field = currentQ.field;
    let parsed: any = value;
    if (field === "disability") parsed = value === "true";

    setProfile((prev) => ({ ...prev, [field]: parsed }));

    // Auto-advance after selection
    setTimeout(() => {
      if (step < totalSteps - 1) {
        setStep(step + 1);
      } else {
        // Navigate to results
        const fullProfile: UserProfile = {
          role: (profile.role as string) || "individual",
          age: (profile.age as number) || 25,
          gender: (profile.gender as string) || "male",
          state: (profile.state as string) || "All India",
          income: (profile.income as number) || 300000,
          education: (profile.education as string) || "Graduate",
          occupation: (profile.occupation as string) || "salaried",
          category: (profile.category as string) || "General",
          disability: (parsed === true || profile.disability === true),
          familySize: 4,
        };
        sessionStorage.setItem("userProfile", JSON.stringify(fullProfile));
        navigate("/results");
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 text-foreground hover:text-saffron transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-saffron" />
            <span className="font-display font-bold text-sm">SchemeMatch AI</span>
          </div>
          <span className="text-sm text-muted-foreground">{step + 1}/{totalSteps}</span>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-secondary">
          <motion.div
            className="h-full bg-saffron rounded-r-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </header>

      {/* Question area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
                {currentQ.question}
              </h2>

              {currentQ.type === "grid" && (
                <div className={`grid gap-3 ${
                  (currentQ.options?.length || 0) <= 3 ? "grid-cols-1 sm:grid-cols-3 max-w-md mx-auto" :
                  (currentQ.options?.length || 0) <= 4 ? "grid-cols-2" :
                  "grid-cols-2 sm:grid-cols-3"
                }`}>
                  {currentQ.options?.map((opt) => {
                    const isSelected = profile[currentQ.field] === opt.value ||
                      (currentQ.field === "disability" && String(profile.disability) === String(opt.value));
                    return (
                      <motion.button
                        key={String(opt.value)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSelect(opt.value)}
                        className={`p-4 rounded-xl border-2 text-center font-medium transition-all ${
                          isSelected
                            ? "border-saffron bg-saffron/10 text-foreground shadow-md"
                            : "border-border bg-card text-foreground hover:border-saffron/40"
                        }`}
                      >
                        {opt.label}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {currentQ.type === "select" && (
                <div className="max-w-sm mx-auto">
                  <select
                    value={String(profile[currentQ.field] || "")}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-border bg-card text-foreground font-medium focus:border-saffron focus:outline-none transition-colors"
                  >
                    <option value="">Select...</option>
                    {currentQ.options?.map((opt) => (
                      <option key={String(opt.value)} value={String(opt.value)}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {step > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matcher;
