import { useState, useEffect, useRef } from 'react';
import {
  Phone, MessageSquare, Mic, Settings, Send,
  CheckCircle2, LayoutDashboard, LogOut, Globe, Sparkles, Lock, Mail, Menu, X, Clock,
  PhoneOutgoing, CreditCard
} from 'lucide-react';
import { supabase } from './lib/supabase';

import logo from './assets/logo.png';
import { resources } from './resourceData';
import type { ResourceContent } from './resourceData';

// In production, set VITE_API_URL in your hosting provider (e.g. Vercel)
const API_URL = import.meta.env.VITE_API_URL || 'https://gravitymomi.onrender.com/api';

// --- Shared Components ---

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => (
  <div
    className={`glass-panel-pro rounded-[32px] p-8 transition-all duration-500 ease-out ${className} ${onClick ? 'cursor-pointer hover:bg-zinc-800/40 hover:scale-[1.01] hover:shadow-2xl hover:shadow-black/60 active:scale-[0.99] glass-panel-active' : ''}`}
    onClick={onClick}
  >
    {children}
  </div>
);

type BadgeColor = 'blue' | 'purple' | 'green' | 'amber' | 'red' | 'indigo';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
}

const Badge: React.FC<BadgeProps> = ({ children, color = 'blue' }) => {
  const colors: Record<BadgeColor, string> = {
    blue: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]',
    purple: 'bg-violet-500/10 text-violet-300 border border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]',
    green: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]',
    amber: 'bg-amber-500/10 text-amber-300 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]',
    red: 'bg-rose-500/10 text-rose-300 border border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]',
    indigo: 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-[0_0_15px_rgba(79,70,229,0.1)]'
  };
  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${colors[color] || colors.blue}`}>
      {children}
    </span>
  );
};

// --- Auth Component ---

// --- Static Information Pages ---

const PrivacyPolicy: React.FC = () => (
  <div className="max-w-4xl mx-auto py-16 px-6 text-slate-300">
    <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Privacy Policy</h1>
    <div className="glass-panel-pro p-8 md:p-12 rounded-[40px] border border-white/5 bg-slate-900/50 backdrop-blur-3xl prose prose-invert prose-indigo max-w-none space-y-6 text-lg font-light leading-relaxed">
      <p>Last Updated: January 8, 2026</p>

      <p>At SmartReception.ai, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by SmartReception.ai and how we use it. If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Log Files</h2>
      <p>SmartReception.ai follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Cookies and Web Beacons</h2>
      <p>Like any other website, SmartReception.ai uses "cookies". These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Google DoubleClick DART Cookie</h2>
      <p>Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.smartreceptionai.xyz and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" className="text-indigo-400 hover:text-white underline" target="_blank" rel="noopener noreferrer">https://policies.google.com/technologies/ads</a></p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Our Advertising Partners</h2>
      <p>Some of advertisers on our site may use cookies and web beacons. Our advertising partners include:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li className="font-semibold text-white">Google AdSense</li>
      </ul>
      <p>Each of our advertising partners has their own Privacy Policy for their policies on user data. For easier access, we hyperlinked to their Privacy Policies above.</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Privacy Policies</h2>
      <p>Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on SmartReception.ai, which are sent directly to users' browser. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
      <p>Note that SmartReception.ai has no access to or control over these cookies that are used by third-party advertisers.</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Data Processing Agreements (DPA)</h2>
      <p>For our business users, SmartReception.ai maintains strict Data Processing Agreements. We ensure all voice and chat transcripts are handled according to industry standards, including encryption at rest and in transit. We do not sell user data to third parties.</p>

      <h2 className="text-2xl font-bold text-white mt-8 mb-4">Consent</h2>
      <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
    </div>
  </div>
);

const TermsAndConditions: React.FC = () => (
  <div className="max-w-4xl mx-auto py-16 px-6 text-slate-300">
    <h1 className="text-4xl font-bold text-white mb-8 tracking-tight">Terms & Conditions</h1>
    <div className="glass-panel-pro p-8 md:p-12 rounded-[40px] border border-white/5 bg-slate-900/50 backdrop-blur-3xl prose prose-invert prose-indigo max-w-none space-y-6 text-lg font-light leading-relaxed text-slate-400">
      <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
      <p>By accessing SmartReception.ai, you agree to be bound by these Terms and Conditions. Our service provides a sophisticated AI-driven receptionist platform for businesses. You must be at least 18 years old to use this service.</p>

      <h2 className="text-2xl font-bold text-white">2. Use of Service</h2>
      <p>You agree to use SmartReception.ai only for lawful purposes. You are solely responsible for compliance with all applicable laws and regulations in your jurisdiction regarding automated communication and data recording.</p>

      <h2 className="text-2xl font-bold text-white">3. Ethical AI Policy</h2>
      <p>Users are prohibited from using our AI for deceptive practices, spamming, or harassment. We reserve the right to terminate accounts that violate our ethical guidelines.</p>

      <h2 className="text-2xl font-bold text-white">4. Limitation of Liability</h2>
      <p>SmartReception.ai provides its services "as is." We shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our platform.</p>
    </div>
  </div>
);

const AboutUs: React.FC = () => (
  <div className="max-w-5xl mx-auto py-16 px-6 text-slate-300">
    <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
      <Badge color="indigo">Our Story</Badge>
      <h1 className="text-5xl font-bold text-white tracking-tight">The Human Side of AI</h1>
      <p className="text-xl text-zinc-400 font-light leading-relaxed">
        Building the bridge between technological efficiency and human empathy since 2024.
      </p>
    </div>

    <div className="space-y-16">
      <div className="prose prose-invert prose-indigo max-w-none text-lg leading-relaxed font-light space-y-8">
        <p>SmartReception.ai was born out of a simple, frustrating observation: in a world of instant information, business communication was still stuck in the 20th century. Our founders, a team of engineers and customer experience specialists, saw too many small businesses struggling to balance deep work with the constant demands of the telephone.</p>

        <p>We didn't set out to replace humans. We set out to <strong>amplify</strong> them. We believe that every business, regardless of size, deserves a professional front-desk presence that reflects their values and expertise. Our AI is designed to handle the routine, the repetitive, and the 2:00 AM inquiries, so that human experts can focus on what they do best: building relationships and solving complex problems.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Empathetic Design", desc: "Our AI is trained with emotional intelligence at its core, ensuring every caller feels respected and heard." },
          { title: "Uncompromising Privacy", desc: "We believe privacy is a human right. Every interaction we facilitate is encrypted and secure." },
          { title: "Global Accessibility", desc: "Our goal is to break language and time barriers, making business truly global and inclusive." }
        ].map((v, i) => (
          <Card key={i} className="p-8 border-white/5 bg-white/[0.02]">
            <h3 className="text-xl font-bold text-white mb-4">{v.title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{v.desc}</p>
          </Card>
        ))}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 p-12 rounded-[40px] text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
        <p className="text-xl text-indigo-200 font-light max-w-2xl mx-auto">
          "To provide every business on earth with a world-class, intelligent front-desk, ensuring that no human opportunity is ever lost to a missed connection."
        </p>
      </div>
    </div>
  </div>
);

const ContactUs: React.FC = () => (
  <div className="max-w-6xl mx-auto py-16 px-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div className="space-y-12">
        <div className="space-y-4">
          <Badge color="purple">Get in Touch</Badge>
          <h1 className="text-5xl font-bold text-white tracking-tight">How can we help?</h1>
          <p className="text-zinc-400 text-lg font-light leading-relaxed">
            Whether you have a technical question or want to explore enterprise-grade scaling, our experts are ready to assist you.
          </p>
        </div>

        <div className="space-y-8">
          {[
            { icon: <Mail className="w-6 h-6" />, label: "Email Support", value: "support@smartreceptionai.xyz", desc: "Average response: 4 hours" },
            { icon: <Globe className="w-6 h-6" />, label: "Global HQ", value: "123 Innovation Drive, Tech City, 90210", desc: "Open for consultations by appointment" }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-6 group">
              <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                {item.icon}
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-white uppercase tracking-widest text-[10px]">{item.label}</p>
                <p className="text-xl text-zinc-100 font-medium">{item.value}</p>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Card className="p-8 md:p-10 border-white/5 bg-slate-900/40 backdrop-blur-2xl rounded-[40px]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
              <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Work Email</label>
              <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="john@company.com" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Subject</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition" placeholder="Inquiry about Enterprise Plans" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Message</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition h-32" placeholder="Tell us how we can assist your business..."></textarea>
          </div>
          <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-indigo-500/20 active:scale-[0.98]">
            Send Message
          </button>
          <p className="text-center text-xs text-zinc-600">By clicking send, you agree to our privacy policy and data processing standards.</p>
        </div>
      </Card>
    </div>
  </div>
);

const Footer: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => (
  <footer className="w-full py-12 border-t border-white/5 mt-auto relative z-10 bg-slate-950">
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
          <span className="text-white font-bold text-xl tracking-tight">SmartReception.ai</span>
        </div>
        <p className="text-zinc-500 text-sm leading-relaxed">
          The world's leading AI workforce management platform. Providing ultra-low latency voice and chat receptionists for modern businesses.
        </p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Services</h4>
        <div className="flex flex-col gap-2 text-sm">
          <a href="/service-ai-chat" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/service-ai-chat'); onNavigate('service-ai-chat'); }} className="text-zinc-500 hover:text-white transition text-left">AI Chat Receptionist</a>
          <a href="/service-ai-voice" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/service-ai-voice'); onNavigate('service-ai-voice'); }} className="text-zinc-500 hover:text-white transition text-left">AI Voice Receptionist</a>
          <a href="/service-automation" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/service-automation'); onNavigate('service-automation'); }} className="text-zinc-500 hover:text-white transition text-left">Business Automation</a>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Resources</h4>
        <div className="flex flex-col gap-2 text-sm">
          <a href="/resource-hub" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/resource-hub'); onNavigate('resource-hub'); }} className="text-zinc-500 hover:text-white transition text-left">Resource Hub</a>
          <a href="/about-us" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/about-us'); onNavigate('about-us'); }} className="text-zinc-500 hover:text-white transition text-left">About Us</a>
          <a href="/contact-us" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/contact-us'); onNavigate('contact-us'); }} className="text-zinc-500 hover:text-white transition text-left">Contact Us</a>
        </div>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Legal</h4>
        <div className="flex flex-col gap-2 text-sm">
          <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/privacy-policy'); onNavigate('privacy-policy'); }} className="text-zinc-500 hover:text-white transition text-left">Privacy Policy</a>
          <a href="/terms-conditions" onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', '/terms-conditions'); onNavigate('terms-conditions'); }} className="text-zinc-500 hover:text-white transition text-left">Terms & Conditions</a>
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-zinc-600 text-xs">© 2026 SmartReception.ai. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

const ResourceHub: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => (
  <div className="max-w-7xl mx-auto py-16 px-6">
    <div className="text-center mb-16 space-y-4">
      <Badge color="purple">Knowledge Base</Badge>
      <h1 className="text-5xl font-bold text-white tracking-tight">Resource Hub</h1>
      <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-light">
        Expert insights, industry trends, and deep-dive case studies on the future of business communication.
      </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.map((item) => (
        <a
          key={item.id}
          href={`/resource-${item.id}`}
          onClick={(e) => { e.preventDefault(); window.history.pushState({}, '', `/resource-${item.id}`); onNavigate(`resource-${item.id}`); }}
          className="group block"
        >
          <Card className="p-6 flex flex-col h-full hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded">{item.category}</span>
              <span className="text-zinc-500 text-xs flex items-center gap-1"><Clock className="w-3 h-3" /> {item.readTime}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-1">{item.description}</p>
            <div className="flex items-center text-indigo-400 text-sm font-semibold group-hover:translate-x-1 transition-transform">
              Read Full Article <Sparkles className="w-4 h-4 ml-2" />
            </div>
          </Card>
        </a>
      ))}
    </div>
  </div>
);

const ServiceSilo: React.FC<{ title: string; subtitle: string; content: React.ReactNode }> = ({ title, subtitle, content }) => (
  <div className="max-w-5xl mx-auto py-16 px-6 text-slate-300 animate-in fade-in duration-1000">
    <div className="mb-12 space-y-4 text-center">
      <h1 className="text-5xl md:text-6xl font-bold text-white tracking-tight">{title}</h1>
      <p className="text-xl text-indigo-400 font-medium tracking-wide">{subtitle}</p>
    </div>
    <div className="prose prose-invert prose-indigo max-w-none space-y-8 text-lg leading-relaxed">
      {content}
    </div>
  </div>
);

const ResourceDetail: React.FC<{ item: ResourceContent }> = ({ item }) => (
  <div className="max-w-4xl mx-auto py-16 px-6 text-slate-300 animate-in fade-in slide-in-from-bottom-8 duration-1000">
    <div className="mb-12 space-y-6 text-center">
      <div className="flex items-center justify-center gap-4 text-xs font-bold uppercase tracking-widest">
        <span className="text-indigo-400">{item.category}</span>
        <span className="text-zinc-600">•</span>
        <span className="text-zinc-500">{item.readTime} Read</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">{item.title}</h1>
    </div>
    <div className="p-8 md:p-12 rounded-[40px] border border-white/5 bg-slate-900/50 backdrop-blur-3xl">
      <div className="prose prose-invert prose-indigo max-w-none space-y-6 whitespace-pre-wrap font-light leading-relaxed text-lg text-slate-300">
        {item.content}
      </div>
    </div>
  </div>
);

interface AuthProps {
  onAuthSuccess: () => void;
  onTryDemo: () => void;
  onNavigate: (view: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess, onTryDemo, onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[Auth] Starting authentication...");
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        console.log("[Auth] Attempting sign in...");
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        console.log("[Auth] Login successful for:", data.user?.email);
        onAuthSuccess();
      }
    } catch (err: any) {
      console.error("[Auth] Error:", err.message);
      setError(err.message || 'Authentication failed');
      alert(`Login Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

      <div className="flex-1 grid place-items-center w-full max-w-md mx-auto relative z-10 pt-12 pb-24">
        <div className="w-full">
          <div className="text-center mb-10 space-y-4">
            <div className="w-24 h-24 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[32px] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-500/10 animate-float overflow-hidden p-4">
              <img src={logo} alt="SmartReception Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm">SmartReception.ai</h1>
              <p className="text-titanium text-lg font-light tracking-wide mt-2">Your AI workforce, perfectly managed.</p>
            </div>
          </div>

          <Card className="!p-8 backdrop-blur-3xl bg-black/40 border-white/10">
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">Email Address</label>
                <div className="relative group">
                  <input
                    type="email"
                    required
                    autoComplete="off"
                    className="w-full input-apple pl-11"
                    placeholder="name@company.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors duration-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative group">
                  <input
                    type="password"
                    required
                    className="w-full input-apple pl-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors duration-300" />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/10 rounded-2xl text-sm text-red-300 text-center font-medium">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-apple bg-white text-black hover:bg-zinc-200 py-4 text-sm font-semibold shadow-lg shadow-white/5"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="px-3 bg-black/40 text-zinc-600 backdrop-blur-xl">Or</span></div>
              </div>

              <button
                type="button"
                onClick={onTryDemo}
                className="w-full btn-apple bg-zinc-900/50 hover:bg-zinc-800 text-white border border-white/10 py-4 flex items-center justify-center gap-2 group text-sm"
              >
                <Sparkles className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300" />
                Try Demo Mode
              </button>

              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <div className="flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${API_URL.startsWith('https') ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500 animate-pulse'}`} />
                    <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
                      {API_URL.startsWith('https') ? 'SECURE CONNECTION' : 'INSECURE CONNECTION'}
                    </span>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-titanium hover:text-white transition-colors duration-300 font-medium"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>
            </div>
          </Card>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
};

// --- Logic to Attach Token to Requests ---

const authenticatedFetch = async (url: string, options: RequestInit = {}, retries = 3) => {
  console.log(`[Fetch] Calling: ${url}`);
  const { data: { session } } = await supabase.auth.getSession();
  // Normalize headers to lowercase to avoid duplicates (e.g., 'Content-Type' vs 'content-type')
  const incomingHeaders = new Headers(options.headers || {});
  const headers: Record<string, string> = {
    'content-type': 'application/json', // Default
  };

  incomingHeaders.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  if (session?.access_token) {
    headers['authorization'] = `Bearer ${session.access_token}`;
  }

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout per attempt

      const res = await fetch(url, { ...options, headers, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error(`[Fetch] Request failed with status: ${res.status}`);
      }
      return res;
    } catch (err: any) {
      console.warn(`[Fetch] Attempt ${i + 1} failed:`, err);
      if (i === retries - 1) throw err;
      // Wait 3 seconds before retrying (gives Render time to wake up)
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  throw new Error("Maximum retries reached");
};

// --- Updated Sub-Components (Same UI, New Data Handling) ---

interface BusinessConfig {
  name: string;
  services: string;
  tone: string;
  greeting: string;
  workingHours: string;
  business_name?: string; // Optional, used in other components
  industry?: string; // Optional, used in other components
  subscription_plan?: 'free' | 'starter' | 'growth' | 'pro';
  minutes_used?: number;
  minutes_limit?: number;
}

const UsageCard: React.FC<{ used: number; limit: number }> = ({ used, limit }) => {
  const percentage = Math.min((used / limit) * 100, 100);
  const isWarning = percentage > 80;
  const isCritical = percentage >= 100;

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-white flex items-center gap-3 text-lg tracking-tight">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Clock className="w-5 h-5 text-indigo-400" />
          </div>
          Plan Usage
        </h3>
        <Badge color={isCritical ? 'red' : isWarning ? 'amber' : 'green'}>
          {isCritical ? 'Limit Reached' : isWarning ? 'Running Low' : 'Active'}
        </Badge>
      </div>

      <div className="mb-3 flex justify-between text-xs font-medium uppercase tracking-wider">
        <span className="text-titanium">Minutes Used</span>
        <span className="text-white">{used} / {limit}</span>
      </div>

      <div className="w-full bg-zinc-800/50 rounded-full h-1.5 overflow-hidden mb-6">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_currentColor] ${isCritical ? 'bg-red-500 text-red-500' : isWarning ? 'bg-amber-500 text-amber-500' : 'bg-emerald-500 text-emerald-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {isCritical && (
        <div className="text-xs text-red-300 bg-red-500/5 p-3 rounded-2xl border border-red-500/10 flex items-start gap-2">
          <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <p>Calls are currently blocked. Please upgrade to Pro.</p>
        </div>
      )}
    </Card>
  );
};

const PricingCard: React.FC<{
  plan: string;
  price: string;
  mins: number;
  current: boolean;
  features: string[];
  onClick?: () => void;
}> = ({ plan, price, mins, current, features, onClick }) => (
  <Card className={`p-8 relative overflow-hidden flex flex-col group ${current ? 'ring-1 ring-white/20 bg-white/[0.03]' : 'opacity-80 hover:opacity-100'}`} onClick={onClick}>
    {current && (
      <div className="absolute top-4 right-4">
        <div className="bg-white text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-white/20">
          ACTIVE
        </div>
      </div>
    )}

    <div className="mb-6">
      <h3 className="text-lg font-semibold text-white mb-2">{plan}</h3>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-white tracking-tight">{price}</span>
        {price !== 'Free' && <span className="text-sm text-titanium font-medium">/mo</span>}
      </div>
    </div>

    <div className="space-y-4 mb-8 flex-1">
      <div className="flex items-center gap-3 text-sm text-zinc-300">
        <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-300">
          <Clock className="w-3 h-3" />
        </div>
        <span>{mins} mins/month</span>
      </div>
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-3 text-sm text-zinc-300">
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-300">
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <span>{f}</span>
        </div>
      ))}
    </div>

    <button
      disabled={current}
      className={`w-full py-4 rounded-full text-sm font-semibold transition-all duration-300 ${current
        ? 'bg-zinc-800/50 text-zinc-500 cursor-default border border-white/5'
        : 'btn-apple bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10'
        }`}
      onClick={e => { e.stopPropagation(); if (onClick) onClick(); }}
    >
      {current ? 'Current Plan' : 'Upgrade Plan'}
    </button>
  </Card>
);

interface OnboardingProps {
  onComplete: (config: BusinessConfig) => void;
  isDemoMode?: boolean;
}

// Onboarding now uses authenticatedFetch
const Onboarding: React.FC<OnboardingProps> = ({ onComplete, isDemoMode }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BusinessConfig>({
    name: '', services: '', tone: 'professional', greeting: '', workingHours: '9 AM - 5 PM, Mon-Fri'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (isDemoMode) {
      // Skip backend API call for Demo Mode
      // Map fields to match backend structure (include both field name formats)
      const configForBackend = {
        name: formData.name,
        business_name: formData.name,
        services: formData.services,
        tone: formData.tone,
        greeting: formData.greeting,
        workingHours: formData.workingHours,
        working_hours: formData.workingHours
      };
      setTimeout(() => {
        onComplete(configForBackend as BusinessConfig);
        setIsSubmitting(false);
      }, 800);
      return;
    }

    try {
      const res = await authenticatedFetch(`${API_URL}/setup`, {
        method: 'POST',
        body: JSON.stringify(formData)
      });

      // Check for HTTP errors
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}. Please try again.`);
      }

      const data = await res.json();
      if (data.success) {
        // Map fields to match backend structure (same as demo mode)
        const configForBackend = {
          name: formData.name,
          business_name: formData.name,
          services: formData.services,
          tone: formData.tone,
          greeting: formData.greeting,
          workingHours: formData.workingHours,
          working_hours: formData.workingHours
        };
        onComplete(configForBackend as BusinessConfig);
      } else {
        throw new Error(data.error || 'Setup failed. Please try again.');
      }
    } catch (err: any) {
      console.error("Setup failed", err);

      // Handle the case where the user already exists (duplicate key error)
      // This allows users to recover if they are stuck in onboarding but have a backend record
      if (err.message && (err.message.includes('duplicate key') || err.message.includes('unique constraint'))) {
        console.log("Duplicate key detected - proceeding to dashboard as recovery");
        alert("Account already set up! Proceeding to dashboard...");
        onComplete(formData);
        return;
      }

      alert(`❌ Launch Failed\n\n${err.message || 'Unknown error occurred'}\n\nPlease ensure you are logged in and try again. If the problem persists, the server may be starting up - wait 30 seconds and retry.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-500/5 blur-[150px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10">
        <Card className="!p-10 backdrop-blur-3xl bg-black/60 border-white/10 shadow-2xl">
          <div className="mb-8">
            <h2 className="text-3xl font-semibold text-white mb-2 tracking-tight">Setup Your Business</h2>
            <div className="flex items-center gap-2 text-sm">
              <span className={`px-2 py-0.5 rounded-full ${step >= 1 ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-zinc-500'}`}>1</span>
              <div className={`h-0.5 w-8 ${step >= 2 ? 'bg-white' : 'bg-zinc-800'}`}></div>
              <span className={`px-2 py-0.5 rounded-full ${step >= 2 ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-zinc-500'}`}>2</span>
              <div className={`h-0.5 w-8 ${step >= 3 ? 'bg-white' : 'bg-zinc-800'}`}></div>
              <span className={`px-2 py-0.5 rounded-full ${step >= 3 ? 'bg-white text-black font-bold' : 'bg-zinc-800 text-zinc-500'}`}>3</span>
            </div>
          </div>

          <div className="space-y-6">
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label htmlFor="businessName" className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">Business Name</label>
                  <input id="businessName" name="name" className="w-full input-apple" placeholder="Acme Corp" value={formData.name} onChange={handleInputChange} autoFocus />
                </div>
                <div>
                  <label htmlFor="services" className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">Services & Offerings</label>
                  <textarea id="services" name="services" className="w-full input-apple h-32 resize-none" placeholder="Describe what your business does..." value={formData.services} onChange={handleInputChange} />
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label htmlFor="tone" className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">AI Voice Tone</label>
                  <div className="relative">
                    <select id="tone" name="tone" className="w-full input-apple appearance-none cursor-pointer" value={formData.tone} onChange={handleInputChange}>
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="enthusiastic">Enthusiastic</option>
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-zinc-500">
                      <Settings className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="greeting" className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">System Greeting</label>
                  <input id="greeting" name="greeting" className="w-full input-apple" placeholder="Hello, thanks for calling..." value={formData.greeting} onChange={handleInputChange} />
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label htmlFor="workingHours" className="block text-xs font-semibold text-titanium uppercase tracking-wider mb-2 ml-1">Working Hours</label>
                  <input id="workingHours" name="workingHours" className="w-full input-apple" placeholder="9 AM - 5 PM, Mon-Fri" value={formData.workingHours} onChange={handleInputChange} />
                </div>
                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-sm">
                  Ready to launch? Your AI receptionist will be live immediately.
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-12">
            {step > 1 ? <button onClick={prevStep} className="px-6 py-3 text-zinc-400 hover:text-white transition-colors">Back</button> : <div />}
            {step < 3 ? <button onClick={nextStep} className="btn-apple bg-white text-black px-8 py-3 shadow-lg shadow-white/10 hover:shadow-white/20">Continue</button> :
              <button onClick={handleSubmit} disabled={isSubmitting} className="btn-apple bg-indigo-500 text-white px-8 py-3 shadow-lg shadow-indigo-500/30 hover:bg-indigo-400">{isSubmitting ? 'Launching...' : 'Launch Business'}</button>}
          </div>
        </Card>
      </div>
    </div>
  );
};

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatDemoViewProps {
  config: BusinessConfig;
  isDemoMode?: boolean;
}

// ChatDemo now uses authenticatedFetch
const ChatDemoView: React.FC<ChatDemoViewProps> = ({ config, isDemoMode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: config.greeting || 'Hello!' }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const isConfigValid = (cfg: BusinessConfig) => {
    return cfg && (cfg.name || cfg.business_name || cfg.services);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (!isConfigValid(config)) {
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      setInput('');
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Error: Business configuration missing. Please go to Settings and save your business details first.' }]);
      }, 500);
      return;
    }

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Pass config in body if in Demo Mode
      const bodyPayload = {
        message: userMsg.content,
        history: messages.map(m => ({ role: m.role, content: m.content })),
        config: config || {}
      };

      // Use direct fetch for demo mode
      const fetcher = isDemoMode ? fetch : authenticatedFetch;

      const res = await fetcher(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      console.error("Chat Error:", err);
      setMessages(prev => [...prev, { role: 'assistant', content: `Connection failed: ${err.message || 'Unknown error'}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-full">
      <Card className="flex-1 flex flex-col overflow-hidden !bg-black/40 md:border-white/10 backdrop-blur-3xl shadow-2xl relative">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/50 to-transparent pointer-events-none z-10" />

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth pb-24">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
              <div className={`p-4 md:p-5 rounded-3xl max-w-[85%] md:max-w-[75%] shadow-lg ${msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-zinc-800/80 border border-white/5 text-zinc-100 rounded-bl-sm backdrop-blur-xl'
                }`}>
                <p className="text-base leading-relaxed tracking-wide font-light">{msg.content}</p>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>

        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8 z-20">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-full p-2 pl-6 flex items-center shadow-2xl shadow-black/50 ring-1 ring-white/5">
            <input
              className="flex-1 bg-transparent text-white text-base outline-none placeholder-zinc-500"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask anything..."
            />
            <button
              onClick={handleSend}
              className="p-3 bg-white text-black rounded-full hover:bg-zinc-200 hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-white/5"
            >
              <Send className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// --- Billing Components ---

const BillingPricingCard: React.FC<{
  plan: string;
  price: string;
  mins: number;
  current: boolean;
  features: string[];
  onClick: () => void;
}> = ({ plan, price, mins, current, features, onClick }) => (
  <Card className={`p-6 relative overflow-hidden flex flex-col ${current ? 'border-purple-500 ring-1 ring-purple-500' : 'opacity-80 hover:opacity-100 transition'}`}>
    {current && (
      <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
        CURRENT PLAN
      </div>
    )}

    <h3 className="text-xl font-bold text-white mb-1 capitalize">{plan}</h3>
    <div className="flex items-baseline gap-1 mb-4">
      <span className="text-2xl font-bold text-white">{price}</span>
      {price !== 'Free' && <span className="text-sm text-slate-400">/mo</span>}
    </div>

    <div className="space-y-3 mb-8 flex-1">
      <div className="flex items-center gap-2 text-sm text-slate-300">
        <Clock className="w-4 h-4 text-purple-400" />
        <span>{mins} mins/month</span>
      </div>
      {features.map((f, i) => (
        <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-green-400" />
          <span>{f}</span>
        </div>
      ))}
    </div>

    <button
      disabled={current}
      className={`w-full py-3 rounded-xl text-sm font-bold transition ${current
        ? 'bg-slate-700 text-slate-400 cursor-default'
        : 'bg-white text-slate-900 hover:bg-slate-200'
        }`}
      onClick={onClick}
    >
      {current ? 'Active Plan' : 'Select Plan'}
    </button>
  </Card>
);

const PaymentModal: React.FC<{
  plan: any;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ plan, onClose, onSuccess }) => {
  const [method, setMethod] = useState<'payoneer' | 'nayapay'>('payoneer');
  const [reference, setReference] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [config, setConfig] = useState<{ payoneerEmail: string, nayapayId: string } | null>(null);

  useEffect(() => {
    // Fetch payment details
    authenticatedFetch(`${API_URL}/admin/config`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => setConfig({ payoneerEmail: 'payments@smartreception.ai', nayapayId: '03001234567' }));
  }, []);

  const handleSubmit = async () => {
    if (!reference) return alert('Please enter the transaction reference');
    setSubmitting(true);
    try {
      console.log('Submitting payment...', { plan: plan.id, amount: plan.price, paymentMethod: method, reference });

      const res = await authenticatedFetch(`${API_URL}/billing/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: plan.id,
          amount: plan.price,
          paymentMethod: method,
          reference
        })
      });

      console.log('Payment response status:', res.status);

      // Handle non-JSON responses (like 404 or 500 HTML pages)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error(`Server returned unexpected response: ${res.status}. Please try again.`);
      }

      if (res.ok) {
        alert('Payment request submitted! We will activate your plan shortly after verification.');
        onSuccess();
      } else {
        throw new Error(data.error || 'Submission failed');
      }
    } catch (e: any) {
      console.error('Payment submission error:', e);
      alert(`Error: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!config) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-lg p-6 bg-slate-900 border-slate-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Upgrade to {plan.name}</h3>
          <button onClick={onClose}><X className="w-5 h-5 text-slate-400" /></button>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setMethod('payoneer')}
            className={`flex-1 p-3 rounded-xl border transition ${method === 'payoneer' ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            Payoneer
          </button>
          <button
            onClick={() => setMethod('nayapay')}
            className={`flex-1 p-3 rounded-xl border transition ${method === 'nayapay' ? 'bg-purple-600/20 border-purple-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
          >
            NayaPay (Card)
          </button>
        </div>

        <div className="mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-300 mb-2">Instructions:</div>
          {method === 'payoneer' ? (
            <div className="space-y-2">
              <p className="font-semibold text-white text-md">USD Receiving Account Details</p>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
                <span className="font-bold">Bank Name:</span> <span className="text-white">Citibank</span>
                <span className="font-bold">Routing (ABA):</span> <span className="text-white select-all">031100209</span>
                <span className="font-bold">Account Number:</span> <span className="text-white select-all">70586520001968114</span>
                <span className="font-bold">Beneficiary:</span> <span className="text-white">Muhammad Elahi</span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Log in to your Payoneer, go to <b>Pay</b> &gt; <b>Make a Payment</b>, and use the details above.
              </p>
            </div>
          ) : (
            <div>
              <p className="font-semibold text-white text-lg select-all">{config.nayapayId}</p>
              <p className="text-xs text-slate-500 mt-1">Send <b>Rs. {plan.price * 280}</b> (approx) via NayaPay App or Bank Transfer.</p>
            </div>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {method === 'payoneer' ? 'Transaction ID / Payoneer Email' : 'Transaction ID / Sender Name'}
          </label>
          <input
            className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 outline-none focus:border-purple-500"
            placeholder={method === 'payoneer' ? "e.g. 12345678 or you@example.com" : "e.g. TXN-12345678"}
            value={reference}
            onChange={e => setReference(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : "I've Sent the Payment"}
        </button>
      </Card>
    </div>
  );
};

const BillingView: React.FC<{
  business: any;
  isDemoMode?: boolean;
}> = ({ business, isDemoMode }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  if (isDemoMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8">
        <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 max-w-md w-full">
          <Lock className="w-16 h-16 text-purple-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-white mb-2">Billing Locked</h2>
          <p className="text-slate-400 mb-8">
            You are currently in Demo Mode. To upgrade your plan and start real payments, you must create an account first.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await authenticatedFetch(`${API_URL}/billing/plans`);
        if (res.ok) {
          const data = await res.json();
          setPlans(data);
        } else {
          // Fallback
          setPlans([
            { id: 'starter', name: 'Starter Plan', price: 29, minutes: 100, features: ['Natural, human-like AI voice', 'Email Support'] },
            { id: 'growth', name: 'Growth Plan', price: 79, minutes: 500, features: ['Natural, human-like AI voice', 'Priority Support', 'Custom Greeting'] },
            { id: 'pro', name: 'Pro Plan', price: 149, minutes: 2000, features: ['Premium Voice', '24/7 Phone Support', 'API Access', 'White Labeling'] }
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch plans", e);
        // Fallback on error so user sees something
        setPlans([
          { id: 'starter', name: 'Starter Plan', price: 29, minutes: 100, features: ['Basic AI Voice', 'Email Support'] },
          { id: 'growth', name: 'Growth Plan', price: 79, minutes: 500, features: ['Advanced Voice', 'Priority Support', 'Custom Greeting'] },
          { id: 'pro', name: 'Pro Plan', price: 149, minutes: 2000, features: ['Premium Voice', '24/7 Phone Support', 'API Access', 'White Labeling'] }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  if (loading) return <div className="text-white p-8">Loading plans...</div>;

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto h-full overflow-y-auto">
      <h2 className="text-3xl font-bold text-white mb-2">Billing & Plans</h2>
      <p className="text-slate-400 mb-8">Choose a plan that fits your business needs.</p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {plans.map((plan) => (
          <BillingPricingCard
            key={plan.id}
            plan={plan.name}
            price={plan.price === 0 ? 'Free' : `$${plan.price}`}
            mins={plan.minutes}
            features={plan.features}
            current={business.subscription_plan === plan.id || (plan.id === 'free' && !(!business.subscription_plan))}
            onClick={() => setSelectedPlan(plan)}
          />
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={() => setSelectedPlan(null)}
        />
      )}

      <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <h3 className="text-xl font-bold text-white mb-4">Payment History</h3>
        <p className="text-slate-400 text-sm">No recent transactions.</p>
      </div>
    </div>
  );
};

// --- Custom VAD Hook ---
const useAudioVAD = (onSpeechStart: () => void, onSpeechEnd: () => void) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const intervalRef = useRef<any>(null);
  const speechStartTimeRef = useRef<number>(0);
  const lastSpeechTimeRef = useRef<number>(0);
  const isSpeakingRef = useRef(false);

  // VAD Parameters
  const SILENCE_THRESHOLD = 700; // ms to wait before considering speech ended
  const VOLUME_THRESHOLD = 0.05; // Increased from 0.02 to avoid background noise
  const MAX_DURATION = 6000; // Hard stop after 6s of speaking

  const startMonitoring = async (stream: MediaStream) => {
    if (isMonitoring) return;

    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    analyserRef.current.fftSize = 256;
    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    sourceRef.current.connect(analyserRef.current);

    setIsMonitoring(true);
    speechStartTimeRef.current = 0;
    lastSpeechTimeRef.current = Date.now();
    isSpeakingRef.current = false;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    intervalRef.current = setInterval(() => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
      const average = sum / bufferLength / 255; // Normalize 0-1

      // Optional: Log volume occasionally for debugging (comment out in production)
      if (Math.random() > 0.95) console.log("VAD Volume:", average.toFixed(4));

      const now = Date.now();

      if (average > VOLUME_THRESHOLD) {
        // Speech detected
        lastSpeechTimeRef.current = now;
        if (!isSpeakingRef.current) {
          isSpeakingRef.current = true;
          speechStartTimeRef.current = now;
          onSpeechStart();
        }

        // Hard stop check
        if (now - speechStartTimeRef.current > MAX_DURATION) {
          console.log("VAD: Max duration reached");
          onSpeechEnd();
        }
      } else {
        // Silence
        if (isSpeakingRef.current) {
          if (now - lastSpeechTimeRef.current > SILENCE_THRESHOLD) {
            console.log(`VAD: Silence detected (${now - lastSpeechTimeRef.current}ms > ${SILENCE_THRESHOLD}ms)`);
            isSpeakingRef.current = false;
            onSpeechEnd();
          }
        }
      }
    }, 100);
  };

  const stopMonitoring = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (audioContextRef.current) audioContextRef.current.close();
    setIsMonitoring(false);
  };
  return { startMonitoring, stopMonitoring, isMonitoring };
};

interface VoiceDemoViewProps {
  config: BusinessConfig;
  isDemoMode?: boolean;
}

type VoiceStatus = 'Idle' | 'Listening' | 'Thinking' | 'Speaking' | 'Error: Connection Failed' | 'Error: Mic Failed' | 'Speech Recognition not supported in this browser (Use Chrome or Safari)';

// VoiceDemoView with VAD and Streaming
const VoiceDemoView: React.FC<VoiceDemoViewProps> = ({ config, isDemoMode }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [status, setStatus] = useState<VoiceStatus>('Idle');
  const [demoReplyCount, setDemoReplyCount] = useState(0);
  const DEMO_REPLY_LIMIT = 5;


  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis>(window.speechSynthesis);
  const streamRef = useRef<MediaStream | null>(null);
  const isProcessingRef = useRef(false);

  // -- VAD Integration --
  const stopListening = () => {
    if (isProcessingRef.current) return; // Already processing
    console.log("Stopping listening loop...");
    recognitionRef.current?.stop(); // This triggers onend, which handles the transition
  };

  const vad = useAudioVAD(
    () => addDebug("VAD: Speech Start"),
    () => {
      addDebug("VAD: Speech End");
      // FORCE stop everything. Do not rely on recognition.onend entirely
      // to prevent VAD loops if recognition is flaky.
      vad.stopMonitoring();
      stopListening();
    }
  );

  // Debug state
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const addDebug = (msg: string) => setDebugInfo(prev => [...prev.slice(-4), msg]); // Keep last 5

  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const loadVoices = () => {
      const voices = synthRef.current.getVoices();
      addDebug(`Voices loaded: ${voices.length}`);
    };
    loadVoices();
    synthRef.current.addEventListener('voiceschanged', loadVoices);
    return () => synthRef.current.removeEventListener('voiceschanged', loadVoices);
  }, []);

  const processVoiceInput = async (text: string) => {
    if (!text.trim() || isProcessingRef.current) return;

    // Validation: Check for config
    if (!config || (!config.name && !config.business_name && !config.services)) {
      setStatus('Idle');
      const errMsg = "Error: Business configuration missing. Please save settings.";
      setAiResponse(errMsg);
      speak(errMsg);
      return;
    }

    isProcessingRef.current = true;
    setStatus('Thinking');
    setAiResponse('');
    addDebug(`Processing: "${text.substring(0, 15)}..."`);

    try {
      // Pass config in body if in Demo Mode
      const bodyPayload = {
        message: text,
        history: [],
        config: config || {}
      };

      console.log("[VoiceDemo] Sending payload:", bodyPayload);

      if (isDemoMode && demoReplyCount >= DEMO_REPLY_LIMIT) {
        setStatus('Idle');
        setAiResponse("Demo limit reached. Please sign up for more!");
        return;
      }

      // Use direct fetch for demo mode to avoid any auth token interference
      const fetcher = isDemoMode ? fetch : authenticatedFetch;

      const response = await fetcher(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorText.substring(0, 100)}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      setStatus('Speaking');
      addDebug("Stream started");

      while (true) {
        const { done, value } = await reader.read();
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          setAiResponse(prev => prev + chunk); // Optimistic UI update

          // Only speak during streaming for authenticated mode (not demo)
          if (!isDemoMode) {
            // Check for sentence boundaries
            const sentences = buffer.split(/([.!?]+(?:\s|$))/);
            if (sentences.length > 1) {
              const sentenceToSpeak = sentences[0] + (sentences[1] || '');
              if (sentenceToSpeak.trim()) {
                speak(sentenceToSpeak.trim());
                buffer = buffer.slice(sentenceToSpeak.length);
              }
            }
          }
        }
        if (done) break;
      }

      // For demo mode, parse JSON response
      if (isDemoMode) {
        try {
          const jsonResponse = JSON.parse(buffer);
          const actualText = jsonResponse.response || buffer;
          setAiResponse(actualText);
          speak(actualText);
        } catch {
          // Not JSON, speak as-is
          if (buffer.trim()) speak(buffer.trim());
        }
      } else {
        // Speak remaining for streaming mode
        if (buffer.trim()) speak(buffer.trim());
      }

    } catch (err: any) {
      console.error("Voice chat error:", err);
      setStatus('Error: Connection Failed');
      addDebug(`Error: ${err.message}`);
    } finally {
      if (isDemoMode) setDemoReplyCount(prev => prev + 1);
      isProcessingRef.current = false;
    }
  };


  const audioCacheRef = useRef<HTMLAudioElement | null>(null);

  const speak = async (text: string) => {
    addDebug(`Speaking: "${text.substring(0, 10)}..."`);

    try {
      // Try Premium Voice (ElevenLabs Proxy)
      const response = await fetch(`${API_URL}/voice/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          isDemo: isDemoMode,
          businessId: (config as any).id || (config as any).user_id
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        if (audioCacheRef.current) {
          audioCacheRef.current.pause();
          audioCacheRef.current = null;
        }

        const audio = new Audio(audioUrl);
        audioCacheRef.current = audio;
        audio.onended = () => {
          if (!isProcessingRef.current) setStatus('Idle');
          URL.revokeObjectURL(audioUrl);
        };
        await audio.play();
        return;
      }

      throw new Error("Premium TTS failed, falling back");

    } catch (e) {
      console.warn("[TTS] Falling back to browser synthesis:", e);
      // Fallback: Browser Speech Synthesis with Bill-like voice (Wise, Mature, Balanced)
      const utterance = new SpeechSynthesisUtterance(text);
      activeUtteranceRef.current = utterance;
      const voices = synthRef.current.getVoices();

      // Prefer deep male voices similar to Bill
      const preferredVoice =
        voices.find(v => v.name.toLowerCase().includes('david')) || // Microsoft David (deep male)
        voices.find(v => v.name.toLowerCase().includes('alex')) ||  // macOS Alex (mature male)
        voices.find(v => v.name.toLowerCase().includes('male') && v.lang.startsWith('en')) ||
        voices.find(v => v.lang.startsWith('en-US') && !v.name.toLowerCase().includes('female')) ||
        voices.find(v => v.lang.startsWith('en')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
        console.log(`[TTS] Using voice: ${preferredVoice.name}`);
      }

      // Configure for mature, balanced sound like Bill
      utterance.pitch = 0.85; // Lower pitch for mature sound
      utterance.rate = 0.95;  // Slightly slower for wise delivery
      utterance.volume = 1.0;

      utterance.onend = () => { if (!isProcessingRef.current) setStatus('Idle'); };
      synthRef.current.speak(utterance);
    }
  };


  const startListening = async () => {
    try {
      isProcessingRef.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Start VAD monitoring
      await vad.startMonitoring(stream);

      // Start Recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; // Keep it running until VAD stops it
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setStatus('Listening');
        setIsListening(true);
      };

      recognitionRef.current.onresult = (e: any) => {
        let finalTranscript = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            finalTranscript += e.results[i][0].transcript;
          } else {
            // interim
            setTranscript(e.results[i][0].transcript);
          }
        }

        if (finalTranscript) {
          setTranscript(finalTranscript);
          // If we got a final result, we technically could process it, 
          // but we wait for VAD to stop to ensure we got the full thought.
          // However, to be extra fast, if the confidence is high and it looks complete, 
          // we could potentially trigger early, but let's stick to VAD trigger for reliability/latency balance.
        }
      };

      recognitionRef.current.onend = () => {
        console.log("Recognition ended");
        vad.stopMonitoring();
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        // If strictly listening (not cancelled), process whatever we have in transcript
        if (status === 'Listening' && !isProcessingRef.current) {
          // We need to grab the latest transcript value which might be in state
          // Since we can't easily access the latest state in this callback without refs,
          // we'll rely on the fact that we updated state. 
          // Better approach: use a ref for transcript
        }
      };

      recognitionRef.current.start();

    } catch (err) {
      console.error("Mic access error:", err);
      setStatus('Error: Mic Failed');
    }
  };

  // Use a ref to track transcript for submitting on stop
  const transcriptRef = useRef('');
  useEffect(() => { transcriptRef.current = transcript; }, [transcript]);

  // Hook into VAD stop -> trigger processing
  useEffect(() => {
    // We need to customize the stopListening function used by VAD 
    // to also trigger the processing.
    // Currently vad.stopListening calls stopListening() which stops recognition.
    // recognition.onend fires.
    // We need to trigger processing *there*.
  }, []);

  // Revised stop wrapper
  const handleVADSilence = () => {
    console.log("VAD detected silence. Stopping...");
    recognitionRef.current?.stop(); // This will trigger onend
    // We process immediately to be faster
    if (transcriptRef.current) {
      processVoiceInput(transcriptRef.current);
    }
  };

  // Re-bind VAD with the handler that has access to closure/refs if needed, 
  // or just pass it directly. Since useAudioVAD is defined outside or inside?
  // It's inside. So we need to re-initialize vad or better yet, make sure useAudioVAD callback uses refs.

  // Actually, simpler fix: Update the useAudioVAD hook usage above.
  // We can't update it dynamically easily. 
  // Let's modify the VAD hook call to use a ref-stable function.

  const handleSilenceRef = useRef(handleVADSilence);
  handleSilenceRef.current = handleVADSilence;

  return (
    <div className="flex flex-col min-h-[calc(100vh-12rem)] md:h-full items-center justify-center p-4 relative overflow-hidden">
      {/* Siri Ambient Glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-1000 ${status === 'Listening' ? 'bg-red-500' :
        status === 'Speaking' ? 'bg-emerald-500' :
          status === 'Thinking' ? 'bg-amber-500' :
            'bg-indigo-500'
        }`}></div>

      <div className="mb-12 text-center max-w-full relative z-10">
        <div className="inline-flex items-center justify-center mb-6">
          <Badge color={status === 'Idle' ? 'blue' : status === 'Listening' ? 'red' : status === 'Speaking' ? 'green' : 'amber'}>
            {status === 'Speaking' ? 'AI Speaking' : status}
          </Badge>
        </div>
        <h2 className="text-4xl md:text-5xl font-semibold text-white mt-2 tracking-tighter px-4 drop-shadow-lg">{config.business_name}</h2>
        <p className="text-titanium text-lg mt-2 font-light">Intelligent Voice Interface</p>
      </div>

      <div className="relative mb-16 md:mb-20 z-10">
        {/* Siri Orb */}
        <button
          onClick={() => {
            if (isListening) {
              console.log("Manual stop -> triggering silence handler");
              handleVADSilence();
              vad.stopMonitoring();
              setIsListening(false);
            } else {
              setTranscript('');
              startListening();
            }
          }}
          className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-700 outline-none
            ${status === 'Listening' ? 'shadow-[0_0_60px_rgba(244,63,94,0.6)] scale-110' :
              status === 'Speaking' ? 'shadow-[0_0_60px_rgba(16,185,129,0.6)] scale-105' :
                status === 'Thinking' ? 'shadow-[0_0_60px_rgba(245,158,11,0.6)] animate-pulse' :
                  'shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:scale-105 hover:shadow-[0_0_60px_rgba(99,102,241,0.5)]'
            }`}
        >
          {/* Main Orb Gradient */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br transition-all duration-700 ${status === 'Listening' ? 'from-rose-500 to-red-600 animate-pulse' :
            status === 'Speaking' ? 'from-emerald-400 to-green-600 animate-orb' :
              status === 'Thinking' ? 'from-amber-300 to-orange-500 animate-spin-slow' :
                'from-indigo-500 to-blue-600 animate-orb'
            }`}></div>

          {/* Inner Gloss */}
          <div className="absolute inset-[2px] rounded-full bg-gradient-to-t from-black/20 to-white/40 opacity-50"></div>

          {/* Icon */}
          <div className="relative z-10 transition-transform duration-300">
            {status === 'Listening' ? <Mic className="w-12 h-12 text-white drop-shadow-md" /> :
              status === 'Speaking' ? <div className="flex gap-1 h-8 items-center">
                <div className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_0ms]" />
                <div className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_200ms]" />
                <div className="w-1.5 h-full bg-white rounded-full animate-[bounce_1s_infinite_400ms]" />
              </div> :
                status === 'Thinking' ? <Sparkles className="w-12 h-12 text-white animate-pulse" /> :
                  <Mic className="w-12 h-12 text-white/90" />
            }
          </div>
        </button>
      </div>

      <div className="w-full max-w-2xl space-y-6 relative z-10 px-4">
        {transcript && (
          <div className="glass-panel-pro p-6 rounded-[24px] animate-in fade-in slide-in-from-bottom-4 duration-500 text-right ml-auto max-w-[90%]">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 font-bold flex items-center justify-end gap-2">
              You <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            </p>
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed tracking-tight">{transcript}</p>
          </div>
        )}
        {aiResponse && (
          <div className="glass-panel-pro p-6 rounded-[24px] animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 bg-white/5 mr-auto max-w-[90%]">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-2 font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> AI Assistant
            </p>
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed tracking-tight text-glow">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Debug Console */}
      <div className="fixed bottom-4 right-4 max-w-xs w-full pointer-events-none z-50 opacity-50 hover:opacity-100 transition-opacity">
        <div className="bg-black/60 p-3 rounded-xl text-[10px] font-mono text-emerald-400 pointer-events-auto backdrop-blur-md border border-white/5">
          <p className="font-bold text-zinc-500 mb-2 border-b border-white/5 pb-1">SYSTEM STATUS</p>
          {debugInfo.length === 0 ? <p className="text-zinc-600 italic">Ready...</p> :
            debugInfo.map((msg, i) => (
              <p key={i} className="truncate mb-0.5">{msg}</p>
            ))
          }
        </div>
      </div>
    </div>
  );
};

interface DashboardViewProps {
  config: BusinessConfig;
  onNavigate: (view: string) => void;
  isDemoMode?: boolean;
}

const DashboardView: React.FC<DashboardViewProps> = ({ config, onNavigate, isDemoMode }) => {
  const currentPlan = config.subscription_plan || 'free';
  const minutesUsed = config.minutes_used || 0;
  const minutesLimit = config.minutes_limit || 10;

  return (
    <div className="space-y-8">
      {isDemoMode && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-200 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <p className="font-bold">You are in Demo Mode</p>
              <p className="text-sm opacity-80">Your settings will be lost if you refresh. Create an account to save them!</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()} // Quick way to go back to auth, or pass a handler
            className="bg-amber-500 text-black px-4 py-2 rounded-lg font-bold hover:bg-amber-400 transition text-sm"
          >
            Sign Up Now
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-semibold text-white tracking-tight">Welcome, {config.business_name}</h1>
          <p className="text-titanium mt-2 text-lg font-light">Your AI receptionist is active and ready.</p>
        </div>
        <div className="flex items-center gap-4">
          {currentPlan !== 'free' && (
            <div className="hidden md:flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-bold tracking-wide animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              PLAN ACTIVATED
            </div>
          )}
          <Badge color={currentPlan === 'free' ? 'blue' : 'purple'}>{currentPlan.toUpperCase()} PLAN</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 group hover:border-blue-500/30" onClick={() => onNavigate('chat-demo')}>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
            <MessageSquare className="w-7 h-7 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Chat Demo</h3>
          <p className="text-titanium text-sm leading-relaxed">Test your AI assistant in a text chat interface.</p>
        </Card>

        <Card className="p-6 group hover:border-emerald-500/30" onClick={() => onNavigate('phone-demo')}>
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
            <Phone className="w-7 h-7 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Voice Demo</h3>
          <p className="text-titanium text-sm leading-relaxed">Experience the ultra-low latency voice interface.</p>
        </Card>

        <Card className={`p-6 group hover:border-purple-500/30 ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isDemoMode && onNavigate('settings')}>
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-violet-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
              <Settings className="w-7 h-7 text-purple-400" />
            </div>
            {isDemoMode && <Lock className="w-5 h-5 text-zinc-600" />}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Settings</h3>
          <p className="text-titanium text-sm leading-relaxed">Configure your hours, tone, and services.</p>
        </Card>

        <Card className={`p-6 group hover:border-pink-500/30 ${isDemoMode ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={() => !isDemoMode && alert("Connect Twilio to go live!")}>
          <div className="flex justify-between items-start">
            <div className="w-14 h-14 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition duration-500">
              <PhoneOutgoing className="w-7 h-7 text-pink-400" />
            </div>
            {isDemoMode && <Lock className="w-5 h-5 text-zinc-600" />}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 tracking-tight">Connect Twilio</h3>
          <p className="text-titanium text-sm leading-relaxed">Link your phone number to start receiving calls.</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Usage Stats - Takes up 1 column */}
        <div className="md:col-span-1 space-y-6">
          <UsageCard used={minutesUsed} limit={minutesLimit} />
        </div>

        {/* Pricing Plans - Takes up 2 columns */}
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <PricingCard
              plan="starter"
              price="$29"
              mins={100}
              current={currentPlan === 'starter'}
              features={['Basic AI Voice', 'Email Support']}
              onClick={() => onNavigate('billing')}
            />
            <PricingCard
              plan="growth"
              price="$79"
              mins={500}
              current={currentPlan === 'growth'}
              features={['Advanced Voice', 'Priority Support', 'Custom Greeting']}
              onClick={() => onNavigate('billing')}
            />
            <PricingCard
              plan="pro"
              price="$149"
              mins={2000}
              current={currentPlan === 'pro'}
              features={['24/7 Phone Support', 'API Access', 'White Labeling']}
              onClick={() => onNavigate('billing')}
            />

          </div>
          <p className="text-xs text-slate-500 mt-4 text-center">
            Need more? <a href="#" className="underline hover:text-purple-400">Contact Sales</a> for Enterprise plans.
          </p>
        </div>
      </div>
    </div>
  );
};

interface TwilioStatus {
  connected: boolean;
  phoneNumber: string;
}

interface SettingsViewProps {
  config: BusinessConfig;
  onUpdate: () => void;
  isDemoMode?: boolean;
  onNavigate: (view: string) => void;
}

// Settings View
const SettingsView: React.FC<SettingsViewProps> = ({ config, onUpdate, isDemoMode, onNavigate }) => {
  const [twilioPhone, setTwilioPhone] = useState('');
  const [accountSid, setAccountSid] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [twilioStatus, setTwilioStatus] = useState<TwilioStatus | null>(null);

  useEffect(() => {
    if (!isDemoMode) {
      checkTwilioStatus();
    }
  }, [isDemoMode]);

  const checkTwilioStatus = async () => {
    try {
      const res = await authenticatedFetch(`${API_URL}/twilio/status`);
      const data: TwilioStatus = await res.json();
      setTwilioStatus(data);
      if (data.phoneNumber) setTwilioPhone(data.phoneNumber);
    } catch (err) {
      console.error('Failed to check Twilio status:', err);
    }
  };

  const handleSaveTwilio = async () => {
    setLoading(true);
    setMessage('');

    try {
      const res = await authenticatedFetch(`${API_URL}/twilio/connect`, {
        method: 'POST',
        body: JSON.stringify({
          phoneNumber: twilioPhone,
          accountSid,
          authToken
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ ' + (data.message || 'Twilio connected and configured successfully!'));
        checkTwilioStatus();
        if (onUpdate) onUpdate();
      } else {
        setMessage('❌ ' + (data.error || 'Failed to connect Twilio'));
      }
    } catch (err) {
      setMessage('❌ Error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (isDemoMode) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700 text-center">
          <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Settings are locked in Demo Mode</h2>
          <p className="text-slate-400 mb-6">Create an account to save your business configuration and connect a phone number.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold transition"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

      {/* Business Info */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-400" />
          Business Information
        </h2>
        <div className="space-y-3 text-slate-300">
          <div>
            <span className="text-slate-500">Business Name:</span>{' '}
            <span className="font-semibold">{config.business_name}</span>
          </div>
          <div>
            <span className="text-slate-500">Industry:</span> {config.industry}
          </div>
          <div>
            <span className="text-slate-500">Tone:</span> {config.tone}
          </div>
        </div>
      </Card>

      {/* Twilio Integration */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-400" />
          Twilio Auto-Configuration
        </h2>

        {twilioStatus?.connected ? (
          <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
            <p className="text-green-400 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Active Line: {twilioStatus.phoneNumber}
            </p>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-amber-400 font-semibold">⚠️ AI Receptionist not live. Connect your Twilio account below.</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="accountSid" className="block text-sm font-medium text-slate-300 mb-2">
                Account SID
              </label>
              <input
                id="accountSid"
                type="text"
                value={accountSid}
                onChange={(e) => setAccountSid(e.target.value)}
                placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label htmlFor="authToken" className="block text-sm font-medium text-slate-300 mb-2">
                Auth Token
              </label>
              <input
                id="authToken"
                type="password"
                value={authToken}
                onChange={(e) => setAuthToken(e.target.value)}
                placeholder="••••••••••••••••••••••••••••••••"
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="twilioPhone" className="block text-sm font-medium text-slate-300 mb-2">
              Assigned Phone Number
            </label>
            <input
              id="twilioPhone"
              type="tel"
              value={twilioPhone}
              onChange={(e) => setTwilioPhone(e.target.value)}
              placeholder="+1234567890"
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              The Twilio number you want our AI to manage.
            </p>
          </div>

          <button
            onClick={handleSaveTwilio}
            disabled={loading || !twilioPhone || !accountSid || !authToken}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 text-white py-3 px-4 rounded-lg font-bold transition flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                Configuring Webhooks...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Connect & Setup AI Receptionist
              </>
            )}
          </button>

          {message && (
            <div className={`p-4 rounded-lg text-sm ${message.includes('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {message}
            </div>
          )}

          <div className="mt-4 p-4 bg-slate-900/50 rounded-lg border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400" />
              How it works:
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              When you click "Connect", we securely use your credentials to automatically configure your Twilio number's voice settings to point to our AI server. You don't need to manually copy-paste any URLs!
            </p>
            <div className="flex gap-2 text-[10px]">
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-500">Auto-Webhook Setup</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-500">Secure Storage</span>
              <span className="px-2 py-0.5 bg-slate-800 rounded text-slate-500">Live instantly</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-8 text-center">
        <button
          onClick={() => onNavigate('admin')}
          className="text-slate-800 text-xs hover:text-slate-600 transition"
        >
          Admin Access
        </button>
      </div>
    </div >
  );
};

// --- Admin Component ---
const AdminView = ({ onNavigate }: { onNavigate: (view: string) => void }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [secret, setSecret] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin/payments`, {
        headers: { 'x-admin-secret': secret }
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data);
        setIsAuthenticated(true);
      } else {
        alert('Invalid Secret');
      }
    } catch (e) {
      console.error(e);
      alert('Connection Error');
    } finally {
      setLoading(false);
    }
  };

  const approvePayment = async (id: string) => {
    if (!confirm('Approve this payment?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': secret
        },
        body: JSON.stringify({ requestId: id })
      });
      if (res.ok) {
        alert('✅ Success! Plan activated for this user. \n\nRemember to send the manual confirmation email.');
        fetchPayments();
      } else {
        const errorData = await res.json().catch(() => ({}));
        alert(`❌ Error: ${errorData.error || 'Activation failed'}`);
      }
    } catch (e) {
      console.error(e);
      alert('Error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 px-4">
        <Card className="p-6 bg-slate-900 border-slate-800">
          <h2 className="text-xl font-bold text-white mb-4">Admin Access</h2>
          <input
            type="password"
            placeholder="Admin Secret"
            className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white mb-4"
            value={secret}
            onChange={e => setSecret(e.target.value)}
          />
          <button onClick={fetchPayments} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white p-2 rounded transition">
            {loading ? 'Verifying...' : 'Login'}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Payment Requests</h2>
        <button onClick={() => { setIsAuthenticated(false); onNavigate('dashboard'); }} className="text-slate-400 hover:text-white">Exit</button>
      </div>
      <div className="space-y-4">
        {payments.map((p: any) => (
          <Card key={p.id} className="p-4 bg-slate-900 border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-white font-bold flex items-center gap-2">
                {p.plan.toUpperCase()} <span className="text-slate-500">|</span> ${p.amount}
              </p>
              <p className="text-sm text-slate-400">Ref: {p.payment_reference}</p>
              <p className="text-xs text-slate-500 mt-1">{new Date(p.created_at).toLocaleString()} via {p.payment_method}</p>
            </div>
            <div className="flex gap-2">
              {p.status === 'pending' ? (
                <button onClick={() => approvePayment(p.id)} className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700 font-bold">
                  Approve
                </button>
              ) : (
                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${p.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {p.status === 'approved' ? 'Activated' : p.status}
                </span>
              )}
            </div>
          </Card>
        ))}
        {payments.length === 0 && <p className="text-slate-500 text-center py-10">No pending requests found.</p>}
      </div>
    </div>
  );
};

interface AppShellProps {
  children: React.ReactNode;
  onLogout: () => void;
  user: { email?: string } | null | undefined;
  onViewChange: (view: string) => void;
}

// App Shell
const AppShell: React.FC<AppShellProps> = ({ children, onLogout, user, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
        <h1 className="text-xl font-bold text-white">SmartReception</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:text-white">
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar - Desktop and Mobile Overlay */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 border-r border-slate-800 p-6 flex flex-col bg-slate-950 transform transition-transform duration-200 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-white">SmartReception</h1>
          <button className="md:hidden text-slate-400" onClick={() => setIsMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <button
            onClick={() => { onViewChange('dashboard'); setIsMenuOpen(false); }}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => { onViewChange('settings'); setIsMenuOpen(false); }}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={() => { onViewChange('billing'); setIsMenuOpen(false); }}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition"
          >
            <CreditCard className="w-4 h-4" />
            Billing
          </button>
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <p className="text-sm text-slate-500 truncate mb-4 px-3">{user?.email}</p>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-h-screen">
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </div>
        <Footer onNavigate={onViewChange} />
      </main>
    </div>
  );
};

// Main App
export default function App() {
  const [session, setSession] = useState<any>(null);
  const [config, setConfig] = useState<BusinessConfig | null>(null);
  const [view, setView] = useState('loading'); // loading, auth, onboarding, dashboard, chat-demo, phone-demo, settings
  const [isDemoMode, setIsDemoMode] = useState(false);
  // Handle URL Routing / Whop Integration
  useEffect(() => {
    const handleRouting = async () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      console.log(`[App] Routing check: ${path}`);

      // Check for simple demo mode query
      if (params.get('demo') === 'true') {
        handleTryDemo();
        return;
      }

      // Standard Static Routes for SEO
      if (path === '/resource-hub') { setView('resource-hub'); return; }
      if (path === '/about-us') { setView('about-us'); return; }
      if (path === '/contact-us') { setView('contact-us'); return; }
      if (path === '/privacy-policy') { setView('privacy-policy'); return; }
      if (path === '/terms-conditions') { setView('terms-conditions'); return; }
      if (path === '/service-ai-chat') { setView('service-ai-chat'); return; }
      if (path === '/service-ai-voice') { setView('service-ai-voice'); return; }
      if (path === '/service-automation') { setView('service-automation'); return; }
      if (path.startsWith('/resource-')) {
        const resourceId = path.replace('/resource-', '');
        const item = resources.find(r => r.id === resourceId);
        if (item) { setView(`resource-${resourceId}`); return; }
      }

      // Standard Root Path flow
      // ... (rest of search/logic)
      if (path.startsWith('/dashboard/') || path.startsWith('/experiences/')) {
        // existing logic...
      } else {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session);
          if (session) {
            setIsDemoMode(false);
            checkSetup(session);
          } else if (!isDemoMode && path === '/') {
            setView('auth');
          } else if (!isDemoMode && path !== '/') {
            // If we are on a custom route like /resource-hub but 
            // no session, let the custom route stay.
            // Loading state or handleRouting above handles it.
          }
        });
      }
    };

    handleRouting();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setIsDemoMode(false);
        checkSetup(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [isDemoMode]);

  const checkSetup = async (currentSession: any) => {
    console.log("[App] Checking setup status...");
    if (view !== 'loading') setView('loading');

    try {
      // If we have a session, use it. If not, use empty headers (Whop Proxy might fill them)
      const headers: Record<string, string> = {};
      if (currentSession?.access_token) {
        headers['Authorization'] = `Bearer ${currentSession.access_token}`;
      }

      // Check for Whop Token in URL params just in case (manual override)
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get('token');
      if (urlToken) {
        headers['x-whop-user-token'] = urlToken; // Pass it through if manually provided
      }

      const res = await fetch(`${API_URL}/status`, { headers }); // Use raw fetch to control headers manually here

      if (res.status === 401) {
        console.log("[App] Backend returned 401 - proceeding to auth/onboarding");

        // If we are on a deep link but failed auth, we might redirect to auth
        // OR if it's /experiences/..., maybe show demo?
        if (window.location.pathname.startsWith('/experiences/')) {
          console.log("Deep link failed auth -> forcing demo/onboarding");
          setConfig({} as BusinessConfig);
          setView('onboarding');
          return;
        }

        setConfig(null);
        setView('auth');
        return;
      }

      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      if (data.setupCompleted) {
        setConfig(data.config);

        // Route to correct view based on Path
        const path = window.location.pathname;
        if (path.startsWith('/experiences/')) {
          setView('chat-demo'); // Or phone-demo, depending on ID? Default to chat.
        } else {
          setView('dashboard');
        }
      } else {
        setConfig(data.config || {});
        setView('onboarding');
      }
    } catch (err: any) {
      console.error("[App] checkSetup Error:", err);
      // Fallback
      if (window.location.pathname.startsWith('/experiences/')) {
        handleTryDemo(); // Fallback to demo for experience links if fail
      } else {
        setConfig(null);
        setView('auth');
      }
    }
  };

  const handleLogout = async () => {
    if (isDemoMode) {
      setIsDemoMode(false);
      setConfig(null);
      setView('auth');
    } else {
      await supabase.auth.signOut();
      setConfig(null); // Clear config on logout
      setView('auth'); // Go to auth page
    }
  };

  const handleTryDemo = () => {
    setIsDemoMode(true);
    setConfig({} as BusinessConfig); // Empty config starts Onboarding flow
    setView('onboarding');
  };

  if (view === 'loading' && !isDemoMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-slate-400 animate-pulse">Connecting to server...</p>
        <p className="text-slate-600 text-xs mt-2 max-w-xs text-center">
          (Cold start may take up to 50s on free hosting)
        </p>
      </div>
    );
  }

  if (view === 'auth') return <Auth onAuthSuccess={() => { }} onTryDemo={handleTryDemo} onNavigate={setView} />;
  if (view === 'onboarding') return <Onboarding onComplete={(cfg: BusinessConfig) => { setConfig(cfg); setView('dashboard'); }} isDemoMode={isDemoMode} />;

  if (view === 'privacy-policy') return <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}><PrivacyPolicy /></AppShell>;
  if (view === 'terms-conditions') return <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}><TermsAndConditions /></AppShell>;
  if (view === 'about-us') return <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}><AboutUs /></AppShell>;
  if (view === 'contact-us') return <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}><ContactUs /></AppShell>;
  if (view === 'resource-hub') return <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}><ResourceHub onNavigate={setView} /></AppShell>;
  if (view.startsWith('resource-')) {
    const resource = resources.find(r => r.id === view.replace('resource-', ''));
    if (resource) return <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}><ResourceDetail item={resource} /></AppShell>;
  }

  // Validation
  if (!config && !isDemoMode && view !== 'loading') {
    setView('auth');
    return null;
  }

  return (
    <AppShell onLogout={handleLogout} user={isDemoMode ? { email: 'Demo User' } : session?.user} onViewChange={setView}>
      {view === 'dashboard' && <DashboardView config={config || {} as BusinessConfig} onNavigate={setView} isDemoMode={isDemoMode} />}
      {view === 'settings' && <SettingsView config={config || {} as BusinessConfig} onUpdate={() => session && checkSetup(session)} isDemoMode={isDemoMode} onNavigate={setView} />}
      {view === 'billing' && <BillingView business={config || {} as BusinessConfig} isDemoMode={isDemoMode} />}
      {view === 'admin' && <AdminView onNavigate={setView} />}
      {view === 'chat-demo' && <ChatDemoView config={config || {} as BusinessConfig} isDemoMode={isDemoMode} />}
      {view === 'phone-demo' && <VoiceDemoView config={config || {} as BusinessConfig} isDemoMode={isDemoMode} />}
      {view === 'service-ai-chat' && (
        <ServiceSilo
          title="AI Chat Receptionist"
          subtitle="24/7 Intelligent Text Engagement"
          content={
            <>
              <p>In the digital-first economy of 2026, your website's chat interface is often the very first touchpoint for potential clients. A "Coming Soon" banner or a slow, unresponsive bot is no longer acceptable. SmartReception.ai provides an industry-leading AI Chat Receptionist designed to convert visitors into loyal customers through instant, empathetic, and highly accurate engagement.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">The Value of Instant Qualification</h2>
              <p>Our AI Chat Receptionist doesn't just "take messages." It is a dynamic sales agent trained in your specific business logic. It qualifies leads in real-time by asking the right questions—budget, timeline, service requirements—ensuring that your human team only spends time with high-intent prospects. This "filtered" approach increases sales efficiency by an average of 45%.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Deep CRM & Calendar Integration</h2>
              <p>Unlike basic chatbots, our system is deeply integrated with the tools you already use. Salesforce, HubSpot, and Pipedrive are updated instantly with lead transcripts and priority scores. Furthermore, the AI can schedule consultations directly into your Google or Outlook calendar, capturing the "impulse" moment when a lead is most likely to commit.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">E-E-A-T Compliant Communication</h2>
              <p>We prioritize Experience, Expertise, Authoritativeness, and Trustworthiness in every interaction. The AI is configured to handle sensitive inquiries with professional stoicism, particularly in high-stakes fields like Law and Finance. It provides accurate, documentation-backed answers to FAQs, reducing the administrative burden on your support staff by up to 70%.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Multilingual Global Reach</h2>
              <p>Break language barriers instantly. Our AI Chat switches seamlessly between 30+ languages, providing a native-level experience for global users. This ensures that no matter where your visitors are coming from, they feel seen, heard, and valued by your brand.</p>

              <div className="bg-indigo-500/10 border border-indigo-500/20 p-8 rounded-3xl mt-12">
                <h3 className="text-xl font-bold text-white mb-4 italic">"The AI Chat Receptionist turned our static website into a 24/7 sales engine. We saw a 3x increase in qualified leads within the first month."</h3>
                <p className="text-indigo-300">— CEO, Premier Legal Associates</p>
              </div>
            </>
          }
        />
      )}
      {view === 'service-ai-voice' && (
        <ServiceSilo
          title="AI Voice Receptionist"
          subtitle="The Future of Professional Telephony"
          content={
            <>
              <p>Telephone communication remains the most personal and high-trust channel for business. However, maintaining a 24/7 human staff is prohibitively expensive for most organizations. SmartReception.ai bridges this gap with ultra-low latency Voice AI that sounds remarkably human, professional, and mature.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Sub-Second Latency for Natural Flow</h2>
              <p>The "robotic pause" is a thing of the past. Our Voice AI operates with sub-second response times, allowing for a fluid, natural conversation that builds rapport rather than frustration. Clients often forget they are speaking with an AI as they are guided through appointment settings or service inquiries.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Professional Persona Management</h2>
              <p>Choose the specific "Voice" of your brand. Whether you need the stoic, authoritative tone of a high-end wealth management firm or the warm, enthusiastic greeting of a boutique creative agency, our personas are fully customizable. We use advanced prosody modeling to ensure the AI's intonation reflects the empathy and expertise your clients expect.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Infinite Scalability</h2>
              <p>Never miss a call again. Our Voice AI can handle 1,000 simultaneous calls with zero degradation in quality. During marketing spikes or seasonal peaks, your service remains perfectly responsive. This eliminates the "voicemail death spiral" where 85% of callers who reach a machine simply hang up and call your competitor.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">HIPAA & GDPR Secure</h2>
              <p>Security is not an afterthought. Every voice interaction is encrypted end-to-end. For medical and financial clients, our system adheres to strict HIPAA and GDPR standards, ensuring that patient PII and client data are handled with the highest level of cryptographic integrity.</p>
            </>
          }
        />
      )}
      {view === 'service-automation' && (
        <ServiceSilo
          title="Business Automation"
          subtitle="Scale Effortlessly with AI Workforce"
          content={
            <>
              <p>Beyond simple greetings, SmartReception.ai offers full-scale business process automation. We integrate AI into the core of your administrative workflows, reclaiming up to 15 hours per week for business owners and senior partners.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Automated Appointment Management</h2>
              <p>The back-and-forth of scheduling is a major productivity drain. Our system handles the entire lifecycle: initial booking, HIPAA-compliant intake forms, 48-hour reminders, and instant rescheduling. This proactive approach reduces no-shows by an average of 40%.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Workflow Orchestration</h2>
              <p>Our AI doesn't just talk; it *acts*. Based on the conversation context, it can trigger Zapier workflows, update Shopify orders, or alert specific team members via Slack. It becomes the intelligent "nerve center" of your business operations.</p>

              <h2 className="text-2xl font-bold text-white mt-8 mb-4">Lead Nurture & Database Reactivation</h2>
              <p>Don't let cold leads die in your CRM. Our automation layer can perform proactive, professional follow-ups to reactivate dormant databases, turning "maybe later" into "book now." This ensures that every dollar you spend on marketing is fully leveraged for maximum ROI.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <Card className="p-6 border-indigo-500/20 bg-indigo-500/5">
                  <h4 className="text-white font-bold mb-2">Operational Efficiency</h4>
                  <p className="text-sm text-zinc-400">Reduce administrative overhead by 60% while increasing your response speed to sub-5 minutes.</p>
                </Card>
                <Card className="p-6 border-purple-500/20 bg-purple-500/5">
                  <h4 className="text-white font-bold mb-2">Revenue Capture</h4>
                  <p className="text-sm text-zinc-400">Never walk away from a lead. 24/7 availability ensures you capture high-intent inquiries while your competitors are asleep.</p>
                </Card>
              </div>
            </>
          }
        />
      )}
    </AppShell>
  );
}
