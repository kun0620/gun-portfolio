import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useUpload } from '../../hooks/useUpload'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const TABS = ['Profile', 'Projects', 'Skills', 'Messages', 'Customize']

// ── SortableItem Component ───────────────────────────────────
function SortableProjectItem({ id, title, tags, image_url, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className="flex items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing">
      <div className="flex gap-3 flex-1">
        {image_url && <img src={image_url} alt={title} className="w-12 h-12 rounded object-cover" />}
        <div>
          <p className="font-medium text-gray-800 text-sm">{title}</p>
          <p className="text-xs text-gray-400">{tags?.join(', ')}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onEdit} className="text-xs text-[#1D9E75] font-medium hover:underline">Edit</button>
        <button onClick={onDelete} className="text-xs text-red-400 font-medium hover:underline">Delete</button>
      </div>
    </div>
  )
}

// ── Profile Tab ──────────────────────────────────────────────
function ProfileTab() {
  const [form, setForm] = useState({ hero_title: '', hero_subtitle: '', about_text: '', avatar_url: '' })
  const [profileId, setProfileId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const { upload, loading: uploading } = useUpload()

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) { setProfileId(data.id); setForm({ hero_title: data.hero_title ?? '', hero_subtitle: data.hero_subtitle ?? '', about_text: data.about_text ?? '', avatar_url: data.avatar_url ?? '' }) }
    })
  }, [])

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  async function handleAvatarUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      const url = await upload(file, 'avatars')
      if (url) setForm(prev => ({ ...prev, avatar_url: url }))
    }
  }

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setSaved(false)
    await supabase.from('profile').upsert({ id: profileId ?? undefined, ...form, updated_at: new Date().toISOString() })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="max-w-lg space-y-4">
      {[['hero_title', 'Hero Title', 'input'], ['hero_subtitle', 'Hero Subtitle', 'input'], ['about_text', 'About Text', 'textarea']].map(([name, label, type]) => (
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
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image</label>
        <div className="flex gap-3 items-center">
          <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={uploading}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm cursor-pointer file:mr-2 file:px-3 file:py-1 file:bg-[#1D9E75] file:text-white file:rounded file:border-0" />
          {form.avatar_url && <img src={form.avatar_url} alt="Avatar" className="w-12 h-12 rounded-lg object-cover" />}
        </div>
      </div>
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
  const { upload, loading: uploading } = useUpload()
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

  async function load() {
    const { data } = await supabase.from('projects').select('*').order('display_order')
    setProjects(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = projects.findIndex(p => p.id === active.id)
    const newIndex = projects.findIndex(p => p.id === over.id)
    const newOrder = arrayMove(projects, oldIndex, newIndex)
    setProjects(newOrder)
    await Promise.all(newOrder.map((p, i) => supabase.from('projects').update({ display_order: i }).eq('id', p.id)))
  }

  function handleChange(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })) }

  function startEdit(p) {
    setEditing(p.id)
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : '' })
  }

  function cancelEdit() { setEditing(null); setForm(EMPTY_PROJECT) }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (file) {
      const url = await upload(file, 'projects')
      if (url) setForm(prev => ({ ...prev, image_url: url }))
    }
  }

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
        {[['title', 'Title', 'text', true], ['description', 'Description', 'text', false], ['tags', 'Tags (comma-separated)', 'text', false], ['live_url', 'Live URL', 'url', false], ['github_url', 'GitHub URL', 'url', false], ['display_order', 'Display Order', 'number', false]].map(([name, label, type, req]) => (
          <div key={name}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input name={name} type={type} value={form[name]} onChange={handleChange} required={req}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]" />
          </div>
        ))}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Project Image</label>
          <div className="flex gap-2 items-center">
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs cursor-pointer file:mr-2 file:px-2 file:py-1 file:bg-[#1D9E75] file:text-white file:rounded file:border-0" />
            {form.image_url && <img src={form.image_url} alt="Preview" className="w-12 h-12 rounded object-cover" />}
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={loading}
            className="px-5 py-2 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#179060] disabled:opacity-60">
            {loading ? 'Saving…' : editing ? 'Update' : 'Add Project'}
          </button>
          {editing && <button type="button" onClick={cancelEdit} className="px-5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100">Cancel</button>}
        </div>
      </form>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {projects.map(p => (
              <SortableProjectItem key={p.id} id={p.id} title={p.title} tags={p.tags} image_url={p.image_url}
                onEdit={() => startEdit(p)} onDelete={() => handleDelete(p.id)} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
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

// ── Customize Tab ───────────────────────────────────────────
function CustomizeTab() {
  const [profile, setProfile] = useState(null)
  const [profileId, setProfileId] = useState(null)
  const [socialLinks, setSocialLinks] = useState([])
  const [accentColor, setAccentColor] = useState('#1D9E75')
  const [seoForm, setSeoForm] = useState({ seo_title: '', seo_description: '', seo_og_image: '' })
  const [saving, setSaving] = useState(false)
  const [newLink, setNewLink] = useState({ platform: '', url: '', icon: '' })

  useEffect(() => {
    supabase.from('profile').select('*').single().then(({ data }) => {
      if (data) {
        setProfileId(data.id)
        setSocialLinks(data.social_links ?? [])
        setAccentColor(data.accent_color ?? '#1D9E75')
        setSeoForm({
          seo_title: data.seo_title ?? '',
          seo_description: data.seo_description ?? '',
          seo_og_image: data.seo_og_image ?? ''
        })
      }
    })
  }, [])

  async function handleSave() {
    setSaving(true)
    await supabase.from('profile').upsert({
      id: profileId,
      social_links: socialLinks,
      accent_color: accentColor,
      ...seoForm,
      updated_at: new Date().toISOString()
    })
    setSaving(false)
  }

  function addLink() {
    if (newLink.platform && newLink.url) {
      setSocialLinks([...socialLinks, newLink])
      setNewLink({ platform: '', url: '', icon: '' })
    }
  }

  function removeLink(idx) {
    setSocialLinks(socialLinks.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Social Links */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Social Links</h3>
        <div className="space-y-2 flex gap-2 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Platform</label>
            <input value={newLink.platform} onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })} placeholder="GitHub"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
            <input value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} placeholder="https://github.com/..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
            <input value={newLink.icon} onChange={(e) => setNewLink({ ...newLink, icon: e.target.value })} placeholder="github"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <button onClick={addLink} className="px-4 py-2 bg-[#1D9E75] text-white text-sm font-semibold rounded-lg hover:bg-[#179060]">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {socialLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm">
              <span className="text-gray-700">{link.platform}</span>
              <button onClick={() => removeLink(idx)} className="text-gray-300 hover:text-red-400 text-xs font-bold">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">Accent Color</h3>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 w-20 h-10 cursor-pointer" />
          </div>
          <span className="text-sm text-gray-500">{accentColor}</span>
          <div className="w-20 h-10 rounded-lg" style={{ backgroundColor: accentColor }}></div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-gray-50 rounded-xl p-5 space-y-3">
        <h3 className="font-semibold text-gray-800">SEO Settings</h3>
        {[['seo_title', 'SEO Title'], ['seo_description', 'SEO Description'], ['seo_og_image', 'OG Image URL']].map(([key, label]) => (
          <div key={key}>
            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
            <input value={seoForm[key]} onChange={(e) => setSeoForm({ ...seoForm, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50" />
          </div>
        ))}
      </div>

      <button onClick={handleSave} disabled={saving}
        className="px-6 py-2.5 rounded-lg bg-[#1D9E75] text-white text-sm font-semibold hover:bg-[#179060] disabled:opacity-60">
        {saving ? 'Saving…' : 'Save Customize'}
      </button>
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
        {tab === 'Customize' && <CustomizeTab />}
      </div>
    </div>
  )
}
