import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

//const API_URL = 'http://localhost:3001/api';
const API_URL = '/api';
export default function CreateTaskModal({ activeGoal, defaultAssignee = 'sarah', onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(defaultAssignee);
  const [category, setCategory] = useState('Home');
  const [contributionValue, setContributionValue] = useState(5);

  const categories = [
    { name: 'Fitness', icon: '🏋️‍♂️' },
    { name: 'Home', icon: '🔨' },
    { name: 'Family Shared Goal', icon: '🎯' },
    { name: 'Personal', icon: '💡' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const payload = { title, assignee, category };
      if (category === 'Family Shared Goal') {
        payload.contributionValue = contributionValue;
      }
      
      await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
            Create New Task
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col gap-6 pb-6">
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Task Title</label>
            <input 
              type="text" 
              placeholder="Enter Task Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-800 focus:outline-none focus:border-brand-teal transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Assignee</label>
            <div className="flex gap-4">
              <div 
                onClick={() => setAssignee('sarah')}
                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-4 cursor-pointer transition ${assignee === 'sarah' ? 'border-brand-teal bg-teal-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="text-4xl mb-1">👩🏽</div>
                <span className="font-bold text-sm">Sarah</span>
              </div>
              <div 
                onClick={() => setAssignee('dave')}
                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-4 cursor-pointer transition ${assignee === 'dave' ? 'border-brand-orange bg-orange-50' : 'border-gray-100 bg-white'}`}
              >
                <div className="text-4xl mb-1">👨🏾</div>
                <span className="font-bold text-sm">Dave</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Task Category</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map(cat => (
                <div 
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center p-2 rounded-xl border-2 cursor-pointer transition text-center ${category === cat.name ? 'border-brand-gold bg-yellow-50' : 'border-gray-100'}`}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-[10px] font-bold leading-tight">{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          {category === 'Family Shared Goal' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-orange-50 border border-orange-200 p-4 rounded-xl overflow-hidden"
            >
              <label className="block text-sm font-bold text-gray-700 mb-2">Goal Contribution Amount</label>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {[5, 10, 15, 25].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setContributionValue(val)}
                    className={`text-sm font-bold py-1.5 px-3 rounded-lg border-2 transition ${contributionValue === val ? 'bg-brand-orange text-white border-brand-orange-dark' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-orange'}`}
                  >
                    +{val}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <input 
                  type="number" 
                  value={contributionValue}
                  onChange={e => setContributionValue(parseInt(e.target.value) || 0)}
                  className="w-20 bg-white border-2 border-gray-200 rounded-lg px-2 py-1 font-bold text-gray-800 focus:outline-none focus:border-brand-orange"
                />
                <span className="text-sm font-semibold text-gray-600">points</span>
              </div>

              <p className="text-xs text-orange-800 mt-2 font-medium">
                ⭐ Completing this task will add <strong>{contributionValue}</strong> directly to <strong>{activeGoal?.title || 'the active goal'}</strong>!
              </p>
            </motion.div>
          )}

          <div className="mt-auto pt-4">
            <button 
              type="submit"
              className="w-full bg-brand-teal hover:bg-brand-teal-dark text-white font-bold text-lg py-4 rounded-xl shadow-[0_6px_0_#0EB2A1] active:shadow-[0_0px_0_#0EB2A1] active:translate-y-1.5 transition-all"
            >
              Save Task
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
