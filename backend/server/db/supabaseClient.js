import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const port = process.env.PORT;
console.log(`Your port is ${port}`);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
