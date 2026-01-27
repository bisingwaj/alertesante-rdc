
import React, { useState } from 'react';
import { ArrowLeft, Camera, Mic, Loader2, CheckCircle2, Paperclip, Play, Trash2 } from 'lucide-react';
import { supabase } from '../../../supabaseClient';
import { AudioRecorder } from '../../ui/AudioRecorder';
import { MiniAudioPlayer } from '../../ui/MiniAudioPlayer';

export const StepMedia = ({ onNext, onBack }) => {
    const [desc, setDesc] = useState('');
    const [uploading, setUploading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [showRecorder, setShowRecorder] = useState(false);

    const handleUpload = async (file, type) => {
        setUploading(true);

        let ext = 'jpg';
        if (type === 'audio') {
            if (file.type.includes('mp4')) ext = 'mp4';
            else if (file.type.includes('ogg')) ext = 'ogg';
            else ext = 'webm';
        }

        const path = `${type}s/${Date.now()}-${Math.random().toString(36).substr(7)}.${ext}`;
        try {
            const { error } = await supabase.storage.from('evidence').upload(path, file);
            if (error) throw error;
            const { data } = supabase.storage.from('evidence').getPublicUrl(path);
            if (type === 'audio') setAudioUrl(data.publicUrl);
            else setPhotoUrl(data.publicUrl);
        } catch (e) {
            console.error(e);
            alert("Erreur upload: " + e.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {showRecorder && <AudioRecorder onRecordingComplete={(blob) => { setShowRecorder(false); handleUpload(blob, 'audio'); }} onCancel={() => setShowRecorder(false)} />}

            <div className="flex flex-col h-full pt-8 px-6">
                <button onClick={onBack} className="mb-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white"><ArrowLeft size={24} /></button>
                <h2 className="text-2xl font-bold mb-2">Preuves & Contexte</h2>
                <p className="text-white/60 mb-6">Expliquez ce qui s'est passé.</p>

                <textarea
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="Décrivez la situation en quelques mots..."
                    className="w-full h-32 bg-dark-800 rounded-xl p-4 text-white border border-white/10 focus:border-neon-yellow outline-none mb-6 resize-none"
                />

                <div className="space-y-3 mb-6">
                    {/* AUDIO */}
                    {audioUrl ? <MiniAudioPlayer src={audioUrl} onDelete={() => setAudioUrl(null)} /> :
                        <button onClick={() => setShowRecorder(true)} className="w-full p-4 bg-dark-800 rounded-xl flex items-center gap-4 border border-white/10 hover:border-neon-yellow/40">
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center"><Mic size={20} className="text-neon-yellow" /></div>
                            <span className="text-white font-medium">Ajouter un vocal</span>
                        </button>
                    }

                    {/* PHOTO/FILE */}
                    <div className="relative">
                        <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0], 'photo')} className="absolute inset-0 z-10 opacity-0 w-full h-full cursor-pointer" disabled={uploading} />

                        {photoUrl ? (
                            <div className="w-full p-2 bg-dark-800 rounded-xl flex items-center gap-4 border border-neon-green/50">
                                <img src={photoUrl} className="w-12 h-12 rounded-lg object-cover" />
                                <div className="flex-1"><span className="text-neon-green font-bold text-sm">Photo ajoutée</span></div>
                                <div onClick={(e) => { e.preventDefault(); setPhotoUrl(null) }} className="z-20 p-2"><Trash2 size={20} className="text-white/40 hover:text-red-500" /></div>
                            </div>
                        ) : (
                            <button className="w-full p-4 bg-dark-800 rounded-xl flex items-center gap-4 border border-white/10 hover:border-neon-yellow/40">
                                <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                                    {uploading ? <Loader2 size={20} className="animate-spin text-white" /> : <Camera size={20} className="text-neon-yellow" />}
                                </div>
                                <span className="text-white font-medium">{uploading ? 'Envoi...' : 'Ajouter une photo'}</span>
                            </button>
                        )}
                    </div>
                </div>

                <button
                    onClick={() => onNext({ description: desc, photoUrl, audioUrl })}
                    disabled={!desc && !photoUrl && !audioUrl}
                    className="w-full py-4 bg-neon-yellow text-black font-bold rounded-xl mt-auto mb-8 disabled:opacity-50 disabled:bg-white/10 disabled:text-white/30 transition-all"
                >
                    {(!desc && !photoUrl && !audioUrl) ? 'Ajoutez une info pour continuer' : 'Continuer'}
                </button>
            </div>
        </>
    );
};
