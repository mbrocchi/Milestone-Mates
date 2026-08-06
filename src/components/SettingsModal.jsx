import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Settings, AlertTriangle } from 'lucide-react';

const API_URL = '/api';

export default function SettingsModal({ onClose, onReset }) {
  const [confirming, setConfirming] = useState(false);

  const handleReset = async () => {
    try {
      await fetch(`${API_URL}/reset`, { method: 'POST' });
      onReset();
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
          <h2 className="text-2xl font-black text-brand-teal drop-shadow-sm flex items-center gap-2" style={{ WebkitTextStroke: '0.5px #0EB2A1' }}>
            <Settings size={22} /> Settings
          </h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {!confirming ? (
            <div className="bg-red-50 border-2 border-red-100 rounded-2xl p-4 flex flex-col gap-3">
              <div>
                <h3 className="font-bold text-gray-800">Reset All Data</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Permanently clears all tasks, the shared goal, and the activity/cheers feed. Sarah and Dave's profiles are kept.
                </p>
              </div>
              <button
                onClick={() => setConfirming(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
              >
                Reset All Data
              </button>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex flex-col gap-4 items-center text-center">
              <AlertTriangle size={36} className="text-red-500" />
              <div>
                <h3 className="font-bold text-gray-800">Are you sure?</h3>
                <p className="text-sm text-gray-600 mt-1">
                  This will permanently delete all tasks, the shared goal progress, and activity history. This cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setConfirming(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all"
                >
                  Yes, Reset Everything
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
