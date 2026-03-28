
-- Timestamp updater function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Schemes table (populated by Firecrawl scraper or manually)
CREATE TABLE public.schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits TEXT NOT NULL,
  eligibility TEXT[] NOT NULL DEFAULT '{}',
  documents TEXT[] NOT NULL DEFAULT '{}',
  deadline TEXT NOT NULL DEFAULT 'Rolling',
  application_link TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  category TEXT NOT NULL,
  roles TEXT[] NOT NULL DEFAULT '{}',
  match_criteria JSONB NOT NULL DEFAULT '{}',
  benefit_amount INTEGER NOT NULL DEFAULT 0,
  difficulty TEXT NOT NULL DEFAULT 'Moderate' CHECK (difficulty IN ('Easy', 'Moderate', 'Hard')),
  confidence INTEGER NOT NULL DEFAULT 80,
  source_url TEXT,
  scraped_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Schemes are publicly readable"
  ON public.schemes FOR SELECT USING (true);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role TEXT,
  age INTEGER,
  gender TEXT,
  state TEXT,
  income INTEGER,
  education TEXT,
  occupation TEXT,
  category TEXT,
  disability BOOLEAN DEFAULT false,
  family_size INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Saved schemes table
CREATE TABLE public.saved_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id UUID NOT NULL REFERENCES public.schemes(id) ON DELETE CASCADE,
  match_score INTEGER,
  match_reasons TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, scheme_id)
);

ALTER TABLE public.saved_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their saved schemes"
  ON public.saved_schemes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save schemes"
  ON public.saved_schemes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove saved schemes"
  ON public.saved_schemes FOR DELETE USING (auth.uid() = user_id);

-- AI match history
CREATE TABLE public.match_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  profile_data JSONB NOT NULL,
  matched_schemes JSONB NOT NULL,
  ai_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their match history"
  ON public.match_history FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert match history"
  ON public.match_history FOR INSERT WITH CHECK (true);

-- Triggers
CREATE TRIGGER update_schemes_updated_at
  BEFORE UPDATE ON public.schemes FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Indexes
CREATE INDEX idx_schemes_roles ON public.schemes USING GIN(roles);
CREATE INDEX idx_schemes_category ON public.schemes(category);
CREATE INDEX idx_saved_schemes_user ON public.saved_schemes(user_id);
CREATE INDEX idx_match_history_user ON public.match_history(user_id);
