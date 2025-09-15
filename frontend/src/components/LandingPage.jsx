// DustOut Inc Landing Page (Vite + Tailwind)
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, Check, Mail, Calendar } from "lucide-react";
console.log("Booking endpoint:", import.meta.env.VITE_BOOKING_ENDPOINT);

export default function LandingPage() {
  const [services] = useState([
    { title: "Home Cleaning", desc: "Thorough cleaning for your entire home." },
    { title: "Office Cleaning", desc: "Keep your workspace spotless and professional." },
    { title: "Deep Cleaning", desc: "Detailed cleaning for kitchens, bathrooms, and more." },
  ]);

  const [form, setForm] = useState({ service: services[0].title, date: "", time: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(import.meta.env.VITE_BOOKING_ENDPOINT || "http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Booking failed");
      setMessage({ type: "success", text: "Booking confirmed — check your email & calendar." });
      setForm({ ...form, date: "", time: "" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center text-white font-bold">DO</div>
          <div className="text-lg font-semibold">DustOut Inc</div>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <a href="#services" className="hover:text-indigo-600">Services</a>
          <a href="#booking" className="hover:text-indigo-600">Book Now</a>
          <a href="#contact" className="hover:text-indigo-600">Contact</a>
          <button className="ml-4 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm shadow">Book a Cleaning</button>
        </nav>
        <button className="md:hidden p-2">
          <Menu size={20} />
        </button>
      </header>

      <main className="container mx-auto px-6 md:px-12">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">Professional Cleaning Services, Just a Click Away.</h1>
            <p className="text-lg text-slate-600 max-w-xl">DustOut Inc provides reliable, top-quality cleaning services tailored to your needs. Book easily online and sync with your calendar.</p>

            <div className="flex gap-3">
              <a href="#booking" className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-indigo-600 text-white font-medium shadow hover:opacity-95">Book a Cleaning</a>
              <a href="#services" className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-200 text-sm text-slate-700">View Services</a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="order-first md:order-last">
            <div className="rounded-2xl overflow-hidden shadow-xl bg-white">
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1400&auto=format&fit=crop" alt="cleaning" className="w-full object-cover h-80 md:h-96" />
            </div>
          </motion.div>
        </section>

        <section id="services" className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <motion.div key={s.title} whileHover={{ y: -6 }} className="bg-white rounded-2xl p-6 shadow">
              <h3 className="font-semibold text-lg">{s.title}</h3>
              <p className="text-sm text-slate-600 mt-2">{s.desc}</p>
            </motion.div>
          ))}
        </section>

        <section id="booking" className="mt-16 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold">Book a Cleaning Service</h3>
            <p className="mt-3 text-slate-600">Select your service, choose a time, and we’ll handle the rest. Your booking will be added to Google Calendar and we’ll notify you by email.</p>
            <form onSubmit={handleSubmit} className="mt-6 grid grid-cols-1 gap-3 max-w-md">
              <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="px-4 py-3 rounded-lg border border-slate-200">
                {services.map((s) => (<option key={s.title} value={s.title}>{s.title}</option>))}
              </select>
              <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" required className="px-4 py-3 rounded-lg border border-slate-200" />
              <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} type="time" required className="px-4 py-3 rounded-lg border border-slate-200" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} aria-label="email" placeholder="Email address" required className="px-4 py-3 rounded-lg border border-slate-200" />
              <button disabled={loading} type="submit" className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white font-medium">{loading ? "Booking..." : "Confirm Booking"} <Calendar size={14} /></button>
            </form>
            {message && (<div className={`mt-3 text-sm ${message.type === "success" ? "text-green-600" : "text-red-600"}`}>{message.text}</div>)}
            <p className="text-xs text-slate-500 mt-2">* Integrate this form with the backend server (see server/README) for Google Calendar & email notifications.</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="font-semibold">Why Choose DustOut?</h4>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2"><Check size={14} className="mt-1"/> Easy online booking</li>
              <li className="flex items-start gap-2"><Check size={14} className="mt-1"/> Trusted professionals</li>
              <li className="flex items-start gap-2"><Check size={14} className="mt-1"/> Calendar sync & reminders</li>
            </ul>
          </div>
        </section>

        <section id="contact" className="mt-16 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-bold">Contact Us</h3>
            <p className="mt-3 text-slate-600">We’re here to answer your questions and help you book your cleaning service.</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>Email: dustout.cs@gmail.com</li>
              <li>Phone: +1 (647) 393-8709</li>
              <li>Address: 101 Prudential Drive Toronto On M1P 4S5</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow">
            <h4 className="font-semibold">Send us a message</h4>
            <form action="#" className="mt-6 grid grid-cols-1 gap-3 max-w-md">
              <input aria-label="name" placeholder="Your name" className="px-4 py-3 rounded-lg border border-slate-200" />
              <input aria-label="email" placeholder="Email address" className="px-4 py-3 rounded-lg border border-slate-200" />
              <textarea aria-label="message" placeholder="Your message" className="px-4 py-3 rounded-lg border border-slate-200 h-28" />
              <button type="submit" className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-indigo-600 text-white font-medium">Send message <Mail size={14} /></button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-100 mt-12 py-8">
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="text-sm text-slate-600">© {new Date().getFullYear()} DustOut Inc — keeping it spotless ✨</div>
          <div className="flex items-center gap-4 text-sm text-slate-600">Privacy · Terms</div>
        </div>
      </footer>
    </div>
  );
}
