import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useScrollReveal } from '../hooks/useScrollReveal'

const EMPTY = { name: '', email: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const { ref, isInView } = useScrollReveal()

  function validate(name, value) {
    if (!value.trim()) return 'This field is required'
    if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) return 'Invalid email address'
    return ''
  }

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: '' }))
  }

  function handleBlur(e) {
    const error = validate(e.target.name, e.target.value)
    setErrors(prev => ({ ...prev, [e.target.name]: error }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const newErrors = {}
    Object.keys(form).forEach(key => {
      const err = validate(key, form[key])
      if (err) newErrors[key] = err
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setStatus(null)
    try {
      const { error } = await supabase.from('messages').insert([form])
      if (error) throw error
      setStatus('success')
      setForm(EMPTY)
      setErrors({})
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'success') {
    return (
      <section id="contact" className="py-20 px-4 bg-gray-50">
        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-16 h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl text-white">✓</span>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
            <p className="text-gray-500 mb-6">I'll get back to you as soon as possible.</p>
            <button
              onClick={() => setStatus(null)}
              className="px-6 py-2 rounded-lg bg-[var(--accent)] text-white font-semibold hover:brightness-90"
            >
              Send Another
            </button>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 px-4 bg-gray-50">
      <div className="max-w-lg mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Contact</h2>
        <p className="text-gray-500 text-center mb-10">Let's work together</p>

        <motion.form
          ref={ref}
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          className="space-y-4 bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.name
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]'
              }`}
              placeholder="Your name"
            />
            <AnimatePresence>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.name}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]'
              }`}
              placeholder="you@example.com"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={4}
              className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none transition-colors ${
                errors.message
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-gray-200 focus:ring-[var(--accent)]/50 focus:border-[var(--accent)]'
              }`}
              placeholder="Tell me about your project..."
            />
            <AnimatePresence>
              {errors.message && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-red-400 text-xs mt-1"
                >
                  {errors.message}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-red-500 text-sm font-medium"
              >
                Something went wrong. Please try again.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:brightness-90 transition-all disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Send Message'}
          </motion.button>
        </motion.form>
      </div>
    </section>
  )
}
