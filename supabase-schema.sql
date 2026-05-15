-- ==============================================
-- AlanGO Supabase Database Schema
-- ==============================================
-- Supabase Dashboard > SQL Editor'a git ve bu SQL'i çalıştır
-- ==============================================

-- 1. PROFILES tablosu (kullanıcı profili)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  gold INTEGER DEFAULT 100,
  energy INTEGER DEFAULT 100,
  rank_title TEXT DEFAULT 'ÇAYLAK',
  city TEXT,
  streak_days INTEGER DEFAULT 0,
  last_active_date DATE DEFAULT CURRENT_DATE,
  is_premium BOOLEAN DEFAULT FALSE,
  visible_on_map BOOLEAN DEFAULT TRUE,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  gps_precision BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TERRITORIES tablosu (fethedilen bölgeler)
CREATE TABLE IF NOT EXISTS territories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  polygon JSONB NOT NULL,         -- [{latitude, longitude}, ...]
  area DOUBLE PRECISION NOT NULL, -- m²
  distance DOUBLE PRECISION NOT NULL, -- meters
  duration INTEGER NOT NULL,      -- seconds
  color TEXT DEFAULT 'rgba(0, 240, 255, 0.25)',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. GAME_SESSIONS tablosu (oyun oturumları / sonuçlar)
CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  territory_id UUID REFERENCES territories(id) ON DELETE SET NULL,
  polygon JSONB NOT NULL,
  area DOUBLE PRECISION NOT NULL,
  distance DOUBLE PRECISION NOT NULL,
  duration INTEGER NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  gold_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. İndeksler
CREATE INDEX IF NOT EXISTS idx_territories_user_id ON territories(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- 5. RLS (Row Level Security) Politikaları
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: Herkes okuyabilir, sadece kendi profilini güncelleyebilir
CREATE POLICY "Profiles viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Territories: Herkes görebilir (haritada), sadece kendi bölgesini ekleyebilir/silebilir
CREATE POLICY "Territories viewable by everyone" ON territories
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own territories" ON territories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own territories" ON territories
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update own territories" ON territories
  FOR UPDATE USING (auth.uid() = user_id);

-- Game sessions: Sadece kendi oturumlarını görebilir/ekleyebilir
CREATE POLICY "Users can view own sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 6. updated_at otomatik güncelleme fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 7. XP'ye göre rank hesaplayan fonksiyon
CREATE OR REPLACE FUNCTION get_rank_title(p_xp INTEGER)
RETURNS TEXT AS $$
BEGIN
  RETURN CASE
    WHEN p_xp >= 50000 THEN 'GENERAL'
    WHEN p_xp >= 25000 THEN 'ALBAY'
    WHEN p_xp >= 10000 THEN 'KOMUTAN'
    WHEN p_xp >= 5000 THEN 'YÜZBAŞI'
    WHEN p_xp >= 2000 THEN 'TEĞMEN'
    WHEN p_xp >= 500 THEN 'ÇAVUŞ'
    ELSE 'ÇAYLAK'
  END;
END;
$$ LANGUAGE plpgsql;

-- 8. Leaderboard view (top oyuncular)
CREATE OR REPLACE VIEW leaderboard AS
SELECT
  p.id,
  p.username,
  p.avatar_url,
  p.level,
  p.xp,
  p.rank_title,
  p.city,
  p.streak_days,
  COALESCE(SUM(t.area), 0) AS total_area,
  COUNT(t.id) AS territory_count,
  ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(t.area), 0) DESC) AS rank_position
FROM profiles p
LEFT JOIN territories t ON t.user_id = p.id
GROUP BY p.id
ORDER BY total_area DESC;
