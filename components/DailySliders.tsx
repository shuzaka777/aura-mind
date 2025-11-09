import React, { useState, useEffect } from 'react';
import type { MentalHealthDataPoint } from '../types';

interface DailySlidersProps {
    addHealthDataPoint: (newData: { mood: number, stress: number, energy: number, source: 'Check-in' }) => void;
    mentalHealthData: MentalHealthDataPoint[];
}

const DailySliders: React.FC<DailySlidersProps> = ({ addHealthDataPoint, mentalHealthData }) => {
    const [mood, setMood] = useState(5);
    const [stress, setStress] = useState(5);
    const [energy, setEnergy] = useState(5);
    const [submittedToday, setSubmittedToday] = useState(false);

    useEffect(() => {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const hasSubmitted = mentalHealthData.some(d => d.date === todayStr && d.source === 'Check-in');
        setSubmittedToday(hasSubmitted);
        if (hasSubmitted) {
            const todayData = mentalHealthData.find(d => d.date === todayStr && d.source === 'Check-in');
            if (todayData) {
                setMood(todayData.mood || 5);
                setStress(todayData.stress || 5);
                setEnergy(todayData.energy || 5);
            }
        }
    }, [mentalHealthData]);

    const handleSubmit = () => {
        addHealthDataPoint({ mood, stress, energy, source: 'Check-in' });
    };

    const getSliderColor = (value: number) => {
        if (value <= 3) return 'bg-red-500';
        if (value <= 7) return 'bg-yellow-500';
        return 'bg-lime-500';
    };

    const Slider = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => {
        const colorClass = getSliderColor(value);
        return (
            <div>
                <label className="flex justify-between items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    <span>{label}</span>
                    <span className={`font-bold text-lg ${label === 'Stress' ? (value > 7 ? 'text-red-500' : value > 3 ? 'text-yellow-500' : 'text-lime-500') : (value > 7 ? 'text-lime-500' : value > 3 ? 'text-yellow-500' : 'text-red-500')}`}>{value}</span>
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    style={{'--slider-color': getSliderColor(value) } as React.CSSProperties} // Custom property for thumb color
                />
            </div>
        );
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{submittedToday ? "Today's Check-in" : "How are you feeling now?"}</h3>
            <div className="space-y-4">
                <Slider label="Mood" value={mood} onChange={setMood} />
                <Slider label="Stress" value={stress} onChange={setStress} />
                <Slider label="Energy" value={energy} onChange={setEnergy} />
            </div>
            <button
                onClick={handleSubmit}
                className="w-full mt-6 bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors"
            >
                {submittedToday ? 'Update Check-in' : 'Save Check-in'}
            </button>
        </div>
    );
};

export default DailySliders;