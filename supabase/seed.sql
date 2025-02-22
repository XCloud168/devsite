-- 创建测试用户
INSERT INTO auth.users (id, email, instance_id, raw_user_meta_data, created_at, updated_at)
VALUES
  ('d0d4e86c-7c59-4631-91b6-3e57f4d6b697', 'test1@example.com', '00000000-0000-0000-0000-000000000000',
    jsonb_build_object(
      'name', 'Test User 1',
      'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1'
    ),
    NOW(), NOW()),
  ('b7a8d125-1f7d-4c83-9c3e-c0f4c3b93f6f', 'test2@example.com', '00000000-0000-0000-0000-000000000000',
    jsonb_build_object(
      'name', 'Test User 2',
      'avatar_url', 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2'
    ),
    NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 创建用户档案
INSERT INTO public.site_profiles (id, username, invite_code, avatar_url, created_at, updated_at)
SELECT
  id,
  raw_user_meta_data->>'name' as username,
  CASE
    WHEN id = 'd0d4e86c-7c59-4631-91b6-3e57f4d6b697' THEN 'ABC123XYZ9'
    ELSE 'DEF456UVW8'
  END as invite_code,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  created_at,
  updated_at
FROM auth.users
WHERE id IN ('d0d4e86c-7c59-4631-91b6-3e57f4d6b697', 'b7a8d125-1f7d-4c83-9c3e-c0f4c3b93f6f')
ON CONFLICT (id) DO NOTHING;

-- 创建博客文章
INSERT INTO public.site_blogs (title, content, author_id, status, created_at, updated_at)
VALUES
  ('Getting Started with Next.js', E'Next.js is a powerful React framework that enables you to build fast, modern web applications with React. It provides features like server-side rendering, static site generation, and automatic code splitting out of the box.\n\nIn this tutorial, we''ll explore how to get started with Next.js and build your first application...', 'd0d4e86c-7c59-4631-91b6-3e57f4d6b697', 'published', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

  ('Understanding TypeScript', E'TypeScript adds static typing to JavaScript, making it easier to write and maintain large applications. It''s a superset of JavaScript that compiles to clean JavaScript output.\n\nIn this guide, we''ll cover TypeScript fundamentals, including:\n- Type annotations\n- Interfaces\n- Generics\n- And more...', 'd0d4e86c-7c59-4631-91b6-3e57f4d6b697', 'published', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

  ('Drizzle ORM Tutorial', E'Learn how to use Drizzle ORM with PostgreSQL to build type-safe database queries. Drizzle is a lightweight and powerful ORM that provides excellent TypeScript support.\n\nTopics covered:\n- Schema definition\n- Relationships\n- Migrations\n- Query building', 'b7a8d125-1f7d-4c83-9c3e-c0f4c3b93f6f', 'published', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

  ('React Server Components', E'Exploring the future of React with Server Components. This new feature allows components to run on the server, reducing bundle size and improving performance.\n\nWe''ll discuss:\n- What are Server Components?\n- Benefits and trade-offs\n- Implementation patterns\n- Real-world examples', 'b7a8d125-1f7d-4c83-9c3e-c0f4c3b93f6f', 'draft', NOW(), NOW());
