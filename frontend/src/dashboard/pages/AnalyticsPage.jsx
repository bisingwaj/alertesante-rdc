import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { StatCard } from '../components/StatCard';

export const AnalyticsPage = () => {
    return (
        <div className="min-h-screen bg-[#FAFAFA] p-12">
            {/* Header */}
            <div className="mb-12">
                <p className="text-[#A0A0A0] text-sm mb-2">Tableau de Bord</p>
                <h1 className="text-4xl font-bold text-[#1A1A1A]">Analytics</h1>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                <StatCard
                    title="Signalements (30j)"
                    value="147"
                    trend="vs période précédente"
                    trendValue={23}
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="Utilisateurs Actifs"
                    value="89"
                    trend="utilisateurs uniques"
                    trendValue={15}
                    icon={Users}
                    color="green"
                />
                <StatCard
                    title="Temps Moyen Résolution"
                    value="4.2j"
                    trend="jours en moyenne"
                    trendValue={-12}
                    icon={Calendar}
                    color="orange"
                />
                <StatCard
                    title="Taux Engagement"
                    value="68%"
                    trend="des signalements suivis"
                    trendValue={8}
                    icon={BarChart3}
                    color="purple"
                />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Tendances des Signalements</h2>
                    <div className="h-80 flex items-center justify-center text-[#C0C0C0]">
                        Graphique en construction...
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Distribution par Province</h2>
                    <div className="h-80 flex items-center justify-center text-[#C0C0C0]">
                        Graphique en construction...
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Types de Signalements (Évolution)</h2>
                    <div className="h-80 flex items-center justify-center text-[#C0C0C0]">
                        Graphique en construction...
                    </div>
                </div>

                <div className="bg-white rounded-xl p-8 border border-[#F0F0F0]">
                    <h2 className="text-xl font-bold text-[#1A1A1A] mb-6">Temps de Résolution</h2>
                    <div className="h-80 flex items-center justify-center text-[#C0C0C0]">
                        Graphique en construction...
                    </div>
                </div>
            </div>
        </div>
    );
};
