// src/controllers/adminController.js
import { supabase } from "../db/supabaseClient.js";

export const getAllVendorsAdmin = async (req, res) => {
  const { data, error } = await supabase
    .from("vendors")
    .select("*, categories(name), reviews(*)");

  if (error) return res.status(500).json({ error });

  res.json(data);
};
