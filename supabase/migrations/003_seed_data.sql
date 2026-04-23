-- Seed example projects showcasing Frontend/UI skills
insert into projects (title, description, tags, live_url, github_url, display_order) values
('gun-portfolio', 'A modern, fully-featured portfolio website built with React, Vite, Tailwind CSS, and Supabase. Features admin panel for content management, image uploads, drag-and-drop reordering, dynamic theming, and SEO optimization.',
  ARRAY['React', 'Vite', 'Tailwind CSS', 'Supabase', 'React Router'],
  'https://gun-portfolio.vercel.app', 'https://github.com/kun0620/gun-portfolio', 0),

('Weather App', 'Real-time weather application with beautiful UI, location search, and hourly forecasts. Built with React and OpenWeather API.',
  ARRAY['React', 'API Integration', 'Responsive Design'],
  'https://weather-app-demo.vercel.app', 'https://github.com/kun0620/weather-app', 1),

('Task Management Dashboard', 'Interactive task management system with drag-and-drop kanban board, real-time updates, and team collaboration features.',
  ARRAY['React', 'TypeScript', 'Drag & Drop', 'Supabase'],
  'https://tasks-dashboard-demo.vercel.app', 'https://github.com/kun0620/task-dashboard', 2)
on conflict do nothing;

-- Seed example skills
insert into skills (name, category) values
('React', 'Frontend'),
('TypeScript', 'Frontend'),
('Tailwind CSS', 'Frontend'),
('Vite', 'Frontend'),
('React Router', 'Frontend'),
('JavaScript', 'Frontend'),
('CSS3 / Animations', 'Frontend'),
('Supabase', 'Backend'),
('PostgreSQL', 'Backend'),
('Node.js', 'Backend'),
('Git', 'Tools'),
('Figma', 'Design')
on conflict do nothing;
