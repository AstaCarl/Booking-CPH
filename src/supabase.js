// Importerer createClient-funktionen fra Supabase JS-biblioteket
import { createClient } from "@supabase/supabase-js";

// Definerer URL'en til Supabase-databasen
const supabaseUrl = "https://ofbgpdhnblfmpijyknvf.supabase.co";

// Definerer API-nøglen til at få adgang til Supabase-databasen
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYmdwZGhuYmxmbXBpanlrbnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk4ODE2NzUsImV4cCI6MjAxNTQ1NzY3NX0.JEBSQ54CakHRdnzkLjcFiPXZaHmPnrriN2qEOpGyCl0";

// Opretter en Supabase-klient ved hjælp af createClient-funktionen
export const supabase = createClient(supabaseUrl, supabaseKey);
