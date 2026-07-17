'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, BrainCircuit, ShieldAlert, Rocket, ChevronRight, CheckCircle } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';

const ONBOARDING_STEPS = [
  { id: 'welcome', title: 'Welcome to AuraTrade' },
  { id: 'experience', title: 'Investment Experience' },
  { id: 'goals', title: 'Financial Goals & Risk' },
  { id: 'assessment', title: 'AI Literacy Assessment' },
  { id: 'complete', title: 'Personalized Profile Ready' }
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const { completeOnboarding } = useUserStore();
  
  // State for onboarding form
  const [experience, setExperience] = useState<string | null>(null);
  const [goal, setGoal] = useState<string | null>(null);
  const [risk, setRisk] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  
  const handleNext = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(curr => curr + 1);
    } else {
      // Finish onboarding
      completeOnboarding({
        demographics: { experienceLevel: experience as any, language: 'en' },
        financialLiteracyScore: quizScore,
      });
      router.push('/');
    }
  };

  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 border border-primary/50 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <BrainCircuit className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Your AI-Powered Journey Begins</h2>
            <p className="text-gray-400 max-w-md">
              AuraTrade combines real-time market simulation with behavioral AI coaching to transform how you learn and invest.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-6 py-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">What is your investment experience?</h2>
              <p className="text-gray-400">This helps us tailor the AI coach to your level.</p>
            </div>
            <div className="grid gap-4">
              {['Beginner (No experience)', 'Intermediate (Some trading)', 'Advanced (Active trader)'].map((level, idx) => (
                <button
                  key={idx}
                  onClick={() => setExperience(level.split(' ')[0].toLowerCase())}
                  className={`p-5 rounded-xl border text-left transition-all ${experience === level.split(' ')[0].toLowerCase() ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-[var(--border)] bg-secondary/30 hover:border-gray-500'}`}
                >
                  <div className="font-semibold text-lg">{level}</div>
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 py-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Set Your Goals & Risk Profile</h2>
              <p className="text-gray-400">Define what you want to achieve.</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-300 flex items-center gap-2"><Target className="w-4 h-4 text-accent"/> Primary Goal</h3>
              <div className="grid grid-cols-2 gap-3">
                {['Wealth Preservation', 'Aggressive Growth', 'Passive Income', 'Learning'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${goal === g ? 'border-accent bg-accent/20' : 'border-[var(--border)] bg-secondary/30 hover:border-gray-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-gray-300 flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-warning"/> Risk Tolerance</h3>
              <div className="grid grid-cols-3 gap-3">
                {['Low', 'Medium', 'High'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRisk(r)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all text-center ${risk === r ? 'border-warning bg-warning/20' : 'border-[var(--border)] bg-secondary/30 hover:border-gray-500'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 py-6 text-center flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Financial Literacy Check</h2>
            <p className="text-gray-400 max-w-sm mb-6">Let's quickly gauge your baseline to build your personalized curriculum.</p>
            
            <div className="w-full glass-card p-6 rounded-2xl border border-[var(--border)] text-left mb-6">
              <p className="font-medium mb-4">Q: What is the primary benefit of portfolio diversification?</p>
              <div className="space-y-3">
                {[
                  {text: 'Maximizing short-term profits', correct: false},
                  {text: 'Reducing overall risk exposure', correct: true},
                  {text: 'Eliminating taxes on gains', correct: false}
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuizScore(q.correct ? 85 : 45)}
                    className="block w-full p-3 rounded-lg border border-[var(--border)] bg-secondary/20 hover:bg-secondary/60 text-left transition-colors"
                  >
                    {q.text}
                  </button>
                ))}
              </div>
            </div>
            
            {quizScore > 0 && (
              <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-success font-medium flex items-center gap-2">
                <CheckCircle className="w-5 h-5"/> Assessment Recorded
              </motion.div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col items-center justify-center text-center space-y-6 py-10">
            <div className="w-24 h-24 rounded-full bg-success/20 flex items-center justify-center mb-4 border border-success/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <Rocket className="w-12 h-12 text-success" />
            </div>
            <h2 className="text-3xl font-bold">Profile Generated</h2>
            <div className="glass p-6 rounded-2xl w-full max-w-sm space-y-3 text-left">
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-gray-400">Investor Persona:</span>
                <span className="font-semibold text-accent">{risk === 'High' ? 'Aggressive' : 'Calculated'} Explorer</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border)] pb-2">
                <span className="text-gray-400">Literacy Score:</span>
                <span className="font-semibold text-primary">{quizScore || 65}/100</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Curriculum:</span>
                <span className="font-semibold text-success">Personalized</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStepIndex === 1 && !experience) return true;
    if (currentStepIndex === 2 && (!goal || !risk)) return true;
    if (currentStepIndex === 3 && quizScore === 0) return true;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {ONBOARDING_STEPS.map((step, idx) => (
            <div 
              key={step.id}
              className={`text-xs font-medium ${idx <= currentStepIndex ? 'text-primary' : 'text-gray-600'}`}
            >
              Step {idx + 1}
            </div>
          ))}
        </div>
        <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / ONBOARDING_STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card rounded-2xl p-8 min-h-[450px] flex flex-col relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex-1 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 flex justify-end z-10 border-t border-[var(--border)] pt-6">
          <button
            disabled={isNextDisabled()}
            onClick={handleNext}
            className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${
              isNextDisabled() 
                ? 'bg-secondary text-gray-500 cursor-not-allowed' 
                : 'bg-primary text-white hover:bg-primary/90 shadow-[0_4px_14px_0_rgba(59,130,246,0.39)] hover:shadow-[0_6px_20px_rgba(59,130,246,0.23)] hover:-translate-y-0.5'
            }`}
          >
            {currentStepIndex === ONBOARDING_STEPS.length - 1 ? 'Go to Dashboard' : 'Continue'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
