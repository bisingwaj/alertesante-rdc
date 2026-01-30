import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, AlertTriangle, CheckCircle, TrendingUp, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';

export const OverviewPage = () => {
    const [stats, setStats] = useState({
        total: 0,
        critical: 0,
        resolved: 0,
        today: 0,
    });
    const [recentTickets, setRecentTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: allTickets } = await supabase
                .from('tickets')
                .select('*')
                .gte('createdAt', thirtyDaysAgo.toISOString())
                .order('createdAt', { ascending: false })
                .limit(100);

            const total = allTickets?.length || 0;
            const critical = allTickets?.filter(t => t.gravity === 'DANGER').length || 0;
            const resolved = allTickets?.filter(t => t.status === 'RESOLU').length || 0;

            const today = allTickets?.filter(t => {
                const ticketDate = new Date(t.createdAt);
                const todayDate = new Date();
                return ticketDate.toDateString() === todayDate.toDateString();
            }).length || 0;

            setStats({ total, critical, resolved, today });
            setRecentTickets(allTickets?.slice(0, 10) || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'QUALITY': 'Qualité soins',
            'MEDS': 'Médicaments',
            'HYGIENE': 'Hygiène',
            'ALERT': 'Alerte sanitaire',
        };
        return labels[type] || type;
    };

    const getTypeColor = (type) => {
        const colors = {
            'QUALITY': 'purple',
            'MEDS': 'blue',
            'HYGIENE': 'orange',
            'ALERT': 'red',
        };
        return colors[type] || 'gray';
    };

    const getStatusColor = (status) => {
        const colors = {
            'NOUVEAU': 'purple',
            'EN_COURS': 'orange',
            'RESOLU': 'green',
        };
        return colors[status] || 'gray';
    };

    const getGravityColor = (gravity) => {
        return gravity === 'DANGER' ? 'red' : 'gray';
    };

    const formatTimestamp = (createdAt) => {
        const date = new Date(createdAt);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `il y a ${diffMins}min`;
        if (diffHours < 24) return `il y a ${diffHours}h`;
        if (diffDays < 7) return `il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    };

    if (loading) {
        return (
            <div className="p-12 flex items-center justify-center min-h-screen bg-[#FAFAFA]">
                <div className="text-[#A0A0A0]">Chargement...</div>
            </div>
        );
    }

    const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-12">
            {/* Header */}
            <div className="mb-12">
                <p className="text-[#A0A0A0] text-sm mb-2">Tableau de Bord</p>
                <h1 className="text-4xl font-bold text-[#1A1A1A]">Vue d'Ensemble</h1>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatCard
                    title="Total Signalements"
                    value={stats.total}
                    trend="vs mois dernier"
                    trendValue={12}
                    icon={Users}
                    color="purple"
                />
                <StatCard
                    title="Signalements Critiques"
                    value={stats.critical}
                    trend="nécessitent attention"
                    trendValue={-5}
                    icon={AlertTriangle}
                    color="red"
                />
                <StatCard
                    title="Taux Résolution"
                    value={`${resolutionRate}%`}
                    trend="vs objectif 85%"
                    trendValue={resolutionRate - 85}
                    icon={CheckCircle}
                    color="green"
                />
                <StatCard
                    title="Aujourd'hui"
                    value={stats.today}
                    trend="signalements reçus"
                    trendValue={8}
                    icon={TrendingUp}
                    color="orange"
                />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Table */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-[#1A1A1A]">Signalements Récents</h2>
                            <button className="text-[#6C5CE7] text-sm font-semibold hover:underline">
                                Voir tout
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#F0F0F0]">
                                        <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">ID</th>
                                        <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Province</th>
                                        <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Type</th>
                                        <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Gravité</th>
                                        <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Status</th>
                                        <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTickets.map((ticket, index) => (
                                        <motion.tr
                                            key={ticket.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA]"
                                        >
                                            <td className="py-5 px-4 font-mono text-sm font-semibold text-[#6C5CE7]">
                                                {ticket.shortId || `WEB-${index + 1}`}
                                            </td>
                                            <td className="py-5 px-4">
                                                <div className="flex items-center gap-2 text-sm text-[#404040]">
                                                    <MapPin size={16} className="text-[#C0C0C0]" />
                                                    {ticket.province || 'Non spécifié'}
                                                </div>
                                            </td>
                                            <td className="py-5 px-4">
                                                <Badge variant={getTypeColor(ticket.type)} size="sm">
                                                    {getTypeLabel(ticket.type)}
                                                </Badge>
                                            </td>
                                            <td className="py-5 px-4">
                                                <Badge variant={getGravityColor(ticket.gravity)} size="sm">
                                                    {ticket.gravity === 'DANGER' ? 'Critique' : 'Normal'}
                                                </Badge>
                                            </td>
                                            <td className="py-5 px-4">
                                                <Badge variant={getStatusColor(ticket.status)} size="sm">
                                                    {ticket.status || 'NOUVEAU'}
                                                </Badge>
                                            </td>
                                            <td className="py-5 px-4 text-sm text-[#A0A0A0]">
                                                {formatTimestamp(ticket.createdAt)}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Distribution */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <h3 className="font-bold text-[#1A1A1A] mb-6">Répartition par Type</h3>
                        <div className="space-y-5">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#404040]">Qualité soins</span>
                                    <span className="text-sm font-semibold text-[#6C5CE7]">42%</span>
                                </div>
                                <ProgressBar value={42} color="purple" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#404040]">Médicaments</span>
                                    <span className="text-sm font-semibold text-[#0095FF]">28%</span>
                                </div>
                                <ProgressBar value={28} color="blue" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#404040]">Hygiène</span>
                                    <span className="text-sm font-semibold text-[#FF8A00]">20%</span>
                                </div>
                                <ProgressBar value={20} color="orange" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[#404040]">Alertes</span>
                                    <span className="text-sm font-semibold text-[#FF3D71]">10%</span>
                                </div>
                                <ProgressBar value={10} color="red" />
                            </div>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                        <h3 className="font-bold text-[#1A1A1A] mb-6">Dernières Alertes</h3>
                        <div className="space-y-5">
                            {recentTickets.filter(t => t.gravity === 'DANGER').slice(0, 5).map((ticket) => (
                                <div key={ticket.id} className="text-sm">
                                    <p className="font-medium text-[#404040] mb-1">
                                        Aucune alerte critique récente
                                    </p>
                                    <p className="text-xs text-[#C0C0C0]">
                                        {formatTimestamp(ticket.createdAt)}
                                    </p>
                                </div>
                            ))}
                            {recentTickets.filter(t => t.gravity === 'DANGER').length === 0 && (
                                <p className="text-sm text-[#C0C0C0] text-center py-6">
                                    Aucune alerte critique récente
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
