// Fix: Provide full content for components/Exercises.tsx
import React, { useState, useEffect } from 'react';
import type { MeditationVideo } from '../types';
import { PlayCircleIcon, CloseIcon, SparklesIcon, EyeIcon, FrontHandIcon, VolumeUpIcon } from './icons';
import { positiveAffirmations } from '../services/dataService';

const BoxBreathing: React.FC = () => {
    const [step, setStep] = useState(0); // 0: Inhale, 1: Hold, 2: Exhale, 3: Hold
    const [text, setText] = useState('Get Ready...');

    useEffect(() => {
        const texts = ['Breathe In...', 'Hold', 'Breathe Out...', 'Hold'];
        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % 4);
        }, 4000);
        
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setText( ['Breathe In...', 'Hold', 'Breathe Out...', 'Hold'][step]);
    }, [step]);

    const animationClasses = [
        'scale-150', // inhale
        'scale-150', // hold
        'scale-100', // exhale
        'scale-100'  // hold
    ];

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50 flex flex-col items-center justify-center space-y-6 h-64">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Box Breathing</h3>
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div className={`absolute w-full h-full bg-lime-200 dark:bg-lime-800/50 rounded-lg transition-transform duration-[4000ms] ease-in-out ${animationClasses[step]}`}></div>
                <span className="relative text-lg font-medium text-lime-800 dark:text-lime-200 z-10">{text}</span>
            </div>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400">Follow the prompts to regulate your breathing. Each step is 4 seconds.</p>
        </div>
    );
};

const Affirmations: React.FC = () => {
    const [affirmation, setAffirmation] = useState('');

    const getNewAffirmation = React.useCallback(() => {
        const randomIndex = Math.floor(Math.random() * positiveAffirmations.length);
        setAffirmation(positiveAffirmations[randomIndex]);
    }, []);

    useEffect(() => {
        getNewAffirmation();
    }, [getNewAffirmation]);

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50 flex flex-col justify-between h-64">
             <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
                    <SparklesIcon className="w-5 h-5 mr-2 text-lime-500"/>
                    Positive Affirmation
                </h3>
                <p className="text-xl italic text-gray-700 dark:text-gray-300">"{affirmation}"</p>
            </div>
            <button onClick={getNewAffirmation} className="w-full mt-4 bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 transition-colors">
                New Affirmation
            </button>
        </div>
    )
}

const GroundingTechnique: React.FC = () => {
    const DURATION_MS = 8000;
    const steps = React.useMemo(() => [
        { number: 5, text: "Acknowledge FIVE things you see around you.", icon: <EyeIcon className="w-8 h-8 mx-auto text-slate-500" /> },
        { number: 4, text: "Acknowledge FOUR things you can touch.", icon: <FrontHandIcon className="w-8 h-8 mx-auto text-slate-500" /> },
        { number: 3, text: "Acknowledge THREE things you can hear.", icon: <VolumeUpIcon className="w-8 h-8 mx-auto text-slate-500" /> },
        { number: 2, text: "Acknowledge TWO things you can smell.", icon: <span className="text-3xl">👃</span> },
        { number: 1, text: "Acknowledge ONE thing you can taste.", icon: <span className="text-3xl">👅</span> }
    ], []);
    
    const [currentStep, setCurrentStep] = useState(-1);
    const [isComplete, setIsComplete] = useState(false);
    
    const start = () => {
        setIsComplete(false);
        setCurrentStep(0);
    };

    const reset = () => {
        setCurrentStep(-1);
        setIsComplete(false);
    };

    useEffect(() => {
        if (currentStep > -1 && currentStep < steps.length) {
            const timer = setTimeout(() => {
                if (currentStep === steps.length - 1) {
                    setIsComplete(true);
                } else {
                    setCurrentStep(s => s + 1);
                }
            }, DURATION_MS);
            return () => clearTimeout(timer);
        }
    }, [currentStep, steps.length]);

    const renderContent = () => {
        if (isComplete) {
            return (
                 <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Complete!</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-4">You've centered yourself in the present. Take a deep breath.</p>
                    <button onClick={reset} className="bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700">Go Again</button>
                </div>
            );
        }

        if (currentStep === -1) {
            return (
                <div className="text-center">
                    <h4 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Ready to ground yourself?</h4>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 mb-4">This exercise will walk you through your senses to help you find calm.</p>
                    <button onClick={start} className="bg-lime-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-lime-700">Begin</button>
                </div>
            );
        }

        const step = steps[currentStep];
        return (
            <div className="text-center">
                <div className="mb-4">{step.icon}</div>
                <p className="text-5xl font-bold text-lime-600 dark:text-lime-400 mb-2">{step.number}</p>
                <p className="text-lg text-gray-800 dark:text-gray-200">{step.text}</p>
                 <div key={currentStep} className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-6 overflow-hidden">
                    <div className="bg-lime-500 h-1.5 rounded-full" style={{ width: '100%', transition: `width ${DURATION_MS}ms linear`, transform: 'translateX(-100%)', animation: `progress ${DURATION_MS}ms linear forwards` }}></div>
                </div>
                 <style>{`@keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(0); } }`}</style>
            </div>
        )
    };

    return (
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-md p-6 border border-slate-200/50 dark:border-slate-700/50 min-h-[16rem] flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 absolute top-6 left-6">5-4-3-2-1 Grounding Technique</h3>
            {renderContent()}
        </div>
    );
};


const VideoModal: React.FC<{ video: MeditationVideo; onClose: () => void }> = ({ video, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
                <header className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{video.title}</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600">
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </header>
                <div className="aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={video.videoUrl}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

const Exercises: React.FC<{ videos: MeditationVideo[] }> = ({ videos }) => {
    const [selectedVideo, setSelectedVideo] = useState<MeditationVideo | null>(null);

    return (
        <>
            <div className="p-4 md:p-6 space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Wellness Exercises</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Guided tools to help you find calm and focus.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <BoxBreathing />
                    </div>
                    <div className="lg:col-span-1">
                        <Affirmations />
                    </div>
                </div>

                <GroundingTechnique />
                
                <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Meditation Videos</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map(video => (
                            <div key={video.id} onClick={() => setSelectedVideo(video)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group">
                                <div className="relative">
                                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-32 object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircleIcon className="w-12 h-12 text-white/80" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">{video.title}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{video.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {selectedVideo && <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
        </>
    );
};

export default Exercises;