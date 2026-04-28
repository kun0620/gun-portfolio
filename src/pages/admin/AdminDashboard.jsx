import { useEffect, useState } from 'react'
import { supabase, uploadAsset, getPublicUrl } from '../../lib/supabase.js'

const TABS = ['Profile', 'Projects', 'Experience', 'Messages']

// ── Shared components ────────────────────────────────────────────
function Field({ label, name, value, onChange, type = 'text', rows, placeholder, required }) {
  const cls = 'w-full bg-[#080c10] border border-[#1a2330] focus:border-[#a3e635] outline-none px-3 py-2 font-mono text-[13px] text-[#cfd6de] placeholder:text-[#3d4956] transition-colors'
  return (
    <label className="block">
      <span className="block font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-1">{label}</span>
      {rows
        ? <textarea name={name} value={value} onChange={onChange} rows={rows} required={required} placeholder={placeholder} className={cls + ' resize-none'} />
        : <input name={name} type={type} value={value} onChange={onChange} required={required} placeholder={placeholder} className={cls} />}
    </label>
  )
}

function UploadRow({ label, folder, fieldKey, accept = 'image/*', value, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  async function handleChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true); setError(null)
    try { onUploaded(await uploadAsset(folder, file)) }
    catch (err) { setError(err.message || 'Upload failed') }
    finally { setUploading(false) }
  }
  return (
    <div>
      <span className="block font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-1">{label}</span>
      <div className="flex items-center gap-3">
        <label className="flex-1 border border-[#1a2330] hover:border-[#a3e635] px-3 py-2 cursor-pointer transition-colors">
          <span className="font-mono text-[12px] text-[#9aa7b4]">
            {uploading ? 'uploading...' : value ? '✓ uploaded — change file' : 'choose file →'}
          </span>
          <input type="file" accept={accept} onChange={handleChange} className="hidden" disabled={uploading} />
        </label>
        {value && <a href={getPublicUrl(value)} target="_blank" rel="noopener noreferrer" className="font-mono text-[11px] text-[#a3e635] hover:underline shrink-0">view ↗</a>}
      </div>
      {error && <p className="mt-1.5 font-mono text-[11px] text-[#ff6b6b]">[error] {error}</p>}
    </div>
  )
}

function SaveBtn({ saving, saved }) {
  return (
    <button type="submit" disabled={saving}
      className="h-9 px-6 font-mono text-[12px] font-bold bg-[#a3e635] text-[#080c10] hover:bg-white transition-colors disabled:opacity-40">
      {saving ? 'saving...' : saved ? '✓ saved' : 'save →'}
    </button>
  )
}

function Alert({ children }) {
  if (!children) return null
  return <p className="font-mono text-[11px] text-[#ff6b6b]">[error] {children}</p>
}

function ConfirmDialog({ title, body, onCancel, onConfirm, busy }) {
  return (
    <div className="fixed inset-0 z-[80] bg-[#080c10]/85 backdrop-blur-sm flex items-center justify-center p-6">
      <div className="w-full max-w-sm border border-[#2a3545] bg-[#0a0e12] p-5">
        <div className="font-mono text-[11px] text-[#a3e635] mb-2">// confirm</div>
        <h2 className="text-[#e8eef5] text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-[13px] text-[#9aa7b4] leading-relaxed">{body}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} disabled={busy} className="h-9 px-4 font-mono text-[12px] border border-[#2a3545] text-[#9aa7b4] hover:text-[#cfd6de] disabled:opacity-40">cancel</button>
          <button type="button" onClick={onConfirm} disabled={busy} className="h-9 px-4 font-mono text-[12px] border border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-[#080c10] disabled:opacity-40">
            {busy ? 'deleting...' : 'delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Profile Tab ──────────────────────────────────────────────────
const PROFILE_DEFAULTS = {
  tagline_en: '', tagline_th: '',
  bio_en: '', bio_th: '',
  stat_1_value: '5+', stat_1_label_en: 'Years in factory IT', stat_1_label_th: 'ปีในสายงาน IT โรงงาน',
  stat_2_value: '2', stat_2_label_en: 'Manufacturing companies', stat_2_label_th: 'บริษัทอุตสาหกรรม',
  stat_3_value: '3.75', stat_3_label_en: 'GPA — top of class', stat_3_label_th: 'เกรดเฉลี่ย',
  email: '', phone: '', location_en: '', location_th: '',
  github_url: '', linkedin_url: '', line_id: '',
  photo_url: '', cv_url: '', wechat_qr_url: '',
}

function ProfileTab() {
  const [form, setForm] = useState(PROFILE_DEFAULTS)
  const [pid, setPid] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase.from('profile').select('*').limit(1).single().then(({ data, error }) => {
      if (error && error.code !== 'PGRST116') setError(error.message)
      if (!data) return
      setPid(data.id)
      setForm({ ...PROFILE_DEFAULTS, ...data,
        bio_en: Array.isArray(data.bio_en) ? data.bio_en.join('\n\n') : (data.bio_en ?? ''),
        bio_th: Array.isArray(data.bio_th) ? data.bio_th.join('\n\n') : (data.bio_th ?? ''),
      })
    })
  }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setVal = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setSaved(false); setError(null)
    const payload = { ...form,
      bio_en: form.bio_en.split(/\n\n+/).map(p => p.trim()).filter(Boolean),
      bio_th: form.bio_th.split(/\n\n+/).map(p => p.trim()).filter(Boolean),
      updated_at: new Date().toISOString(),
    }
    if (pid) {
      const { error } = await supabase.from('profile').update(payload).eq('id', pid)
      if (error) { setError(error.message); setSaving(false); return }
    }
    else {
      const { data, error } = await supabase.from('profile').insert([payload]).select().single()
      if (error) { setError(error.message); setSaving(false); return }
      if (data) setPid(data.id)
    }
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
      <Block title="tagline">
        <Field label="Tagline EN" value={form.tagline_en} onChange={set('tagline_en')} />
        <Field label="Tagline TH" value={form.tagline_th} onChange={set('tagline_th')} />
      </Block>
      <Block title="bio (แยกย่อหน้าด้วยบรรทัดว่าง)">
        <Field label="Bio EN" value={form.bio_en} onChange={set('bio_en')} rows={5} />
        <Field label="Bio TH" value={form.bio_th} onChange={set('bio_th')} rows={5} />
      </Block>
      <Block title="stats">
        {[1, 2, 3].map(n => (
          <div key={n} className="grid grid-cols-3 gap-3">
            <Field label={`Stat ${n} Value`} value={form[`stat_${n}_value`]} onChange={set(`stat_${n}_value`)} />
            <Field label="Label EN" value={form[`stat_${n}_label_en`]} onChange={set(`stat_${n}_label_en`)} />
            <Field label="Label TH" value={form[`stat_${n}_label_th`]} onChange={set(`stat_${n}_label_th`)} />
          </div>
        ))}
      </Block>
      <Block title="contact info">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" value={form.email} onChange={set('email')} type="email" />
          <Field label="Phone" value={form.phone} onChange={set('phone')} />
          <Field label="Location EN" value={form.location_en} onChange={set('location_en')} />
          <Field label="Location TH" value={form.location_th} onChange={set('location_th')} />
        </div>
      </Block>
      <Block title="social links">
        <Field label="GitHub URL (e.g. https://github.com/gun-eng)" value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." />
        <Field label="LinkedIn URL (e.g. https://linkedin.com/in/gun-eng)" value={form.linkedin_url} onChange={set('linkedin_url')} placeholder="https://linkedin.com/in/..." />
        <Field label="Line ID (e.g. gun.eng)" value={form.line_id} onChange={set('line_id')} placeholder="your_line_id" />
      </Block>
      <Block title="assets">
        <UploadRow label="Profile Photo" folder="profile" fieldKey="photo_url" value={form.photo_url} onUploaded={v => setVal('photo_url', v)} />
        <UploadRow label="CV (PDF)" folder="cv" fieldKey="cv_url" accept=".pdf,application/pdf" value={form.cv_url} onUploaded={v => setVal('cv_url', v)} />
        <UploadRow label="WeChat QR" folder="qr" fieldKey="wechat_qr_url" value={form.wechat_qr_url} onUploaded={v => setVal('wechat_qr_url', v)} />
      </Block>
      <Alert>{error}</Alert>
      <SaveBtn saving={saving} saved={saved} />
    </form>
  )
}

// ── Projects Tab ──────────────────────────────────────────────────
const EMPTY_PROJECT = { tag: 'INFRA', name_en: '', name_th: '', sub_en: '', sub_th: '', body_en: '', body_th: '', stack: '', metrics: '', case_study_url: '', github_url: '', live_url: '', featured: false }

function ProjectsTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY_PROJECT)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const { data, error } = await supabase.from('projects').select('*').order('display_order')
    if (error) { setError(error.message); return }
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  function startEdit(p) {
    setEditId(p.id)
    setForm({ ...EMPTY_PROJECT, ...p,
      stack: Array.isArray(p.stack) ? p.stack.join(', ') : (p.stack ?? ''),
      metrics: p.metrics ? JSON.stringify(p.metrics) : '',
    })
  }
  function cancelEdit() { setEditId(null); setForm(EMPTY_PROJECT) }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true); setError(null)
    let metrics = null
    try { if (form.metrics.trim()) metrics = JSON.parse(form.metrics) }
    catch {
      setError('Metrics must be valid JSON, for example [["users","~50"]].')
      setSaving(false)
      return
    }
    if (metrics && (!Array.isArray(metrics) || metrics.some(row => !Array.isArray(row) || row.length !== 2))) {
      setError('Metrics must be an array of [label, value] pairs.')
      setSaving(false)
      return
    }
    const payload = { ...form,
      stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
      metrics,
      display_order: editId ? items.find(p => p.id === editId)?.display_order ?? 0 : items.length,
    }
    const { error } = editId
      ? await supabase.from('projects').update(payload).eq('id', editId)
      : await supabase.from('projects').insert([payload])
    if (error) { setError(error.message); setSaving(false); return }
    cancelEdit(); setSaving(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true); setError(null)
    const { error } = await supabase.from('projects').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) { setError(error.message); return }
    setDeleteTarget(null); load()
  }

  async function move(idx, dir) {
    const next = [...items]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setItems(next)
    const results = await Promise.all([
      supabase.from('projects').update({ display_order: idx }).eq('id', next[idx].id),
      supabase.from('projects').update({ display_order: swap }).eq('id', next[swap].id),
    ])
    const error = results.find(r => r.error)?.error
    if (error) setError(error.message)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="border border-[#1a2330] p-6 space-y-4 max-w-2xl">
        <div className="font-mono text-[11px] text-[#5d6b7a]">{editId ? '// edit project' : '// add project'}</div>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="block font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-1">Tag</span>
            <select value={form.tag} onChange={set('tag')} className="w-full bg-[#080c10] border border-[#1a2330] focus:border-[#a3e635] outline-none px-3 py-2 font-mono text-[13px] text-[#cfd6de]">
              <option>INFRA</option><option>WEB</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-5">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-[#a3e635]" />
            <span className="font-mono text-[12px] text-[#9aa7b4]">featured</span>
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Name EN" value={form.name_en} onChange={set('name_en')} required />
          <Field label="Name TH" value={form.name_th} onChange={set('name_th')} required />
          <Field label="Sub EN" value={form.sub_en} onChange={set('sub_en')} />
          <Field label="Sub TH" value={form.sub_th} onChange={set('sub_th')} />
        </div>
        <Field label="Body EN" value={form.body_en} onChange={set('body_en')} rows={3} />
        <Field label="Body TH" value={form.body_th} onChange={set('body_th')} rows={3} />
        <Field label='Stack (comma-separated)' value={form.stack} onChange={set('stack')} placeholder="React, Node.js, Tailwind" />
        <Field label='Metrics (JSON) e.g. [["users","~50"],["cameras","7×5MP"]]' value={form.metrics} onChange={set('metrics')} placeholder='[["key","value"]]' />
        <Field label="Case Study URL" value={form.case_study_url} onChange={set('case_study_url')} placeholder="https://..." />
        <Field label="GitHub URL" value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/..." />
        <Field label="Live URL" value={form.live_url} onChange={set('live_url')} placeholder="https://..." />
        <Alert>{error}</Alert>
        <div className="flex gap-2">
          <SaveBtn saving={saving} saved={false} />
          {editId && <button type="button" onClick={cancelEdit} className="h-9 px-5 font-mono text-[12px] border border-[#2a3545] text-[#9aa7b4] hover:border-[#a3e635] hover:text-[#cfd6de] transition-colors">cancel</button>}
        </div>
      </form>

      <div className="space-y-2 max-w-2xl">
        <div className="font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-3">// {items.length} projects</div>
        {items.map((p, i) => (
          <div key={p.id} className="flex items-center gap-3 border border-[#1a2330] bg-[#0a0e12] px-4 py-3 hover:border-[#2a3545] transition-colors">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="font-mono text-[10px] text-[#5d6b7a] hover:text-[#a3e635] disabled:opacity-20 leading-none">▲</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="font-mono text-[10px] text-[#5d6b7a] hover:text-[#a3e635] disabled:opacity-20 leading-none">▼</button>
            </div>
            <span className={`font-mono text-[10px] px-1.5 py-0.5 border ${p.tag === 'INFRA' ? 'border-[#a3e635]/60 text-[#a3e635]' : 'border-[#22d3ee]/60 text-[#22d3ee]'}`}>{p.tag}</span>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[13px] text-[#e8eef5] truncate">{p.name_en}</div>
              <div className="font-mono text-[11px] text-[#5d6b7a] truncate">{p.name_th}</div>
            </div>
            <button type="button" onClick={() => startEdit(p)} className="font-mono text-[11px] text-[#a3e635] hover:underline shrink-0">edit</button>
            <button type="button" onClick={() => setDeleteTarget(p)} className="font-mono text-[11px] text-[#ff6b6b] hover:underline shrink-0">delete</button>
          </div>
        ))}
      </div>
      {deleteTarget && (
        <ConfirmDialog
          title="Delete project?"
          body={`This will remove "${deleteTarget.name_en}" from the portfolio.`}
          busy={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

// ── Experience Tab ────────────────────────────────────────────────
const EMPTY_EXP = { range_en: '', range_th: '', role: '', org_en: '', org_th: '', body_en: '', body_th: '' }

function ExperienceTab() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(EMPTY_EXP)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  async function load() {
    const { data, error } = await supabase.from('experience').select('*').order('display_order')
    if (error) { setError(error.message); return }
    setItems(data ?? [])
  }
  useEffect(() => { load() }, [])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  function startEdit(item) { setEditId(item.id); setForm({ ...EMPTY_EXP, ...item }) }
  function cancelEdit() { setEditId(null); setForm(EMPTY_EXP) }

  async function handleSubmit(e) {
    e.preventDefault(); setSaving(true); setError(null)
    const payload = { ...form, display_order: editId ? items.find(x => x.id === editId)?.display_order ?? 0 : items.length }
    const { error } = editId
      ? await supabase.from('experience').update(payload).eq('id', editId)
      : await supabase.from('experience').insert([payload])
    if (error) { setError(error.message); setSaving(false); return }
    cancelEdit(); setSaving(false); load()
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true); setError(null)
    const { error } = await supabase.from('experience').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) { setError(error.message); return }
    setDeleteTarget(null); load()
  }

  async function move(idx, dir) {
    const next = [...items]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setItems(next)
    const results = await Promise.all([
      supabase.from('experience').update({ display_order: idx }).eq('id', next[idx].id),
      supabase.from('experience').update({ display_order: swap }).eq('id', next[swap].id),
    ])
    const error = results.find(r => r.error)?.error
    if (error) setError(error.message)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="border border-[#1a2330] p-6 space-y-4 max-w-2xl">
        <div className="font-mono text-[11px] text-[#5d6b7a]">{editId ? '// edit entry' : '// add entry'}</div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Range EN (e.g. Apr 2024 — Present)" value={form.range_en} onChange={set('range_en')} required />
          <Field label="Range TH (e.g. เม.ย. 2567 — ปัจจุบัน)" value={form.range_th} onChange={set('range_th')} required />
          <Field label="Role" value={form.role} onChange={set('role')} required />
          <div /> {/* spacer */}
          <Field label="Org EN" value={form.org_en} onChange={set('org_en')} />
          <Field label="Org TH" value={form.org_th} onChange={set('org_th')} />
        </div>
        <Field label="Body EN" value={form.body_en} onChange={set('body_en')} rows={3} />
        <Field label="Body TH" value={form.body_th} onChange={set('body_th')} rows={3} />
        <Alert>{error}</Alert>
        <div className="flex gap-2">
          <SaveBtn saving={saving} saved={false} />
          {editId && <button type="button" onClick={cancelEdit} className="h-9 px-5 font-mono text-[12px] border border-[#2a3545] text-[#9aa7b4] hover:border-[#a3e635] hover:text-[#cfd6de] transition-colors">cancel</button>}
        </div>
      </form>

      <div className="space-y-2 max-w-2xl">
        <div className="font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-3">// {items.length} entries</div>
        {items.map((item, i) => (
          <div key={item.id} className="flex items-center gap-3 border border-[#1a2330] bg-[#0a0e12] px-4 py-3 hover:border-[#2a3545] transition-colors">
            <div className="flex flex-col gap-0.5">
              <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="font-mono text-[10px] text-[#5d6b7a] hover:text-[#a3e635] disabled:opacity-20 leading-none">▲</button>
              <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="font-mono text-[10px] text-[#5d6b7a] hover:text-[#a3e635] disabled:opacity-20 leading-none">▼</button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-mono text-[13px] text-[#e8eef5] truncate">{item.role}</div>
              <div className="font-mono text-[11px] text-[#5d6b7a] truncate">{item.org_en} · {item.range_en}</div>
            </div>
            <button type="button" onClick={() => startEdit(item)} className="font-mono text-[11px] text-[#a3e635] hover:underline shrink-0">edit</button>
            <button type="button" onClick={() => setDeleteTarget(item)} className="font-mono text-[11px] text-[#ff6b6b] hover:underline shrink-0">delete</button>
          </div>
        ))}
      </div>
      {deleteTarget && (
        <ConfirmDialog
          title="Delete experience?"
          body={`This will remove "${deleteTarget.role}" from the timeline.`}
          busy={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}

// ── Messages Tab ──────────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  async function load() {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    if (error) { setError(error.message); return }
    setMessages(data ?? [])
  }
  useEffect(() => { load() }, [])

  async function toggleRead(msg) {
    setError(null)
    const { error } = await supabase.from('messages').update({ read: !msg.read }).eq('id', msg.id)
    if (error) { setError(error.message); return }
    load()
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div className="space-y-3 max-w-2xl">
      <div className="font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-3">
        // {messages.length} messages{unread > 0 && <span className="ml-2 text-[#a3e635]">· {unread} unread</span>}
      </div>
      <Alert>{error}</Alert>
      {messages.length === 0 && <p className="font-mono text-[13px] text-[#5d6b7a]">no messages yet.</p>}
      {messages.map(m => (
        <div key={m.id} className={`border p-4 transition-colors ${m.read ? 'border-[#1a2330] bg-[#0a0e12]' : 'border-[#a3e635]/30 bg-[#a3e635]/5'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="font-mono text-[13px] text-[#e8eef5]">
                {m.name} <span className="text-[#5d6b7a] font-normal">— {m.email}</span>
              </div>
              <p className="mt-1.5 text-[14px] text-[#9aa7b4] leading-relaxed">{m.message}</p>
              <div className="mt-2 font-mono text-[10px] text-[#5d6b7a]">
                {new Date(m.created_at).toLocaleString()}
              </div>
            </div>
            <button onClick={() => toggleRead(m)} className={`shrink-0 font-mono text-[10px] px-3 py-1.5 border transition-colors ${m.read ? 'border-[#1a2330] text-[#5d6b7a] hover:border-[#a3e635] hover:text-[#a3e635]' : 'border-[#a3e635] text-[#a3e635]'}`}>
              {m.read ? 'mark unread' : 'mark read ✓'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Block helper ──────────────────────────────────────────────────
function Block({ title, children }) {
  return (
    <section className="border border-[#1a2330] p-6 space-y-4">
      <div className="font-mono text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-2">// {title}</div>
      {children}
    </section>
  )
}

// ── Dashboard Shell ───────────────────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState('Profile')

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-[#080c10] font-sans">
      {/* Header */}
      <header className="border-b border-[#1a2330] bg-[#0a0e12] px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-[#a3e635]">// admin</span>
          <a href="/" target="_blank" className="font-mono text-[11px] text-[#5d6b7a] hover:text-[#9aa7b4] transition-colors">← portfolio ↗</a>
        </div>
        <button onClick={handleSignOut} className="font-mono text-[11px] text-[#5d6b7a] hover:text-[#ff6b6b] transition-colors">
          sign_out()
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Tab nav */}
        <div className="flex gap-1 mb-8 border-b border-[#1a2330] pb-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`font-mono text-[12px] px-4 py-2.5 border-b-2 transition-colors ${tab === t ? 'border-[#a3e635] text-[#a3e635]' : 'border-transparent text-[#5d6b7a] hover:text-[#9aa7b4]'}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === 'Profile'    && <ProfileTab />}
        {tab === 'Projects'   && <ProjectsTab />}
        {tab === 'Experience' && <ExperienceTab />}
        {tab === 'Messages'   && <MessagesTab />}
      </div>
    </div>
  )
}
