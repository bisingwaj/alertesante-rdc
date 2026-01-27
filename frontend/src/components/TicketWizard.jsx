import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImmersiveLayout } from './layout/ImmersiveLayout';
import { ProgressBar } from './ui/ProgressBar';

// Steps V4
import { StepHome, StepUrgent } from './steps/v3/StepHome'; // Reuse Home/Urgent
import { StepType } from './steps/v4/StepType';
import { StepTriage } from './steps/v4/StepTriage';
import { StepLocation } from './steps/v4/StepLocation';
import { StepMedia } from './steps/v4/StepMedia';
import { StepSpecifics } from './steps/v4/StepSpecifics';

import { StepRecap, StepSuccess } from './steps/v4/StepReview'; // UPDATED V4 IMPORT

const TicketWizard = () => {
    const [currentScreen, setCurrentScreen] = useState('HOME');
    const [data, setData] = useState({});
    const [lastTicketId, setLastTicketId] = useState(null); // Track Ticket ID

    const updateData = (newData) => setData(prev => ({ ...prev, ...newData }));

    const goNext = (newData, nextScreen) => {
        updateData(newData);
        setCurrentScreen(nextScreen);
    };

    const goBack = (prevScreen) => setCurrentScreen(prevScreen);

    // MAPPING ECRANS V4
    const SCREENS = {
        'HOME': <StepHome onStart={() => setCurrentScreen('TYPE')} onUrgent={() => setCurrentScreen('URGENT')} />,
        'URGENT': <StepUrgent onBack={() => setCurrentScreen('HOME')} />,

        // NOUVEAU FLOW V4
        'TYPE': <StepType onNext={(d) => goNext(d, 'TRIAGE')} onBack={() => goBack('HOME')} />,

        'TRIAGE': <StepTriage
            onNext={(d) => goNext(d, 'LOCATION')}
            onBack={() => goBack('TYPE')}
        />,

        'LOCATION': <StepLocation
            onNext={(d) => goNext(d, 'MEDIA')}
            onBack={() => goBack('TRIAGE')}
        />,

        'MEDIA': <StepMedia
            onNext={(d) => goNext(d, 'SPECIFICS')}
            onBack={() => goBack('LOCATION')}
        />,

        'SPECIFICS': <StepSpecifics
            branch={data.branch}
            onNext={(d) => goNext(d, 'RECAP')}
            onBack={() => goBack('MEDIA')}
        />,

        // FIN
        'RECAP': <StepRecap
            data={data}
            onNext={(id) => { setLastTicketId(id); setCurrentScreen('SUCCESS'); }}
            onBack={() => setCurrentScreen('SPECIFICS')}
        />,

        'SUCCESS': <StepSuccess ticketId={lastTicketId} onHome={() => { setData({}); setCurrentScreen('HOME'); }} />
    };

    const FLOW_ORDER = ['TYPE', 'TRIAGE', 'LOCATION', 'MEDIA', 'SPECIFICS', 'RECAP'];
    const stepIndex = FLOW_ORDER.indexOf(currentScreen);

    return (
        <ImmersiveLayout>
            {stepIndex >= 0 && <ProgressBar currentStep={stepIndex} totalSteps={FLOW_ORDER.length} />}

            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentScreen}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex-1 flex flex-col"
                >
                    {SCREENS[currentScreen]}
                </motion.div>
            </AnimatePresence>
        </ImmersiveLayout>
    );
};

export default TicketWizard;
