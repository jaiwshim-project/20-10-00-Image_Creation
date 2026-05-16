-- 생성 기록 테이블
CREATE TABLE IF NOT EXISTS generations (
  id BIGSERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  industry TEXT NOT NULL,
  template TEXT NOT NULL,
  contact TEXT NOT NULL,
  forbidden_words TEXT,
  material_preview TEXT,
  logo_preview TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 생성된 이미지 테이블
CREATE TABLE IF NOT EXISTS images (
  id BIGSERIAL PRIMARY KEY,
  generation_id BIGINT REFERENCES generations(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 커스텀 테마 테이블
CREATE TABLE IF NOT EXISTS custom_themes (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_generation_id ON images(generation_id);
CREATE INDEX IF NOT EXISTS idx_custom_themes_created_at ON custom_themes(created_at DESC);

-- 완료 확인 메시지
SELECT 'Tables created successfully!' as status;
