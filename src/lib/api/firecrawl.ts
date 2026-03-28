import { supabase } from "@/integrations/supabase/client";

type FirecrawlResponse<T = any> = {
  success: boolean;
  error?: string;
  data?: T;
  scheme?: any;
};

export const firecrawlApi = {
  async scrape(url: string): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
      body: { url, action: "scrape" },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },

  async search(query: string): Promise<FirecrawlResponse> {
    const { data, error } = await supabase.functions.invoke("firecrawl-scrape", {
      body: { url: query, action: "search" },
    });
    if (error) return { success: false, error: error.message };
    return data;
  },
};
