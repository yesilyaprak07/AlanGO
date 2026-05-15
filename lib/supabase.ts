import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = "https://xvogssxuhzwvzyianzsu.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2b2dzc3h1aHp3dnp5aWFuenN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2ODc5OTQsImV4cCI6MjA5MjI2Mzk5NH0.kQhbNi9C9hVhsiWZiVgj4EppF_saBcVghKiCwrHKQ0g";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
