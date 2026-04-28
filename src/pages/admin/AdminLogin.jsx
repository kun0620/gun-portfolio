import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase.js'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/admin', { replace: true })
    })
  }, [navigate])

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword(form)
      if (error) throw error
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="font-mono text-[11px] text-[#a3e635] mb-2 tracking-widest">// admin.login</div>
        <h1 className="text-[30px] font-semibold text-[#e8eef5] mb-8 tracking-tight">Admin Panel</h1>

        <form onSubmit={handleSubmit} className="border border-[#1a2330] bg-[#0a0e12] overflow-hidden font-mono text-[13px]">
          {/* terminal titlebar */}
          <div className="flex items-center gap-2 px-4 h-9 border-b border-[#1a2330] text-[11px] text-[#5d6b7a]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff6b6b]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#fbbf24]/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#a3e635]/70" />
            <span className="ml-2">~/admin/login.sh</span>
          </div>

          <div className="p-6 space-y-5">
            <label className="block">
              <span className="block text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-1.5">&gt; email</span>
              <input
                name="email" type="email" value={form.email} onChange={handleChange} required autoFocus
                className="w-full bg-transparent border-b border-[#1a2330] focus:border-[#a3e635] outline-none py-1.5 text-[#cfd6de] placeholder:text-[#3d4956] transition-colors"
                placeholder="admin@example.com"
              />
            </label>

            <label className="block">
              <span className="block text-[10px] text-[#5d6b7a] uppercase tracking-wider mb-1.5">&gt; password</span>
              <input
                name="password" type="password" value={form.password} onChange={handleChange} required
                className="w-full bg-transparent border-b border-[#1a2330] focus:border-[#a3e635] outline-none py-1.5 text-[#cfd6de] placeholder:text-[#3d4956] transition-colors"
                placeholder="••••••••"
              />
            </label>

            {error && (
              <p className="font-mono text-[11px] text-[#ff6b6b]">[error] {error}</p>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full h-10 mt-1 bg-[#a3e635] text-[#080c10] font-mono text-[12px] font-bold hover:bg-white transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              {loading ? 'connecting...' : 'login →'}
            </button>
          </div>
        </form>

        <p className="mt-5 font-mono text-[11px] text-[#5d6b7a] text-center">
          <a href="/" className="hover:text-[#9aa7b4] transition-colors">← back to portfolio</a>
        </p>
      </div>
    </div>
  )
}
