
import React from 'react';
import { GeoSelector } from '../../ui/GeoSelector';

export const StepLocation = ({ onNext }) => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
                <GeoSelector
                    onComplete={(sel) => onNext({
                        province: sel.province,
                        cityOrTerritory: sel.child,
                        healthZone: sel.zs
                    })}
                />
            </div>
        </div>
    );
};
