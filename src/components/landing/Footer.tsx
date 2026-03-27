import { Shield, ExternalLink } from "lucide-react";

const Footer = () => (
  <footer className="py-16 border-t border-border relative">
    <div className="container px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-foreground">SchemeMatch AI</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs leading-relaxed">
                Your AI-powered assistant for discovering government welfare schemes across India.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-12 gap-y-4 text-sm">
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground/60 text-xs uppercase tracking-wider">Resources</h4>
              <div className="space-y-2 text-muted-foreground">
                <p className="hover:text-foreground transition-colors cursor-pointer">All Schemes</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">How It Works</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">FAQs</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground/60 text-xs uppercase tracking-wider">Legal</h4>
              <div className="space-y-2 text-muted-foreground">
                <p className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Terms of Use</p>
                <p className="hover:text-foreground transition-colors cursor-pointer">Disclaimer</p>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground/60 text-xs uppercase tracking-wider">Official Links</h4>
              <div className="space-y-2 text-muted-foreground">
                <a href="https://www.india.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  India.gov.in <ExternalLink className="w-3 h-3" />
                </a>
                <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                  MyScheme.gov.in <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground/50">
            © 2026 SchemeMatch AI. All scheme data sourced from official government portals.
          </p>
          <p className="text-xs text-muted-foreground/50">
            Not affiliated with the Government of India. For informational purposes only.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
