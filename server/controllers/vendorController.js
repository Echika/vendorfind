import bcrypt from "bcrypt";
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
    business_name,
    description,
    category_id,
    location,
    contact_email,
    business_owner,
    contact_number,
    password_hash,
  } = req.body;

  if (!business_name || !category_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase.from("vendors").insert([
    {
      business_name,
      description,
      category_id,
      location,
      contact_email,
      business_owner,
      contact_number,
      password_hash,
    },
  ]);

  if (error) return res.status(500).json({ error });

  res.status(201).json(data);
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const { data: vendor, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !vendor)
    return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, vendor.password_hash);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ message: "Login successful", vendor });
};
