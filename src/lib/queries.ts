import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const servicesQuery = queryOptions({
  queryKey: ["services", "public"],
  queryFn: async () => {
    const { data, error } = await supabase.from("services").select("*").eq("active", true).order("sort_order");
    if (error) throw error;
    return data;
  },
});
