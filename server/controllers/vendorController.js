// src/controllers/vendorController.js
import { supabase } from "../db/supabaseClient.js";

export const getVendors = async (req, res) => {
  const { data, error } = await supabase
    .from("vendors")
    .select("*, categories(name)");

  if (error) return res.status(500).json({ error });

  res.json(data);
};

export const createVendor = async (req, res) => {
  const {
    name,
    description,
    category_id,
    location,
    contact_email,
    business_owner,
  } = req.body;

  if (!name || !category_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("vendors")
    .insert([
      {
        name,
        description,
        category_id,
        location,
        contact_email,
        business_owner,
      },
    ]);

  if (error) return res.status(500).json({ error });

  res.status(201).json(data);
};
