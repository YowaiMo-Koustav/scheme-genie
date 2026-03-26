import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="py-12 bg-primary text-primary-foreground">
    <div className="container px-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center">
            <Shield className="w-5 h-5 text-saffron-foreground" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg">SchemeMatch AI</h3>
            <p className="text-primary-foreground/60 text-sm">Your AI assistant for public welfare</p>
          </div>
        </div>
        <div className="flex gap-8 text-sm text-primary-foreground/60">
          <span>Privacy Policy</span>
          <span>Terms of Use</span>
          <span>Contact</span>
        </div>
        <p className="text-sm text-primary-foreground/40">
          © 2026 SchemeMatch AI. All data sourced from official government portals.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
