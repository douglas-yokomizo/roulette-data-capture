import { ISignupData } from "@/app/contexts/SignupContext";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveChoice = async (data: ISignupData) => {
  const { data: response, error } = await supabase.from("users").insert([data]);

  if (error) {
    console.error("Error saving choice:", error);
  } else {
    console.log("Choice saved successfully:", response);
  }
};

export const checkCpfExists = async (cpf: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("cpf")
    .eq("cpf", cpf);

  if (error) {
    console.error(error);
    return false;
  }

  return data.length > 0;
};

export const saveUserPrize = async (userId: string, prize: string) => {
  const { data, error } = await supabase
    .from("users")
    .update({ prize })
    .eq("id", userId);

  if (error) {
    console.error("Error saving user prize:", error);
  } else {
    console.log("User prize saved successfully:", data);
  }
};

export const fetchUsersData = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, dob, newsletter, choice");
  if (error) {
    console.error(error);
    return [];
  }
  return data;
};
