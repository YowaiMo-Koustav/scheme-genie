import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, CheckCircle2, FileText, Clock, AlertTriangle, Shield, TrendingUp, Info } from "lucide-react";
import { MatchedScheme } from "@/data/types";
import { SCHEMES } from "@/data/schemes";

const SchemeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [scheme, setScheme] = useState<MatchedScheme | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedScheme");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id === id) {
        setScheme(parsed);
        return;
      }
    }
    // Fallback to raw scheme data
    const found = SCHEMES.find((s) => s.id === id);
    if (found) {
      setScheme({ ...found, score: 0, matchReasons: [], missingDocs: [] });
    }
  }, [id]);

  if (!scheme) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Scheme not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-foreground hover:text-saffron transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-saffron" />
            <span className="font-display font-bold text-sm">SchemeMatch AI</span>
          </div>
          <div />
        </div>
      </header>

      <div className="container px-4 py-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Title section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {scheme.score > 0 && (
                <div className={`px-3 py-1.5 rounded-lg font-display font-bold text-sm ${
                  scheme.score >= 70 ? "bg-green-india/10 text-green-india" : "bg-gold/10 text-gold"
                }`}>
                  {scheme.score}% Match
                </div>
              )}
              <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                {scheme.category}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">{scheme.name}</h1>
            <p className="text-muted-foreground">{scheme.ministry}</p>
          </div>

          {/* Description */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky" />
              About This Scheme
            </h2>
            <p className="text-foreground/80 leading-relaxed">{scheme.description}</p>
          </div>

          {/* Benefits */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-saffron" />
              Benefits
            </h2>
            <p className="text-lg font-display font-bold text-saffron">{scheme.benefits}</p>
          </div>

          {/* Match reasons */}
          {scheme.matchReasons.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-6 border border-green-india/20">
              <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-india" />
                Why This Matches You
              </h2>
              <ul className="space-y-2">
                {scheme.matchReasons.map((reason) => (
                  <li key={reason} className="flex items-center gap-2 text-sm text-foreground/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-india flex-shrink-0" />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-3">Eligibility Criteria</h2>
            <ul className="space-y-2">
              {scheme.eligibility.map((e) => (
                <li key={e} className="flex items-center gap-2 text-sm text-foreground/80">
                  <div className="w-1.5 h-1.5 rounded-full bg-saffron flex-shrink-0" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* Documents */}
          <div className="glass rounded-2xl p-6 mb-6">
            <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky" />
              Required Documents
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {scheme.documents.map((doc) => (
                <div key={doc} className="flex items-center gap-2 text-sm text-foreground/80 p-2 rounded-lg bg-muted/50">
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  {doc}
                </div>
              ))}
            </div>
          </div>

          {/* Deadline & Confidence */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-foreground">Deadline</span>
              </div>
              <p className="font-display font-bold text-foreground">{scheme.deadline}</p>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-sky" />
                <span className="text-sm font-medium text-foreground">Confidence</span>
              </div>
              <p className="font-display font-bold text-foreground">{scheme.confidence}%</p>
              <p className="text-xs text-muted-foreground mt-1">Based on the info you provided</p>
            </div>
          </div>

          {/* Source & Apply */}
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={scheme.applicationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-saffron text-saffron-foreground rounded-2xl font-semibold hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              Apply on Official Portal
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => navigate("/results")}
              className="px-6 py-4 border-2 border-border rounded-2xl font-medium text-foreground hover:border-saffron transition-colors"
            >
              Back to Results
            </button>
          </div>

          {/* Last updated */}
          <p className="text-xs text-muted-foreground text-center mt-8">
            Last updated: {scheme.lastUpdated} · Source: Official Government Portal
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SchemeDetail;
