
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImmersiveLayout } from './layout/ImmersiveLayout';
import { ProgressBar } from './ui/ProgressBar';

// Steps
import { StepHome, StepUrgent } from './steps/v3/StepHome';
import { StepType } from './steps/v3/StepType';
import { StepGeo } from './steps/v3/StepGeo';
import { StepStructure } from './steps/v3/StepStructure';
import { StepCategory } from './steps/v3/StepCategory';
import { StepDetails } from './steps/v3/StepDetails';
import { StepTime } from './steps/v3/StepTime';
import { StepGravity } from './steps/v3/StepGravity';
import { StepContact } from './steps/v3/StepDetails'; // StepContact est resté dans StepDetails pour l'instant
import { StepRecap, StepSuccess } from './steps/v3/StepReview';

const TicketWizard = () => {
    const [currentScreen, setCurrentScreen] = useState('HOME');
    const [data, setData] = useState({});

    const updateData = (newData) => setData(prev => ({ ...prev, ...newData }));

    const goNext = (newData, nextScreen) => {
        updateData(newData);
        setCurrentScreen(nextScreen);
    };

    const goBack = (prevScreen) => setCurrentScreen(prevScreen);

    // MAPPING ECRANS
    const SCREENS = {
        'HOME': <StepHome onStart={() => setCurrentScreen('TYPE')} onUrgent={() => setCurrentScreen('URGENT')} />,
        'URGENT': <StepUrgent onBack={() => setCurrentScreen('HOME')} />,

        // FLOW
        'TYPE': <StepType onNext={(d) => goNext(d, 'GEO')} />,
        'GEO': <StepGeo onNext={(d) => goNext(d, 'STRUCTURE')} />,
        'STRUCTURE': <StepStructure onNext={(d) => goNext(d, 'CATEGORY')} />,
        'CATEGORY': <StepCategory onNext={(d) => goNext(d, 'DETAILS')} />,
        'DETAILS': <StepDetails onNext={(d) => goNext(d, 'TIME')} />,
        'TIME': <StepTime onNext={(d) => goNext(d, 'GRAVITY')} />,
        'GRAVITY': <StepGravity onNext={(d) => goNext(d, 'CONTACT')} />,
        'CONTACT': <StepContact onNext={(d) => goNext(d, 'RECAP')} />,

        // END
        'RECAP': <StepRecap data={data} onNext={() => setCurrentScreen('SUCCESS')} onBack={() => setCurrentScreen('CONTACT')} />,
        'SUCCESS': <StepSuccess onHome={() => { setData({}); setCurrentScreen('HOME'); }} />
    };

    // Calcul étape pour ProgressBar (Home/Urgent/Success = 0 ou Hidden)
    const FLOW_ORDER = ['TYPE', 'GEO', 'STRUCTURE', 'CATEGORY', 'DETAILS', 'TIME', 'GRAVITY', 'CONTACT', 'RECAP'];
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
