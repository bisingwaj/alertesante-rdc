import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { Search, Filter, Download } from 'lucide-react';
import { Badge } from '../components/Badge';

export const TicketsPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        fetchTickets();
    }, [filter]);

    const fetchTickets = async () => {
        try {
            let query = supabase
                .from('tickets')
                .select('*')
                .order('createdAt', { ascending: false })
                .limit(50);

            if (filter === 'CRITICAL') {
                query = query.eq('gravity', 'DANGER');
            } else if (filter === 'NOUVEAU') {
                query = query.eq('status', 'NOUVEAU');
            } else if (filter === 'RESOLU') {
                query = query.eq('status', 'RESOLU');
            }

            const { data } = await query;
            setTickets(data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'QUALITY': 'Qualité soins',
            'MEDS': 'Médicaments',
            'HYGIENE': 'Hygiène',
            'ALERT': 'Alerte',
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

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-12">
            {/* Header */}
            <div className="mb-12">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[#A0A0A0] text-sm mb-2">Tableau de Bord</p>
                        <h1 className="text-4xl font-bold text-[#1A1A1A]">Signalements</h1>
                    </div>
                    <button className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl border border-[#F0F0F0] text-[#404040] font-semibold hover:border-[#E0E0E0] transition-colors">
                        <Download size={18} />
                        Exporter CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-[#F0F0F0] mb-8">
                <div className="flex items-center gap-4">
                    <div className="flex-1 flex items-center gap-2 bg-[#FAFAFA] rounded-lg px-4 py-3">
                        <Search size={18} className="text-[#C0C0C0]" />
                        <input
                            type="text"
                            placeholder="Rechercher par ID, province, type..."
                            className="bg-transparent outline-none text-sm text-[#404040] placeholder-[#C0C0C0] flex-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setFilter('ALL')}
                            className={`px-5 py-3 rounded-lg font-semibold text-sm transition-colors ${filter === 'ALL'
                                    ? 'bg-[#6C5CE7] text-white'
                                    : 'bg-[#FAFAFA] text-[#808080] hover:bg-[#F0F0F0]'
                                }`}
                        >
                            Tous
                        </button>
                        <button
                            onClick={() => setFilter('NOUVEAU')}
                            className={`px-5 py-3 rounded-lg font-semibold text-sm transition-colors ${filter === 'NOUVEAU'
                                    ? 'bg-[#6C5CE7] text-white'
                                    : 'bg-[#FAFAFA] text-[#808080] hover:bg-[#F0F0F0]'
                                }`}
                        >
                            Nouveaux
                        </button>
                        <button
                            onClick={() => setFilter('CRITICAL')}
                            className={`px-5 py-3 rounded-lg font-semibold text-sm transition-colors ${filter === 'CRITICAL'
                                    ? 'bg-[#FF3D71] text-white'
                                    : 'bg-[#FAFAFA] text-[#808080] hover:bg-[#F0F0F0]'
                                }`}
                        >
                            Critiques
                        </button>
                        <button
                            onClick={() => setFilter('RESOLU')}
                            className={`px-5 py-3 rounded-lg font-semibold text-sm transition-colors ${filter === 'RESOLU'
                                    ? 'bg-[#00D68F] text-white'
                                    : 'bg-[#FAFAFA] text-[#808080] hover:bg-[#F0F0F0]'
                                }`}
                        >
                            Résolus
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                {loading ? (
                    <div className="py-12 text-center text-[#C0C0C0]">Chargement...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#F0F0F0]">
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">ID</th>
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Province</th>
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Type</th>
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Description</th>
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Gravité</th>
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Status</th>
                                    <th className="text-left py-4 px-4 text-[#A0A0A0] text-xs font-medium uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map((ticket) => (
                                    <tr key={ticket.id} className="border-b border-[#F8F8F8] hover:bg-[#FAFAFA]">
                                        <td className="py-5 px-4 font-mono text-sm font-semibold text-[#6C5CE7]">
                                            {ticket.shortId}
                                        </td>
                                        <td className="py-5 px-4 text-sm text-[#404040]">
                                            {ticket.province || 'N/A'}
                                        </td>
                                        <td className="py-5 px-4">
                                            <Badge variant={getTypeColor(ticket.type)} size="sm">
                                                {getTypeLabel(ticket.type)}
                                            </Badge>
                                        </td>
                                        <td className="py-5 px-4 text-sm text-[#808080] max-w-xs truncate">
                                            {ticket.description || 'Aucune description'}
                                        </td>
                                        <td className="py-5 px-4">
                                            <Badge variant={ticket.gravity === 'DANGER' ? 'red' : 'gray'} size="sm">
                                                {ticket.gravity === 'DANGER' ? 'Critique' : 'Normal'}
                                            </Badge>
                                        </td>
                                        <td className="py-5 px-4">
                                            <Badge variant={getStatusColor(ticket.status)} size="sm">
                                                {ticket.status || 'NOUVEAU'}
                                            </Badge>
                                        </td>
                                        <td className="py-5 px-4 text-sm text-[#A0A0A0]">
                                            {new Date(ticket.createdAt).toLocaleDateString('fr-FR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
