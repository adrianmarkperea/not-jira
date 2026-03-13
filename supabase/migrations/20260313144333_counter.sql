CREATE TABLE counter (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  value INTEGER NOT NULL DEFAULT 0
);

INSERT INTO counter (value) VALUES (0);
