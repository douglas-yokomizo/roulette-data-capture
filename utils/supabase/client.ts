import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveChoice = async (choice: string) => {
  const { data, error } = await supabase.from("choices").insert([{ choice }]);

  if (error) {
    console.error("Error saving choice:", error);
  } else {
    console.log("Choice saved:", data);
  }
};
