import { Phone, MessageSquare, Sparkles, CheckCircle2, ArrowRight, Zap, Shield, Clock } from 'lucide-react';

interface LandingPageProps {
    onGetStarted: () => void;
    onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onTryDemo }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-deep-black via-deep-black to-zinc-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent opacity-50" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32 relative">
                    <div className="text-center space-y-8">
                        <div className="inline-block">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm font-semibold">
                                <Sparkles className="w-4 h-4" />
                                Powered by Kokoro-82M AI
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                            Your AI Receptionist,
                            <br />
                            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                                Always On Call
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-titanium max-w-3xl mx-auto leading-relaxed">
                            Never miss a lead again. SmartReception.ai handles calls, chats, and appointments 24/7 with natural, human-like AI that sounds remarkably professional.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                            <button
                                onClick={onGetStarted}
                                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                            >
                                Get Started Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={onTryDemo}
                                className="px-8 py-4 glass-panel-pro rounded-2xl text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10"
                            >
                                Try Live Demo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Why Businesses Choose Us
                    </h2>
                    <p className="text-xl text-titanium">
                        Professional AI that works while you sleep
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-panel-pro p-8 rounded-3xl hover:border-purple-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Phone className="w-7 h-7 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Ultra-Low Latency Voice</h3>
                        <p className="text-titanium leading-relaxed">
                            Sub-second response times with Kokoro-82M TTS. Your callers won't believe they're talking to AI.
                        </p>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl hover:border-indigo-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-7 h-7 text-indigo-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Intelligent Chat</h3>
                        <p className="text-titanium leading-relaxed">
                            Qualify leads, answer FAQs, and book appointments instantly through your website chat.
                        </p>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl hover:border-emerald-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Clock className="w-7 h-7 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">24/7 Availability</h3>
                        <p className="text-titanium leading-relaxed">
                            Capture leads at 3 AM or on holidays. Your AI receptionist never sleeps, never takes breaks.
                        </p>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl hover:border-amber-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Zap className="w-7 h-7 text-amber-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Instant Setup</h3>
                        <p className="text-titanium leading-relaxed">
                            Go live in minutes, not weeks. No complex integrations or technical expertise required.
                        </p>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl hover:border-pink-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Shield className="w-7 h-7 text-pink-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Enterprise Security</h3>
                        <p className="text-titanium leading-relaxed">
                            HIPAA & GDPR compliant. End-to-end encryption for all voice and text interactions.
                        </p>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl hover:border-cyan-500/30 transition-all duration-300 group">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-7 h-7 text-cyan-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Natural Conversations</h3>
                        <p className="text-titanium leading-relaxed">
                            Advanced prosody and emotion detection. Sounds like a real human, not a robot.
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <p className="text-xl text-titanium">
                        Start free, scale as you grow
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="glass-panel-pro p-8 rounded-3xl border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-white">$0</span>
                            <span className="text-titanium">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">100 AI interactions/month</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Chat & Voice support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Basic analytics</span>
                            </li>
                        </ul>
                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
                        >
                            Start Free
                        </button>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl border-purple-500/50 relative overflow-hidden">
                        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold">
                            POPULAR
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-white">$79</span>
                            <span className="text-titanium">/month</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">2,000 AI interactions/month</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Priority voice quality</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">CRM integrations</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Advanced analytics</span>
                            </li>
                        </ul>
                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                        >
                            Get Started
                        </button>
                    </div>

                    <div className="glass-panel-pro p-8 rounded-3xl border-white/10">
                        <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
                        <div className="mb-6">
                            <span className="text-5xl font-bold text-white">Custom</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Unlimited interactions</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Dedicated support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">Custom voice training</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                <span className="text-titanium">White-label options</span>
                            </li>
                        </ul>
                        <button
                            onClick={onGetStarted}
                            className="w-full py-3 rounded-xl border border-white/20 text-white font-semibold hover:bg-white/5 transition-all"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                    Ready to Transform Your Customer Service?
                </h2>
                <p className="text-xl text-titanium mb-8">
                    Join hundreds of businesses using AI to capture more leads and delight customers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
                    >
                        Start Free Trial
                    </button>
                    <button
                        onClick={onTryDemo}
                        className="px-8 py-4 glass-panel-pro rounded-2xl text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 border border-white/10"
                    >
                        Try Demo First
                    </button>
                </div>
            </div>
        </div>
    );
};
