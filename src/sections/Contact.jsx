import { useState } from 'react'
import { supabase } from '../lib/supabase'

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState(null) // 'success' | 'error' | null
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const { error } = await supabase.from('messages').insert([form])
      if (error) throw error
      setStatus('success')
      setForm(EMPTY)
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contact</h2>
        <p className="text-gray-500 text-center mb-10">Let's work together</p>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name" value={form.name} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message" value={form.message} onChange={handleChange} required rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1D9E75]/50 focus:border-[#1D9E75] resize-none"
              placeholder="Tell me about your project..."
            />
          </div>

          {status === 'success' && (
            <p className="text-sm text-[#1D9E75] font-medium">Message sent! I'll get back to you soon.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-500 font-medium">Something went wrong. Please try again.</p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-3 rounded-lg bg-[#1D9E75] text-white font-semibold hover:bg-[#179060] transition-colors disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
