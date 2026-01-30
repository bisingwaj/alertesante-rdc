import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) throw authError;

            // Success
            onLoginSuccess(data.user);
        } catch (err) {
            setError(err.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                        <Lock size={32} className="text-blue-400" />
                    </div>
                    <h1 className="text-3xl font-black text-white mb-2">Tableau de Bord</h1>
                    <p className="text-white/60 text-sm">Ministère de la Santé - RDC</p>
                </div>

                {/* Login Form */}
                <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-400 shrink-0 mt-0.5" />
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="text-white/80 text-sm font-semibold mb-2 block">
                                Adresse Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none transition-colors"
                                    placeholder="ministre@sante.cd"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="text-white/80 text-sm font-semibold mb-2 block">
                                Mot de Passe
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/30 focus:border-blue-500/50 focus:outline-none transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Connexion...
                                </>
                            ) : (
                                'Se Connecter'
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <p className="text-white/40 text-xs text-center mt-6">
                        Accès réservé aux administrateurs autorisés
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
