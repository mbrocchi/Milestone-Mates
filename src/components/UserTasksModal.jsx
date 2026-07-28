import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Circle, Plus, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const API_URL = '/api';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Fitness': return '🏋️‍♂️';
    case 'Home': return '🔨';
    case 'Family Shared Goal': return '🎯';
    case 'Personal': return '💡';
    default: return '✅';
  }
};

export default function UserTasksModal({ user, activeGoal, tasks, onClose, onTaskToggle, onAddTask }) {
  const [toastMessage, setToastMessage] = useState(null);

  const userTasks = tasks.filter(t => t.assignee === user.id);
  const activeTasks = userTasks.filter(t => !t.completed);
  const completedTasks = userTasks.filter(t => t.completed);

  const handleToggle = async (task) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}/toggle`, { method: 'PATCH' });
      const updatedTask = await res.json();
      
      if (updatedTask.completed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        if (updatedTask.category === 'Family Shared Goal' && updatedTask.contributionValue) {
          setToastMessage(`+${updatedTask.contributionValue} Goal Progress!`);
          setTimeout(() => setToastMessage(null), 3000);
        }
      }
      
      onTaskToggle();
    } catch (err) {
      console.error(err);
    }
  };

  const isSarah = user.id === 'sarah';
  const themeColor = isSarah ? 'bg-brand-teal' : 'bg-brand-orange';
  const textColor = isSarah ? 'text-brand-teal' : 'text-brand-orange';
  const borderColor = isSarah ? 'border-brand-teal' : 'border-brand-orange';
  const lightBgColor = isSarah ? 'bg-teal-50' : 'bg-orange-50';
  
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
        className="bg-white w-full h-[95%] sm:h-auto sm:max-h-[90%] rounded-t-3xl sm:rounded-3xl flex flex-col shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className={`${themeColor} p-6 pb-8 relative shrink-0`}>
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/comic-bg.png')]"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-4 border-white shadow-md text-3xl relative">
                {isSarah ? '👩🏽' : '👨🏾'}
                <span className="absolute -bottom-2 -right-2 text-xl bg-white rounded-full p-1 shadow-sm border border-gray-100">
                  {isSarah ? '☀️' : '👷‍♂️'}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-black drop-shadow-sm leading-tight">{user.name}'s Tasks</h2>
                <p className="text-white/90 font-medium text-sm drop-shadow-sm">
                  {completedTasks.length} of {userTasks.length} tasks completed today
                </p>
              </div>
            </div>
            
            <button onClick={onClose} className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition backdrop-blur-sm">
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 pb-24 bg-gray-50 flex flex-col gap-6 -mt-4 rounded-t-2xl relative z-20">
          
          {/* Active Tasks */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${themeColor}`}></span> Active Tasks
            </h3>
            
            <div className="flex flex-col gap-3">
              {activeTasks.length > 0 ? (
                activeTasks.map(task => (
                  <div key={task.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-start gap-3 transition-all hover:border-gray-300">
                    <button 
                      onClick={() => handleToggle(task)}
                      className={`mt-1 shrink-0 ${textColor} hover:scale-110 transition`}
                    >
                      <Circle size={24} strokeWidth={2.5} />
                    </button>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-gray-800 leading-tight">{task.title}</p>
                        <span className="text-xl" title={task.category}>{getCategoryIcon(task.category)}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {task.category === 'Family Shared Goal' && (
                          <div className={`text-[10px] font-bold px-2 py-1 rounded-md ${lightBgColor} ${textColor} border ${borderColor} flex items-center gap-1`}>
                            🎯 +{task.contributionValue || 5} Goal Progress
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white border border-gray-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center text-gray-500">
                  <div className="text-4xl mb-2">🎉</div>
                  <p className="font-bold">All caught up!</p>
                  <p className="text-xs">No active tasks right now.</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-500 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span> Completed
              </h3>
              
              <div className="flex flex-col gap-3 opacity-60">
                {completedTasks.map(task => (
                  <div key={task.id} className="bg-gray-100 p-3 rounded-xl flex items-center gap-3">
                    <button 
                      onClick={() => handleToggle(task)}
                      className="shrink-0 text-gray-400 hover:text-gray-600 transition"
                    >
                      <CheckCircle2 size={20} strokeWidth={2.5} />
                    </button>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-600 line-through decoration-2 decoration-gray-300">{task.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Floating Add Task Button */}
        <div className="absolute bottom-6 left-0 right-0 px-6 z-30">
          <button 
            onClick={onAddTask}
            className={`w-full ${themeColor} text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-white/20`}
          >
            <Plus size={24} />
            Add Task for {user.name}
          </button>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-orange-dark font-black px-6 py-3 rounded-full shadow-xl z-50 border-4 border-white flex items-center gap-2"
            >
              <span>🎯</span> {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
