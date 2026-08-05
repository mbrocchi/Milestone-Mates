import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

//const API_URL = 'http://localhost:3001/api';
const API_URL = '/api';
export default function SendBackpatModal({ onClose, onSave }) {
  const [sender, setSender] = useState(() => {
    return localStorage.getItem('preferred_sender') || 'sarah';
  });
  const [type, setType] = useState('Great Effort!');
  const [message, setMessage] = useState('');

  const types = ['Great Effort!', 'Crushing It!', 'Miss You!', 'Streak Master!'];

  const handleSenderChange = (val) => {
    setSender(val);
    localStorage.setItem('preferred_sender', val);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const recipient = sender === 'sarah' ? 'dave' : 'sarah';
      await fetch(`${API_URL}/backpats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          from: sender, 
          to: recipient, 
          type, 
          message 
        })
      });
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#FFC72C', '#FF6B35', '#25C4B4']
      });

      onSave();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4"
    >
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#25C4B4] w-full h-[90%] sm:h-auto sm:max-h-[90%] rounded-t-3xl sm:rounded-3xl p-1 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/comic-bg.png')]"></div>
        
        <div className="bg-white/95 backdrop-blur-sm w-full h-full rounded-[20px] p-6 flex flex-col relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-black text-brand-orange drop-shadow-sm" style={{ WebkitTextStroke: '1px #C54A1E' }}>
              Send Cheers!
            </h2>
            <button onClick={onClose} className="p-2 bg-orange-100 rounded-full text-brand-orange hover:bg-orange-200 transition">
              <X size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Hero Illustration Placeholder */}
          <div className="flex justify-center mb-6 relative">
            <div className="w-32 h-32 bg-orange-100 rounded-full border-4 border-brand-orange flex items-center justify-center text-5xl shadow-inner relative">
              🎉
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-[-10px] border-[2px] border-dashed border-brand-gold rounded-full"
              ></motion.div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col gap-5 pb-2">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Who is sending this cheer?</label>
              <div className="flex gap-4 mb-2">
                <button
                  type="button"
                  onClick={() => handleSenderChange('sarah')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-4 font-bold transition ${sender === 'sarah' ? 'border-brand-teal bg-teal-50 text-brand-teal' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                >
                  <span className="text-2xl">👩🏽</span> Sarah (Home)
                </button>
                <button
                  type="button"
                  onClick={() => handleSenderChange('dave')}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-2xl border-4 font-bold transition ${sender === 'dave' ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-100 bg-gray-50 text-gray-500'}`}
                >
                  <span className="text-2xl">👨🏾</span> Dave (FIFO)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Backpat Type</label>
              <select 
                value={type}
                onChange={e => setType(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-brand-orange appearance-none"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Add a personal cheer!</label>
              <textarea 
                placeholder="Amazing job! Keep it up! 💪"
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-medium text-gray-800 focus:outline-none focus:border-brand-orange transition resize-none h-24"
                required
              />
            </div>

            <div className="mt-auto pt-4">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-brand-orange to-brand-gold hover:from-brand-orange-dark hover:to-orange-500 text-white font-black text-xl py-4 rounded-xl shadow-[0_6px_0_#C54A1E] active:shadow-[0_0px_0_#C54A1E] active:translate-y-1.5 transition-all flex items-center justify-center gap-2"
              >
                SEND THE CHEER! 👋
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
