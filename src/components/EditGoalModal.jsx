import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_URL = '/api';

export default function EditGoalModal({ activeGoal, onClose, onSave }) {
  const [title, setTitle] = useState(activeGoal?.title || '');
  const [target, setTarget] = useState(activeGoal?.target || 100);

  const presets = [
    { name: 'Family Holiday', icon: '✈️' },
    { name: 'New Car', icon: '🚗' },
    { name: 'House Deposit', icon: '🏡' },
    { name: 'Home Upgrade', icon: '🛋️' },
    { name: 'Date Night Fund', icon: '💕' },
    { name: "Couple's Retreat", icon: '🌱' },
    { name: 'Family Bonding Trip', icon: '🤝' },
    { name: 'Family Reunion', icon: '👨‍👩‍👧‍👦' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await fetch(`${API_URL}/goals/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, target })
      });
      
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#25C4B4', '#FF8800', '#FFC72C']
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
        className="bg-white w-full h-[90%] sm:h-auto sm:max-h-[90%] rounded-t-3xl sm:rounded-3xl p-6 flex flex-col shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-brand-teal drop-shadow-sm" style={{ WebkitTextStroke: '0.5px #0EB2A1' }}>
            Edit Shared Goal
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col gap-6 pb-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Preset Goal Ideas</label>
            <div className="flex flex-wrap gap-2">
              {presets.map(p => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setTitle(p.name)}
                  className="bg-gray-100 hover:bg-teal-50 border border-gray-200 hover:border-brand-teal text-gray-700 text-sm font-semibold py-2 px-3 rounded-full transition flex items-center gap-1"
                >
                  <span>{p.icon}</span> {p.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Goal Title</label>
            <input 
              type="text" 
              placeholder="e.g. Family Holiday"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-brand-teal transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Target Milestone Counter</label>
            <input 
              type="number" 
              placeholder="100"
              value={target}
              onChange={e => setTarget(e.target.value)}
              min="1"
              className="w-full bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:outline-none focus:border-brand-teal transition"
              required
            />
          </div>

          <div className="mt-auto pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-lg py-4 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 bg-brand-teal hover:bg-brand-teal-dark text-white font-bold text-lg py-4 rounded-xl shadow-[0_6px_0_#0EB2A1] active:shadow-[0_0px_0_#0EB2A1] active:translate-y-1.5 transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
