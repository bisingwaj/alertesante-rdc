
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("UI Error Caught:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="h-screen w-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-6">
                    <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 animate-pulse">
                        <AlertCircle size={40} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-white">Oups ! Une erreur est survenue.</h1>
                        <p className="text-white/50 mt-2">Désolé, l'application a rencontré un problème inattendu.</p>
                        {this.state.error && (
                            <div className="mt-4 p-4 bg-white/5 rounded text-xs text-white/30 font-mono text-left max-w-sm overflow-hidden whitespace-pre-wrap">
                                {this.state.error.toString()}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 hover:bg-neon-green transition-colors"
                    >
                        <RefreshCw size={20} />
                        Recharger l'application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
