import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PulsehubLangProvider, usePulsehubLang } from '../context/pulsehubLangContext.jsx';
import { PulsehubThemeProvider, usePulsehubTheme } from '../context/pulsehubThemeContext.jsx';
import {
  communityUsers,
  feedPosts,
  postSeedComments,
  suggestedGroups,
  trendingTopics,
} from '../data/pulsehub/mockCommunity.js';

function parseHoursAgo(text) {
  const match = /(\d+)\s*h/.exec(text ?? '');
  return match ? Number(match[1]) : 999;
}

function PulseHubShell() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = usePulsehubTheme();
  const { lang, toggleLang, tr } = usePulsehubLang();
  const [query, setQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState('for_you');
  const [sortBy, setSortBy] = useState('latest');
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [likedMap, setLikedMap] = useState({});
  const [commentsMap, setCommentsMap] = useState(postSeedComments);
  const [draftComment, setDraftComment] = useState('');
  const [composerText, setComposerText] = useState('');

  const usersById = useMemo(() => Object.fromEntries(communityUsers.map((u) => [u.id, u])), []);

  const enrichedPosts = useMemo(
    () => feedPosts.map((post) => ({
      ...post,
      author: usersById[post.authorId],
      likes: post.metrics.likes + (likedMap[post.id] ? 1 : 0),
      commentsCount: commentsMap[post.id]?.length ?? 0,
    })),
    [usersById, likedMap, commentsMap]
  );

  const filteredPosts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return enrichedPosts
      .filter((post) => feedFilter === 'all' || post.feed === feedFilter)
      .filter((post) => {
        if (!q) return true;
        return [post.body, post.community, post.author?.name, post.tags.join(' ')].join(' ').toLowerCase().includes(q);
      })
      .sort((a, b) => {
        if (sortBy === 'trending') return b.trendScore - a.trendScore;
        return parseHoursAgo(a.createdAt) - parseHoursAgo(b.createdAt);
      });
  }, [enrichedPosts, feedFilter, query, sortBy]);

  const selectedPost = useMemo(
    () => enrichedPosts.find((post) => post.id === selectedPostId) ?? null,
    [enrichedPosts, selectedPostId]
  );

  const selectedPostComments = selectedPost ? (commentsMap[selectedPost.id] ?? []) : [];

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedPostId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const submitComment = () => {
    if (!selectedPost || !draftComment.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      userId: 'u-you',
      content: draftComment.trim(),
      createdAt: 'now',
    };
    setCommentsMap((prev) => ({
      ...prev,
      [selectedPost.id]: [...(prev[selectedPost.id] ?? []), newComment],
    }));
    setDraftComment('');
  };

  const collaborators = communityUsers.filter((user) => user.id !== 'u-you').slice(0, 3);

  return (
    <div className="pulsehub-root" data-theme={theme}>
      <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-[var(--ph-border)] bg-[color:var(--ph-bg)]/90 backdrop-blur-md px-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0 w-full max-w-[560px]">
          <button type="button" className="pulsehub-icon-btn shrink-0" onClick={() => navigate('/')} aria-label={tr.back}>
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          </button>
          <div className="text-[20px] font-black tracking-tight text-[var(--ph-accent)]">{tr.brand}</div>
          <div className="hidden md:flex items-center h-9 border border-[var(--ph-border)] bg-[var(--ph-surface-2)] px-3 min-w-0 flex-1">
            <span className="material-symbols-outlined text-[18px] text-[var(--ph-muted)] mr-2">search</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={tr.searchPlaceholder}
              className="w-full bg-transparent border-0 outline-none text-[13px] text-[var(--ph-text)] placeholder:text-[var(--ph-muted)]"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button type="button" className="pulsehub-icon-btn" onClick={toggleLang} aria-label="toggle language">{lang.toUpperCase()}</button>
          <button type="button" className="pulsehub-icon-btn" onClick={toggleTheme} aria-label="toggle theme">
            <span className="material-symbols-outlined text-[18px]">{theme === 'dark' ? 'light_mode' : 'dark_mode'}</span>
          </button>
          <button type="button" className="pulsehub-icon-btn hidden sm:grid" aria-label="mail">
            <span className="material-symbols-outlined text-[18px]">mail</span>
          </button>
          <button type="button" className="pulsehub-icon-btn hidden sm:grid" aria-label="notifications">
            <span className="material-symbols-outlined text-[18px]">notifications</span>
          </button>
        </div>
      </header>

      <aside className="hidden md:flex fixed left-0 top-14 bottom-0 w-64 border-r border-[var(--ph-border)] bg-[var(--ph-surface)] flex-col">
        <div className="p-4 border-b border-[var(--ph-border)]">
          <div className="flex items-center gap-3 p-3 border border-[var(--ph-border)] bg-[var(--ph-surface-2)]">
            <div className="w-8 h-8 grid place-items-center border border-[var(--ph-border)] bg-[var(--ph-bg)] text-[var(--ph-accent)] font-bold">P</div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[var(--ph-text)]">PulseHub</div>
              <div className="text-[11px] text-[var(--ph-muted)]">{tr.workspace}</div>
            </div>
          </div>
        </div>
        <nav className="py-2 text-[12px] uppercase tracking-[0.08em]">
          {[
            ['home', tr.nav.home, true],
            ['explore', tr.nav.explore, false],
            ['group', tr.nav.groups, false],
            ['event', tr.nav.events, false],
            ['bookmark', tr.nav.bookmarks, false],
            ['person', tr.nav.profile, false],
          ].map(([icon, label, active]) => (
            <button
              key={String(icon)}
              type="button"
              className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 ${active ? 'text-[var(--ph-accent)] border-[var(--ph-accent)] bg-[var(--ph-surface-2)]' : 'text-[var(--ph-muted)] border-transparent hover:text-[var(--ph-text)] hover:bg-[var(--ph-surface-2)]'}`}
            >
              <span className="material-symbols-outlined text-[20px]">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
        <div className="mt-auto p-4">
          <div className="border border-[var(--ph-border)] p-3 bg-[var(--ph-surface-2)]">
            <div className="text-[11px] uppercase tracking-[0.08em] text-[var(--ph-accent)]">System Status</div>
            <p className="text-xs text-[var(--ph-muted)] mt-1">All services operational. Latency 24ms.</p>
          </div>
        </div>
      </aside>

      <main className="pt-20 md:pl-64">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 pb-8 grid grid-cols-1 lg:grid-cols-[minmax(0,720px)_320px] gap-6 justify-center">
          <section className="flex flex-col gap-4 min-w-0">
            <div className="md:hidden flex items-center h-9 border border-[var(--ph-border)] bg-[var(--ph-surface-2)] px-3">
              <span className="material-symbols-outlined text-[18px] text-[var(--ph-muted)] mr-2">search</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tr.searchPlaceholder}
                className="w-full bg-transparent border-0 outline-none text-[13px] text-[var(--ph-text)] placeholder:text-[var(--ph-muted)]"
              />
            </div>

            <div className="border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4">
              <div className="flex gap-3">
                <img src={usersById['u-you'].avatar} alt={usersById['u-you'].name} className="w-10 h-10 rounded-full border border-[var(--ph-border)] object-cover shrink-0" />
                <div className="flex-1">
                  <textarea
                    value={composerText}
                    onChange={(event) => setComposerText(event.target.value)}
                    placeholder={tr.composer.placeholder}
                    className="w-full bg-transparent border-0 outline-none resize-none min-h-[54px] text-sm text-[var(--ph-text)] placeholder:text-[var(--ph-muted)]"
                  />
                  <div className="pt-3 mt-2 border-t border-[var(--ph-border)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1">
                      {['image', 'movie', 'code'].map((icon) => (
                        <button key={icon} type="button" className="pulsehub-icon-btn !w-8 !h-8">
                          <span className="material-symbols-outlined text-[16px]">{icon}</span>
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" className="px-3 h-8 border border-[var(--ph-border)] text-xs text-[var(--ph-muted)] hover:text-[var(--ph-text)]">{tr.composer.public}</button>
                      <button type="button" className="px-4 h-8 bg-[var(--ph-accent)] text-black text-xs font-semibold">{tr.composer.post}</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex border-b border-[var(--ph-border)]">
              {Object.entries(tr.feedFilters).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFeedFilter(value)}
                  className={`flex-1 py-3 text-sm ${feedFilter === value ? 'text-[var(--ph-accent)] border-b-2 border-[var(--ph-accent)]' : 'text-[var(--ph-muted)] border-b-2 border-transparent hover:text-[var(--ph-text)]'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-8 px-2 border border-[var(--ph-border)] bg-[var(--ph-surface-2)] text-xs text-[var(--ph-text)]">
                <option value="latest">{tr.sortLatest}</option>
                <option value="trending">{tr.sortTrending}</option>
              </select>
            </div>

            <div className="flex flex-col gap-4">
              {filteredPosts.length === 0 && (
                <div className="border border-dashed border-[var(--ph-border)] text-[var(--ph-muted)] text-sm p-8 text-center">{tr.empty}</div>
              )}
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedPostId(post.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedPostId(post.id);
                    }
                  }}
                  className="border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4 hover:border-[color:var(--ph-accent)]/40 cursor-pointer"
                >
                  <div className="flex justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={post.author?.avatar} alt={post.author?.name} className="w-10 h-10 rounded-full border border-[var(--ph-border)] object-cover" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[var(--ph-text)] truncate">{post.author?.name}</div>
                        <div className="text-xs text-[var(--ph-muted)]">{post.community} • {post.createdAt}</div>
                      </div>
                    </div>
                    <button type="button" className="text-[var(--ph-muted)]" onClick={(event) => event.stopPropagation()}>
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-[var(--ph-text)]">{post.body}</p>
                  {post.image && (
                    <div className="mt-3 border border-[var(--ph-border)] overflow-hidden">
                      <img src={post.image} alt={post.linkTitle ?? post.community} className="w-full aspect-[2/1] object-cover" />
                      {post.linkTitle && (
                        <div className="border-t border-[var(--ph-border)] px-3 py-2 bg-[var(--ph-surface-2)]">
                          <div className="text-xs font-semibold text-[var(--ph-text)]">{post.linkTitle}</div>
                          <div className="text-[11px] text-[var(--ph-muted)]">{post.linkHost}</div>
                        </div>
                      )}
                    </div>
                  )}
                  {post.codeSnippet && (
                    <pre className="mt-3 p-3 border border-[var(--ph-border)] bg-[#0d1118] text-[#b8ccdf] text-[11px] leading-[1.45] overflow-auto">{post.codeSnippet}</pre>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 border border-[var(--ph-border)] text-[11px] text-[var(--ph-muted)]">{tag}</span>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-[var(--ph-border)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-5">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setLikedMap((prev) => ({ ...prev, [post.id]: !prev[post.id] }));
                        }}
                        className={`flex items-center gap-1 text-xs ${likedMap[post.id] ? 'text-[var(--ph-accent)]' : 'text-[var(--ph-muted)]'}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">thumb_up</span>{post.likes}
                      </button>
                      <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedPostId(post.id); }} className="flex items-center gap-1 text-xs text-[var(--ph-muted)]">
                        <span className="material-symbols-outlined text-[18px]">chat_bubble</span>{post.commentsCount}
                      </button>
                      <button type="button" onClick={(event) => event.stopPropagation()} className="flex items-center gap-1 text-xs text-[var(--ph-muted)]">
                        <span className="material-symbols-outlined text-[18px]">repeat</span>{post.metrics.reposts}
                      </button>
                    </div>
                    <button type="button" className="text-[var(--ph-muted)]" onClick={(event) => event.stopPropagation()}>
                      <span className="material-symbols-outlined text-[18px]">share</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="hidden lg:flex flex-col gap-4">
            <section className="border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4">
              <h3 className="text-[16px] font-semibold text-[var(--ph-text)] pb-2 mb-3 border-b border-[var(--ph-border)]">{tr.sidebar.trending}</h3>
              <div className="flex flex-col gap-4">
                {trendingTopics.map((topic) => (
                  <button key={topic.id} type="button" className="text-left group">
                    <div className="text-[11px] text-[var(--ph-muted)] mb-1">#{topic.rank} • {topic.area}</div>
                    <div className="text-sm text-[var(--ph-text)] group-hover:text-[var(--ph-accent)]">{topic.title}</div>
                    <div className="text-xs text-[var(--ph-muted)] mt-1">{topic.posts} posts</div>
                  </button>
                ))}
              </div>
              <button type="button" className="text-xs text-[var(--ph-accent)] mt-4">{tr.sidebar.showMore}</button>
            </section>

            <section className="border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4">
              <h3 className="text-[16px] font-semibold text-[var(--ph-text)] pb-2 mb-3 border-b border-[var(--ph-border)]">{tr.sidebar.suggested}</h3>
              <div className="flex flex-col gap-3">
                {suggestedGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm text-[var(--ph-text)] truncate">{group.name}</div>
                      <div className="text-xs text-[var(--ph-muted)]">{group.members.toLocaleString()} {tr.sidebar.members}</div>
                    </div>
                    <button type="button" className="px-3 h-7 border border-[var(--ph-border)] text-xs text-[var(--ph-muted)] hover:text-[var(--ph-accent)] hover:border-[var(--ph-accent)]">
                      Join
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4">
              <h3 className="text-[16px] font-semibold text-[var(--ph-text)] pb-2 mb-3 border-b border-[var(--ph-border)]">{tr.sidebar.collaborators}</h3>
              <div className="flex flex-col gap-3">
                {collaborators.map((user) => (
                  <div key={user.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-[var(--ph-border)] object-cover" />
                      <span className="text-sm text-[var(--ph-text)]">{user.name}</span>
                    </div>
                    <button type="button" className="text-[var(--ph-muted)]">
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-[var(--ph-border)] bg-[var(--ph-surface)] p-4">
              <h3 className="text-[16px] font-semibold text-[var(--ph-text)] pb-2 mb-3 border-b border-[var(--ph-border)]">{tr.sidebar.briefings}</h3>
              <div className="flex flex-col gap-3">
                {[
                  ['OCT', '24', 'Q3 Architecture Review', '14:00 GMT'],
                  ['OCT', '26', 'Frontend Guild Sync', 'Online Room A'],
                ].map(([month, date, title, meta]) => (
                  <button key={title} type="button" className="text-left flex items-start gap-3 group">
                    <div className="w-12 h-12 border border-[var(--ph-border)] bg-[var(--ph-surface-2)] grid place-items-center">
                      <div className="text-[10px] text-[var(--ph-muted)]">{month}</div>
                      <div className="text-[18px] leading-none text-[var(--ph-text)]">{date}</div>
                    </div>
                    <div>
                      <div className="text-sm text-[var(--ph-text)] group-hover:text-[var(--ph-accent)]">{title}</div>
                      <div className="text-xs text-[var(--ph-muted)] mt-1">{meta}</div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>

      <div className={`pulsehub-overlay ${selectedPost ? 'open' : ''}`} onClick={() => setSelectedPostId(null)} aria-hidden={!selectedPost} />
      <section className={`pulsehub-detail ${selectedPost ? 'open' : ''}`} aria-hidden={!selectedPost}>
        {selectedPost && (
          <>
            <header>
              <h3>{tr.detail.discussion}</h3>
              <button type="button" className="pulsehub-icon-btn" onClick={() => setSelectedPostId(null)} aria-label={tr.detail.close}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </header>
            <div className="pulsehub-detail-body">
              <article className="pulsehub-card">
                <div className="pulsehub-card-head">
                  <div className="pulsehub-author">
                    <img src={selectedPost.author?.avatar} alt={selectedPost.author?.name} />
                    <div>
                      <strong>{selectedPost.author?.name}</strong>
                      <span>{selectedPost.community} • {selectedPost.createdAt}</span>
                    </div>
                  </div>
                </div>
                <p>{selectedPost.body}</p>
                {selectedPost.image && (
                  <div className="mt-3 border border-[var(--ph-border)] overflow-hidden">
                    <img src={selectedPost.image} alt={selectedPost.linkTitle ?? selectedPost.community} className="w-full aspect-[2/1] object-cover" />
                  </div>
                )}
                {selectedPost.codeSnippet && (
                  <pre className="mt-3 p-3 border border-[var(--ph-border)] bg-[#0d1118] text-[#b8ccdf] text-[11px] leading-[1.45] overflow-auto">{selectedPost.codeSnippet}</pre>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 border border-[var(--ph-border)] text-[11px] text-[var(--ph-muted)]">{tag}</span>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-[var(--ph-border)] flex items-center justify-between text-xs text-[var(--ph-muted)]">
                  <span>{selectedPost.likes} likes</span>
                  <span>{selectedPost.metrics.reposts} reposts</span>
                </div>
              </article>
              <div className="pulsehub-comments">
                <h4>{tr.reactions.comments}</h4>
                {selectedPostComments.length === 0 && <p className="pulsehub-muted">{tr.reactions.noComments}</p>}
                {selectedPostComments.map((comment) => (
                  <article key={comment.id} className="pulsehub-comment">
                    <strong>{usersById[comment.userId]?.name ?? 'User'}</strong>
                    <p>{comment.content}</p>
                    <small>{comment.createdAt}</small>
                  </article>
                ))}
              </div>
            </div>
            <footer>
              <input value={draftComment} onChange={(event) => setDraftComment(event.target.value)} placeholder={tr.reactions.writeComment} />
              <button type="button" onClick={submitComment}>{tr.reactions.postComment}</button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}

export default function PulseHubPage() {
  return (
    <PulsehubThemeProvider>
      <PulsehubLangProvider>
        <PulseHubShell />
      </PulsehubLangProvider>
    </PulsehubThemeProvider>
  );
}
