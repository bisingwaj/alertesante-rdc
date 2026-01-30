import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { TrendingUp, Users, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const OverviewPage = () => {
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        resolved: 0,
        today: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Get all tickets
            const { data: allTickets } = await supabase
                .from('tickets')
                .select('*');

            // Calculate stats
            const total = allTickets?.length || 0;
            const critical = allTickets?.filter(t => t.gravity === 'DANGER').length || 0;
            const resolved = allTickets?.filter(t => t.status === 'RESOLU').length || 0;

            const today = allTickets?.filter(t => {
                const ticketDate = new Date(t.createdAt);
                const todayDate = new Date();
                return ticketDate.toDateString() === todayDate.toDateString();
            }).length || 0;

            setStats({ total, critical, resolved, today });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Signalements',
            value: stats.total,
            icon: Users,
            color: 'blue',
            trend: `+${stats.today} aujourd'hui`,
        },
        {
            title: 'Signalements Critiques',
            value: stats.critical,
            icon: AlertTriangle,
            color: 'red',
            trend: 'Nécessitent attention immédiate',
        },
        {
            title: 'Signalements Résolus',
            value: stats.resolved,
            icon: CheckCircle,
            color: 'green',
            trend: `${stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% taux de résolution`,
        },
        {
            title: 'Tendance',
            value: `+${Math.round(((stats.today / (stats.total || 1)) * 100))}%`,
            icon: TrendingUp,
            color: 'purple',
            trend: 'vs moyenne journalière',
        },
    ];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-white/60">Chargement des statistiques...</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-white mb-2">Vue d'Ensemble</h2>
                <p className="text-white/60">Tableau de bord national - Alerte Santé RDC</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-slate-900/50 border border-${card.color}-500/20 rounded-2xl p-6`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 bg-${card.color}-500/20 rounded-xl flex items-center justify-center border border-${card.color}-500/30`}>
                                <card.icon size={24} className={`text-${card.color}-400`} />
                            </div>
                        </div>
                        <div>
                            <p className="text-white/60 text-sm font-semibold mb-1">{card.title}</p>
                            <p className={`text-4xl font-black text-${card.color}-400 mb-2`}>{card.value}</p>
                            <p className="text-white/40 text-xs">{card.trend}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Tendances (30 jours)</h3>
                    <div className="h-64 flex items-center justify-center text-white/40">
                        Graphique à venir...
                    </div>
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-white font-bold text-lg mb-4">Répartition par Type</h3>
                    <div className="h-64 flex items-center justify-center text-white/40">
                        Graphique à venir...
                    </div>
                </div>
            </div>
        </div>
    );
};
