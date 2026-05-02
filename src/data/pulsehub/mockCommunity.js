export const communityUsers = [
  {
    id: 'u-sarah',
    name: 'Sarah Jenkins',
    role: 'Lead Developer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
    initials: 'SJ',
  },
  {
    id: 'u-alex',
    name: 'Alex Chen',
    role: 'Senior Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    initials: 'AC',
  },
  {
    id: 'u-nina',
    name: 'Nina Park',
    role: 'Platform Architect',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&q=80',
    initials: 'NP',
  },
  {
    id: 'u-you',
    name: 'You',
    role: 'Operator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    initials: 'YO',
  },
];

export const trendingTopics = [
  { id: 't1', rank: 1, area: 'Infrastructure', title: 'Kubernetes 1.30 rollout', posts: '12.4k' },
  { id: 't2', rank: 2, area: 'Security', title: 'Zero-day mitigation playbook', posts: '8.1k' },
  { id: 't3', rank: 3, area: 'Frontend', title: 'Dark-mode contrast audit', posts: '4.2k' },
];

export const suggestedGroups = [
  { id: 'g1', name: 'Infrastructure & DevOps', members: 1204 },
  { id: 'g2', name: 'Frontend Guild', members: 816 },
  { id: 'g3', name: 'SRE War Room', members: 532 },
];

export const postSeedComments = {
  p1: [
    { id: 'c1', userId: 'u-alex', content: 'Latency chart looks clean. Can we publish the benchmark graph?', createdAt: '1h ago' },
    { id: 'c2', userId: 'u-nina', content: 'Great win. We should document fallback behavior for node failover.', createdAt: '56m ago' },
  ],
  p2: [
    { id: 'c3', userId: 'u-sarah', content: 'Thanks for posting this. allSettled fixed the edge-case in our queue too.', createdAt: '2h ago' },
  ],
};

export const feedPosts = [
  {
    id: 'p1',
    feed: 'for_you',
    community: 'DataSys Engineering',
    communityType: 'Sponsored',
    authorId: 'u-sarah',
    createdAt: '2h ago',
    body: 'We deployed the new distributed caching layer. Latency dropped 40% across primary endpoints. Architecture snapshot attached.',
    image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=1280&q=80',
    linkTitle: 'Distributed Caching Architecture V3',
    linkHost: 'docs.datasys.io',
    tags: ['#infrastructure', '#cache', '#performance'],
    metrics: { likes: 241, comments: 32, reposts: 12 },
    trendScore: 92,
  },
  {
    id: 'p2',
    feed: 'following',
    community: 'Engineering Core',
    communityType: 'Member',
    authorId: 'u-alex',
    createdAt: '4h ago',
    body: 'Race condition post-mortem: cleanup routine had unhandled rejection path. Switched Promise.all to Promise.allSettled and reset pool safely.',
    codeSnippet: `@@ -14,5 +14,6 @@\n async function cleanupWorkers() {\n   const promises = pool.map(w => w.terminate());\n-  await Promise.all(promises);\n+  await Promise.allSettled(promises);\n+  pool.length = 0;\n }`,
    tags: ['#concurrency', '#nodejs', '#debugging'],
    metrics: { likes: 89, comments: 14, reposts: 4 },
    trendScore: 74,
  },
  {
    id: 'p3',
    feed: 'groups',
    community: 'Frontend Guild',
    communityType: 'Group',
    authorId: 'u-nina',
    createdAt: '7h ago',
    body: 'Open review: design token mapping for high-density dashboards. Looking for comments before release freeze.',
    tags: ['#design-systems', '#a11y', '#dark-mode'],
    metrics: { likes: 58, comments: 22, reposts: 6 },
    trendScore: 67,
  },
];
