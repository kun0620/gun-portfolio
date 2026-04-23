import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const TABS = ['Profile', 'Projects', 'Skills', 'Messages']

// ── Profile Tab ──────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({ hero_title: '', hero_subtitle: '', about_text: '', avatar_url: '' })
  const [profileId, setProfileId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) { setProfileId(data.id); setForm({ hero_title: data.hero_title ?? '', hero_subtitle: data.hero_subtitle ?? '', about_text: data.about_text ?? '', avatar_url: data.avatar_url ?? '' }) }
    })
  }, [])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setSaved(false)
    await supabase.from('profile').upsert({ id: profileId ?? undefined, ...form, updated_at: new Date().toISOString() })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-4">
      {[['hero_title', 'Hero Title', 'input'], ['hero_subtitle', 'Hero Subtitle', 'input'], ['avatar_url', 'Avatar URL', 'input'], ['about_text', 'About Text', 'textarea']].map(([name, label, type]) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          {type === 'textarea' ? (
            <textarea name={name} value={form[name]} onChange={handleChange} rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] resize-none" />
          ) : (
            <input name={name} value={form[name]} onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]" />
          )}
        </div>
      ))}
      <button type="submit" disabled={saving}
        className="px-6 py-2.5 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#179060] transition-colors disabled:opacity-60">
        {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Profile'}
      </button>
    </form>
  )
}

// ── Projects Tab ─────────────────────────────────────────────
const EMPTY_PROJECT = { title: '', description: '', tags: '', live_url: '', github_url: '', image_url: '', display_order: 0 }

function ProjectsTab() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(EMPTY_PROJECT)
  const [editing, setEditing] = useState(null)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('display_order')
    setProjects(data ?? [])
  }
  useEffect(() => { load() }, [])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function startEdit(p) {
    setEditing(p.id)
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '' })
  }

  function cancelEdit() { setEditing(null); setForm(EMPTY_PROJECT) }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [], display_order: Number(form.display_order) }
    if (editing) {
      await supabase.from('projects').update(payload).eq('id', editing)
    } else {
      await supabase.from('projects').insert([payload])
    }
    setForm(EMPTY_PROJECT); setEditing(null); setLoading(false); load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id); load()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 space-y-3 max-w-lg">
        <h3 className="font-semibold text-gray-800">{editing ? 'Edit Project' : 'Add Project'}</h3>
        {[['title', 'Title', 'text', true], ['description', 'Description', 'text', false], ['tags', 'Tags (comma-separated)', 'text', false], ['live_url', 'Live URL', 'url', false], ['github_url', 'GitHub URL', 'url', false], ['image_url', 'Image URL', 'url', false], ['display_order', 'Display Order', 'number', false]].map(([name, label, type, req]) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input name={name} type={type} value={form[name]} onChange={handleChange} required={req}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]" />
          </div>
        ))}
        <div className="flex gap-2">
          <button type="submit" disabled={loading}
            className="px-5 py-2 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#179060] disabled:opacity-60">
            {loading ? 'Saving…' : editing ? 'Update' : 'Add Project'}
          </button>
          {editing && <button type="button" onClick={cancelEdit} className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>}
        </div>
      </form>

      <div className="space-y-2">
        {projects.map(p => (
          <div key={p.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3">
            <div>
              <p className="font-medium text-gray-800 text-sm">{p.title}</p>
              <p className="text-xs text-gray-400">{p.tags?.join(', ')}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(p)} className="text-xs text-[#1D9E75] font-medium hover:underline">Edit</button>
              <button onClick={() => handleDelete(p.id)} className="text-xs text-red-400 font-medium hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Skills Tab ───────────────────────────────────────────────
const EMPTY_SKILL = { name: '', category: '' }

function SkillsTab() {
  const [skills, setSkills] = useState([])
  const [form, setForm] = useState(EMPTY_SKILL)
  const [loading, setLoading] = useState(false)

  async function load() {
    const { data } = await supabase.from('skills').select('*').order('category')
    setSkills(data ?? [])
  }
  useEffect(() => { load() }, [])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleSubmit(e) {
    e.preventDefault(); setLoading(true)
    await supabase.from('skills').insert([form])
    setForm(EMPTY_SKILL); setLoading(false); load()
  }

  async function handleDelete(id) {
    await supabase.from('skills').delete().eq('id', id); load()
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-3 items-end max-w-lg">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Skill Name</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]" />
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
          <input name="category" value={form.category} onChange={handleChange}
            placeholder="e.g. Frontend"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]" />
        </div>
        <button type="submit" disabled={loading}
          className="px-5 py-2 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#179060] disabled:opacity-60 whitespace-nowrap">
          {loading ? '…' : 'Add Skill'}
        </button>
      </form>

      <div className="flex flex-wrap gap-2 max-w-2xl">
        {skills.map(s => (
          <div key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm">
            <span className="text-gray-700">{s.name}</span>
            {s.category && <span className="text-gray-400 text-xs">· {s.category}</span>}
            <button onClick={() => handleDelete(s.id)} className="text-gray-300 hover:text-red-400 ml-1 text-xs font-bold">✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Messages Tab ─────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([])

  async function load() {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function toggleRead(msg) {
    await supabase.from('messages').update({ read: !msg.read }).eq('id', msg.id)
    load()
  }

  return (
    <div className="space-y-3 max-w-2xl">
      {messages.length === 0 && <p className="text-gray-400 text-sm">No messages yet.</p>}
      {messages.map(m => (
        <div key={m.id} className={`border rounded-xl p-4 ${m.read ? 'border-gray-100 bg-white' : 'border-[#1D9E75]/30 bg-[#1D9E75]/5'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-gray-800 text-sm">{m.name} <span className="text-gray-400 font-normal">— {m.email}</span></p>
              <p className="text-gray-600 text-sm mt-1">{m.message}</p>
              <p className="text-gray-400 text-xs mt-2">{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <button onClick={() => toggleRead(m)}
              className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full border transition-colors ${m.read ? 'border-gray-200 text-gray-400 hover:border-[#1D9E75] hover:text-[#1D9E75]' : 'border-[#1D9E75] text-[#1D9E75] bg-[#1D9E75]/10'}`}>
              {m.read ? 'Mark unread' : 'Mark read'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Dashboard Shell ──────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState('Profile')

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <h1 className="font-bold text-gray-900">Portfolio Admin</h1>
        <button onClick={handleSignOut} className="text-sm text-gray-500 hover:text-red-500 transition-colors">Sign out</button>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white border border-gray-100 rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-[#1D9E75] text-white' : 'text-gray-500 hover:text-gray-800'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Profile' && <ProfileTab />}
        {tab === 'Projects' && <ProjectsTab />}
        {tab === 'Skills' && <SkillsTab />}
        {tab === 'Messages' && <MessagesTab />}
      </div>
    </div>
  )
}
