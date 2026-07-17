import { useState } from 'react';
import { BrainCircuit, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AICoachOverlay() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'coach'; content: string }[]>([
    { role: 'coach', content: "Hi! I'm your Aura AI Coach. How can I help you analyze the market today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Mocking an AI response delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'coach', content: `That's a great question about ${userMessage}. Based on current market trends, you should consider diversifying your portfolio.` }
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden shadow-2xl border border-accent/30"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[var(--border)] bg-accent/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4 text-accent" />
                </div>
                <span className="font-semibold text-white">AI Coach</span>
              </div>
              <button 
                onClick={toggleOpen}
                className="p-1 hover:bg-white/10 rounded-full transition-colors text-[var(--secondary-foreground)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-white rounded-br-none' 
                        : 'bg-[var(--secondary)] border border-[var(--border)] text-[var(--foreground)] rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--secondary)] border border-[var(--border)] rounded-2xl rounded-bl-none px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-accent" />
                    <span className="text-xs text-[var(--secondary-foreground)]">AI is thinking...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-3 border-t border-[var(--border)] bg-black/20">
              <div className="flex items-center gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about trading strategies..."
                  className="flex-1 bg-[var(--secondary)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-1 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(217,70,239,0.4)] transition-colors ${
          isOpen ? 'bg-[var(--secondary)] border border-accent/50 text-accent' : 'bg-gradient-to-tr from-primary to-accent text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <BrainCircuit className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
