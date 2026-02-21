"use client";

import { useState, useEffect } from "react";
import { X, ChevronRight, MessageSquare, Edit3, Bell, TrendingUp, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    bg: string;
    glow: string;
}

const steps: Step[] = [
    {
        title: "Community Replies",
        description: "Engage deeper in discussions! You can now reply directly to any comment and follow the thread with ease.",
        icon: <MessageSquare className="w-8 h-8" />,
        color: "text-blue-600",
        bg: "bg-blue-50",
        glow: "from-blue-500/20 to-transparent"
    },
    {
        title: "Full Control",
        description: "Your voice, your rules. You can now edit and delete your own comments anytime to keep things accurate.",
        icon: <Edit3 className="w-8 h-8" />,
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        glow: "from-indigo-500/20 to-transparent"
    },
    {
        title: "Stay Connected",
        description: "Real-time updates delivered instantly. Be the first to know when someone votes or replies to your thoughts.",
        icon: <Bell className="w-8 h-8" />,
        color: "text-amber-600",
        bg: "bg-amber-50",
        glow: "from-amber-500/20 to-transparent"
    },
    {
        title: "Smart Sorting",
        description: "Discover the best content faster. Switch between 'Latest' and 'Top Voted' opinions with one tap.",
        icon: <TrendingUp className="w-8 h-8" />,
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        glow: "from-emerald-500/20 to-transparent"
    }
];

interface WhatIsNewModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function WhatIsNewModal({ isOpen, onClose }: WhatIsNewModalProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            setIsVisible(false);
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={cn(
            "fixed inset-0 z-[250] flex items-center justify-center p-4 transition-all duration-500",
            isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}>
            {/* Soft Backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className={cn(
                "relative w-full max-w-md bg-white/95 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform",
                isVisible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            )}>
                {/* Header Decoration */}
                <div className={cn(
                    "h-40 w-full transition-colors duration-700 flex items-center justify-center relative overflow-hidden",
                    steps[currentStep].bg
                )}>
                    {/* Animated shapes in background */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-30">
                        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/50 blur-2xl" />
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/50 blur-2xl" />
                    </div>

                    <div className={cn(
                        "relative z-10 p-4 rounded-2xl bg-white shadow-sm transition-transform duration-500 transform",
                        isVisible ? "scale-100" : "scale-0"
                    )}>
                        <div className={steps[currentStep].color}>
                            {steps[currentStep].icon}
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-black/5 transition-all z-20"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8 pb-10">
                    <div className="text-center mb-10">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary">New Features</span>
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                            {steps[currentStep].title}
                        </h2>

                        <p className="text-gray-500 leading-relaxed min-h-[4.5rem] animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {steps[currentStep].description}
                        </p>
                    </div>

                    {/* Progress & Controls */}
                    <div className="flex flex-col gap-6">
                        {/* Dots */}
                        <div className="flex gap-2 justify-center">
                            {steps.map((_, i) => (
                                <div
                                    key={i}
                                    className={cn(
                                        "h-1.5 transition-all duration-500 rounded-full",
                                        i === currentStep ? "w-8 bg-primary" : "w-2 bg-gray-200"
                                    )}
                                />
                            ))}
                        </div>

                        {/* Action Bar */}
                        <div className="flex items-center gap-3">
                            {currentStep < steps.length - 1 && (
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-3.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all active:scale-95"
                                >
                                    Skip
                                </button>
                            )}
                            <button
                                onClick={handleNext}
                                className={cn(
                                    "px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20",
                                    currentStep === steps.length - 1 ? "flex-1 bg-primary text-white" : "flex-1 bg-primary text-white"
                                )}
                            >
                                <span>{currentStep === steps.length - 1 ? "Start Exploring" : "Continue"}</span>
                                {currentStep === steps.length - 1 ? (
                                    <Check className="w-5 h-5" />
                                ) : (
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
