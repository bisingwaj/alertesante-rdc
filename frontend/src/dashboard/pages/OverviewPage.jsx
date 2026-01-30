import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { Users, AlertTriangle, CheckCircle, TrendingUp, MapPin, Clock } from 'lucide-react';
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
            // Get all tickets from last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: allTickets } = await supabase
                .from('tickets')
                .select('*')
                .gte('createdAt', thirtyDaysAgo.toISOString())
                .order('createdAt', { ascending: false })
                .limit(100);

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
            setRecentTickets(allTickets?.slice(0, 10) || []);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTimeSinceLabel = (timeSince) => {
        const labels = {
            'TODAY': "Aujourd'hui",
            'YESTERDAY': 'Hier',
            'THIS_WEEK': 'Cette semaine',
            'THIS_MONTH': 'Ce mois',
            'OLDER': 'Plus ancien',
        };
        return labels[timeSince] || timeSince;
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
            <div className="p-8 flex items-center justify-center min-h-screen bg-[#F8F9FA]">
                <div className="text-[#8F9BB3]">Chargement des statistiques...</div>
            </div>
        );
    }

    const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

    return (
        <div className="min-h-screen bg-[#F8F9FA] p-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[#8F9BB3] text-sm mb-1">Tableau de Bord</p>
                        <h1 className="text-3xl font-black text-[#2E3A59]">Vue d'Ensemble</h1>
                    </div>
                    <button className="bg-[#FF8A00] hover:bg-[#E67A00] text-white font-bold px-6 py-3 rounded-xl transition-colors flex items-center gap-2 shadow-lg">
                        + Nouveau Rapport
                    </button>
                </div>
            </div>

            {/* KPIs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Tickets Table - 2 cols */}
                <div className="lg:col-span-2">
                    <div className="card-premium">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-[#2E3A59]">Signalements Récents</h2>
                            <div className="flex gap-2">
                                <button className="text-[#6C5CE7] text-sm font-semibold hover:underline">
                                    Voir tout
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="table-premium">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Province</th>
                                        <th>Type</th>
                                        <th>Gravité</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentTickets.map((ticket, index) => (
                                        <motion.tr
                                            key={ticket.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <td className="font-mono text-sm font-semibold text-[#6C5CE7]">
                                                {ticket.shortId || `WEB-${index + 1}`}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-[#8F9BB3]" />
                                                    <span className="text-sm">{ticket.province || 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <Badge variant={getTypeColor(ticket.type)} size="sm">
                                                    {getTypeLabel(ticket.type)}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge variant={getGravityColor(ticket.gravity)} size="sm">
                                                    {ticket.gravity === 'DANGER' ? '🔴 Critique' : 'Normal'}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Badge variant={getStatusColor(ticket.status)} size="sm">
                                                    {ticket.status || 'NOUVEAU'}
                                                </Badge>
                                            </td>
                                            <td className="text-sm text-[#8F9BB3]">
                                                {formatTimestamp(ticket.createdAt)}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar Widgets - 1 col */}
                <div className="space-y-6">
                    {/* Distribution par Type */}
                    <div className="card-premium">
                        <h3 className="font-bold text-[#2E3A59] mb-4">Répartition par Type</h3>
                        <div className="space-y-3">
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#2E3A59]">Qualité soins</span>
                                    <span className="text-sm font-semibold text-[#6C5CE7]">42%</span>
                                </div>
                                <ProgressBar value={42} color="purple" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#2E3A59]">Médicaments</span>
                                    <span className="text-sm font-semibold text-[#0095FF]">28%</span>
                                </div>
                                <ProgressBar value={28} color="blue" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#2E3A59]">Hygiène</span>
                                    <span className="text-sm font-semibold text-[#FF8A00]">20%</span>
                                </div>
                                <ProgressBar value={20} color="orange" />
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm text-[#2E3A59]">Alertes</span>
                                    <span className="text-sm font-semibold text-[#FF3D71]">10%</span>
                                </div>
                                <ProgressBar value={10} color="red" />
                            </div>
                        </div>
                    </div>

                    {/* Timeline Alertes */}
                    <div className="card-premium">
                        <h3 className="font-bold text-[#2E3A59] mb-4">Dernières Alertes</h3>
                        <div className="space-y-4">
                            {recentTickets.filter(t => t.gravity === 'DANGER').slice(0, 5).map((ticket, index) => (
                                <div key={ticket.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-[#FFE5EC] rounded-full flex items-center justify-center shrink-0">
                                        <AlertTriangle size={16} className="text-[#FF3D71]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#2E3A59] truncate">
                                            {getTypeLabel(ticket.type)} - {ticket.province}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Clock size={12} className="text-[#C5CEE0]" />
                                            <span className="text-xs text-[#C5CEE0]">
                                                {formatTimestamp(ticket.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentTickets.filter(t => t.gravity === 'DANGER').length === 0 && (
                                <p className="text-sm text-[#C5CEE0] text-center py-4">
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
