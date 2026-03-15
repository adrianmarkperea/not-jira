-- Seed a test user directly into auth.users
-- Credentials: test@example.com / password123
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  role,
  aud,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'test@example.com',
  crypt('password123', gen_salt('bf')),
  NOW(),
  'authenticated',
  'authenticated',
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  '',
  '',
  ''
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  provider,
  identity_data,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'test@example.com',
  'email',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"test@example.com"}',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Seed issues for the test user
INSERT INTO public.issues (title, description, column_id, position, user_id) VALUES
  ('Set up project structure', 'Initialize repo and configure tooling', 'Done', 1, '00000000-0000-0000-0000-000000000001'),
  ('Configure CI/CD pipeline', 'GitHub Actions for lint, test, and deploy', 'Done', 2, '00000000-0000-0000-0000-000000000001'),
  ('Design database schema', 'ERD for core entities', 'Done', 3, '00000000-0000-0000-0000-000000000001'),

  ('Implement auth flow', 'Login, signup, and password reset pages', 'In Progress', 1, '00000000-0000-0000-0000-000000000001'),
  ('Build kanban board UI', 'Drag-and-drop columns and cards', 'In Progress', 2, '00000000-0000-0000-0000-000000000001'),

  ('Write API documentation', 'Document all REST endpoints', 'Next', 1, '00000000-0000-0000-0000-000000000001'),
  ('Add dark mode support', 'Toggle between light and dark themes', 'Next', 2, '00000000-0000-0000-0000-000000000001'),
  ('Set up error monitoring', 'Integrate Sentry for production errors', 'Next', 3, '00000000-0000-0000-0000-000000000001'),

  ('Implement search functionality', 'Full-text search across issues', 'To-do', 1, '00000000-0000-0000-0000-000000000001'),
  ('Add email notifications', 'Notify users on issue updates', 'To-do', 2, '00000000-0000-0000-0000-000000000001'),
  ('Create onboarding flow', 'Guide new users through setup', 'To-do', 3, '00000000-0000-0000-0000-000000000001'),
  ('Write unit tests', 'Achieve 80% coverage', 'To-do', 4, '00000000-0000-0000-0000-000000000001'),

  ('Coordinate with design team', 'Review mockups for v2 features', 'Delegated', 1, '00000000-0000-0000-0000-000000000001'),
  ('Set up staging environment', 'DevOps to provision staging infra', 'Delegated', 2, '00000000-0000-0000-0000-000000000001'),

  ('Fix login redirect bug', 'Users stuck on login page after auth', 'Blocked', 1, '00000000-0000-0000-0000-000000000001'),
  ('Resolve dependency conflict', '@dnd-kit peer dep issue', 'Blocked', 2, '00000000-0000-0000-0000-000000000001');
