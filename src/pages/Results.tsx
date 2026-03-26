import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield, CheckCircle2, AlertCircle, Clock, ExternalLink, Star, FileText, TrendingUp } from "lucide-react";
import { UserProfile, MatchedScheme } from "@/data/types";
import { matchSchemes } from "@/data/matcher";

const difficultyColors = {
  Easy: "bg-green-india/10 text-green-india",
  Moderate: "bg-gold/10 text-gold",
  Hard: "bg-destructive/10 text-destructive",
};

const Results = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<MatchedScheme[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userProfile");
    if (!stored) {
      navigate("/matcher");
      return;
    }
    const p: UserProfile = JSON.parse(stored);
    setProfile(p);
    setSchemes(matchSchemes(p));
  }, [navigate]);

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/matcher")} className="flex items-center gap-2 text-foreground hover:text-saffron transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retake</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-saffron" />
            <span className="font-display font-bold text-sm">SchemeMatch AI</span>
          </div>
          <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Home
          </button>
        </div>
      </header>

      <div className="container px-4 py-10 max-w-4xl mx-auto">
        {/* Results summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-india/10 text-green-india rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            Analysis Complete
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            We Found <span className="text-gradient-saffron">{schemes.length} Schemes</span> For You
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Based on your profile as a {profile.role} in {profile.state}, here are the schemes ranked by eligibility.
          </p>
        </motion.div>

        {/* Scheme cards */}
        <div className="space-y-4">
          {schemes.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => {
                sessionStorage.setItem("selectedScheme", JSON.stringify(scheme));
                navigate(`/scheme/${scheme.id}`);
              }}
              className="glass rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all cursor-pointer group border border-transparent hover:border-saffron/20"
            >
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Score badge */}
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${
                    scheme.score >= 70 ? "bg-green-india/10" : scheme.score >= 40 ? "bg-gold/10" : "bg-muted"
                  }`}>
                    <span className={`font-display font-bold text-lg ${
                      scheme.score >= 70 ? "text-green-india" : scheme.score >= 40 ? "text-gold" : "text-muted-foreground"
                    }`}>
                      {scheme.score}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">Match</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-saffron transition-colors">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{scheme.ministry}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-saffron transition-colors flex-shrink-0 mt-1" />
                  </div>

                  <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{scheme.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-saffron/10 text-saffron font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {scheme.benefits}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyColors[scheme.difficulty]}`}>
                      {scheme.difficulty} to Apply
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-sky/10 text-sky font-medium">
                      <Clock className="w-3 h-3" />
                      {scheme.deadline}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                      {scheme.confidence}% confidence
                    </span>
                  </div>

                  {/* Match reasons */}
                  {scheme.matchReasons.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {scheme.matchReasons.slice(0, 3).map((reason) => (
                        <span key={reason} className="text-xs text-green-india flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {reason}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {schemes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-bold text-lg text-foreground mb-2">No strong matches found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your profile details for better results.</p>
            <button onClick={() => navigate("/matcher")} className="px-6 py-3 bg-saffron text-saffron-foreground rounded-xl font-medium">
              Retake Quiz
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Results;
