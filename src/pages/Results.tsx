import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Shield, CheckCircle2, AlertCircle, Clock, TrendingUp, Bookmark, Sparkles, Loader2 } from "lucide-react";
import { UserProfile, MatchedScheme } from "@/data/types";
import { matchSchemes } from "@/data/matcher";
import { aiMatchSchemes, saveScheme } from "@/lib/api/schemes";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const difficultyColors = {
  Easy: "bg-green-india/10 text-green-india",
  Moderate: "bg-gold/10 text-gold",
  Hard: "bg-destructive/10 text-destructive",
};

const Results = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [schemes, setSchemes] = useState<MatchedScheme[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [useAI, setUseAI] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("userProfile");
    if (!stored) {
      navigate("/matcher");
      return;
    }
    const p: UserProfile = JSON.parse(stored);
    setProfile(p);

    const fetchMatches = async () => {
      setLoading(true);
      try {
        // Try AI matching first
        const aiResults = await aiMatchSchemes(p);
        if (aiResults.length > 0) {
          setSchemes(aiResults);
          setUseAI(true);
        } else {
          // Fallback to local matcher
          setSchemes(matchSchemes(p));
          setUseAI(false);
        }
      } catch (err) {
        console.error("AI match failed, using local:", err);
        setSchemes(matchSchemes(p));
        setUseAI(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [navigate]);

  const handleSave = async (scheme: MatchedScheme) => {
    if (!user) {
      toast({ title: "Sign in to save", description: "Create an account to save schemes", variant: "destructive" });
      navigate("/auth");
      return;
    }
    setSaving(scheme.id);
    try {
      await saveScheme(scheme.id, scheme.score, scheme.matchReasons);
      toast({ title: "Saved!", description: `${scheme.name} added to your saved schemes` });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  if (!profile) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="relative mb-6">
            <Loader2 className="w-12 h-12 text-saffron animate-spin mx-auto" />
            <Sparkles className="w-6 h-6 text-saffron absolute -top-1 -right-1 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">AI is analyzing your profile...</h2>
          <p className="text-muted-foreground text-sm">Finding the best government schemes for you</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate("/matcher")} className="flex items-center gap-2 text-foreground hover:text-saffron transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retake</span>
          </button>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-saffron" />
            <span className="font-display font-bold text-sm">SchemeMatch AI</span>
            {useAI && (
              <span className="text-[10px] px-2 py-0.5 bg-saffron/20 text-saffron rounded-full font-medium">
                AI Powered
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <span className="text-xs text-muted-foreground">{user.email?.split("@")[0]}</span>
            ) : (
              <button onClick={() => navigate("/auth")} className="text-sm text-saffron hover:underline">
                Sign in
              </button>
            )}
            <button onClick={() => navigate("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </button>
          </div>
        </div>
      </header>

      <div className="container px-4 py-10 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-india/10 text-green-india rounded-full text-sm font-medium mb-4">
            <CheckCircle2 className="w-4 h-4" />
            {useAI ? "AI Analysis Complete" : "Analysis Complete"}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            We Found <span className="text-gradient-saffron">{schemes.length} Schemes</span> For You
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Based on your profile as a {profile.role} in {profile.state}, here are the schemes ranked by eligibility.
          </p>
        </motion.div>

        <div className="space-y-4">
          {schemes.map((scheme, i) => (
            <motion.div
              key={scheme.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all group border border-transparent hover:border-saffron/20"
            >
              <div className="flex flex-col sm:flex-row gap-4">
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

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="cursor-pointer"
                      onClick={() => {
                        sessionStorage.setItem("selectedScheme", JSON.stringify(scheme));
                        navigate(`/scheme/${scheme.id}`);
                      }}
                    >
                      <h3 className="font-display font-bold text-lg text-foreground group-hover:text-saffron transition-colors">
                        {scheme.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{scheme.ministry}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <button
                        onClick={() => handleSave(scheme)}
                        disabled={saving === scheme.id}
                        className="p-2 rounded-lg hover:bg-saffron/10 transition-colors"
                        title="Save scheme"
                      >
                        {saving === scheme.id ? (
                          <Loader2 className="w-4 h-4 text-saffron animate-spin" />
                        ) : (
                          <Bookmark className="w-4 h-4 text-muted-foreground hover:text-saffron" />
                        )}
                      </button>
                      <ArrowRight
                        className="w-5 h-5 text-muted-foreground group-hover:text-saffron transition-colors cursor-pointer"
                        onClick={() => {
                          sessionStorage.setItem("selectedScheme", JSON.stringify(scheme));
                          navigate(`/scheme/${scheme.id}`);
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-foreground/70 mt-2 line-clamp-2">{scheme.description}</p>

                  {/* AI explanation */}
                  {(scheme as any).aiExplanation && (
                    <div className="mt-2 flex items-start gap-2 p-2 bg-saffron/5 rounded-lg">
                      <Sparkles className="w-3.5 h-3.5 text-saffron mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-foreground/80">{(scheme as any).aiExplanation}</p>
                    </div>
                  )}

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
                  </div>

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
