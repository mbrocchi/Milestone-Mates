import React, { useState, useEffect } from 'react';
import { Plus, Gift, CheckCircle2, Circle, Star, ThumbsUp, Rocket, Pencil } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import CreateTaskModal from './CreateTaskModal';
import SendBackpatModal from './SendBackpatModal';
import EditGoalModal from './EditGoalModal';
import UserTasksModal from './UserTasksModal';

//const API_URL = 'http://localhost:3001/api';
const API_URL = '/api';
export default function DashboardScreen() {
  const [data, setData] = useState({ users: null, goals: [], tasks: [], backpats: [] });
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalAssignee, setTaskModalAssignee] = useState('sarah');
  const [showBackpatModal, setShowBackpatModal] = useState(false);
  const [showEditGoalModal, setShowEditGoalModal] = useState(false);
  const [selectedUserTasks, setSelectedUserTasks] = useState(null); // 'sarah' or 'dave'

  const fetchData = async () => {
    try {
      const res = await fetch(`${API_URL}/dashboard`);
      const json = await res.json();
      setData(prevData => {
        // Optimize: Update only if data has changed to prevent unnecessary re-renders
        if (JSON.stringify(prevData) === JSON.stringify(json)) {
          return prevData;
        }
        return json;
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Auto-polling for real-time updates every 3 seconds
    const interval = setInterval(fetchData, 3000);
    
    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  const openUserTasks = (userId) => {
    setSelectedUserTasks(userId);
  };

  if (loading) return <div className="flex-1 flex items-center justify-center text-white font-bold text-xl">Loading Mates...</div>;

  const { users, goals, tasks, backpats } = data;
  const activeGoal = goals[0] || { title: "Set a goal!", progress: 0, target: 100 };
  const percent = Math.round((activeGoal.progress / activeGoal.target) * 100) || 0;

  const sarahTasks = tasks.filter(t => t.assignee === 'sarah' && !t.completed);
  const daveTasks = tasks.filter(t => t.assignee === 'dave' && !t.completed);

  return (
    <div className="flex-1 flex flex-col relative bg-[#0EB2A1] h-full overflow-hidden">
      {/* Header Banner */}
      <div className="pt-8 pb-4 px-4 text-center relative overflow-hidden shrink-0 flex flex-col items-center">
        <img src="/logo.png" alt="Milestone Mates Logo" className="w-16 h-auto drop-shadow-md mb-2 z-10 relative" />
        <h1 className="text-3xl font-black text-white drop-shadow-md tracking-wide z-10 relative" style={{ WebkitTextStroke: '1px #FF8800' }}>
          MILESTONEMATES
        </h1>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/comic-bg.png')]"></div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 bg-white rounded-t-3xl p-5 shadow-[0_-10px_20px_rgba(0,0,0,0.1)] flex flex-col gap-6 overflow-y-auto pb-28 relative">
        
        {/* Goal Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-2 border-gray-100 relative">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 font-semibold mb-1">Shared Goal:</p>
              <h2 className="text-xl font-bold text-gray-800 mb-3">{activeGoal.title}</h2>
            </div>
            <button 
              onClick={() => setShowEditGoalModal(true)}
              className="text-gray-400 hover:text-brand-teal p-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <Pencil size={18} />
            </button>
          </div>
          
          <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden relative border border-gray-300">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className="h-full bg-brand-gold relative"
            >
              <div className="absolute inset-0 bg-white/20 w-full" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px)' }}></div>
            </motion.div>
            <span className="absolute right-2 top-0 bottom-0 flex items-center text-xs font-bold text-gray-700">{percent}%</span>
          </div>
        </div>

        {/* Partners Side by Side */}
        <div className="flex gap-4">
          {/* Sarah */}
          <div 
            onClick={() => openUserTasks('sarah')}
            className="flex-1 bg-teal-50 rounded-2xl p-3 border-2 border-brand-teal cursor-pointer hover:bg-teal-100 hover:shadow-md transition relative flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-brand-teal mb-2 shadow-sm text-3xl">
              👩🏽
              <span className="absolute -top-2 -right-2 text-2xl">☀️</span>
            </div>
            <h3 className="font-bold text-gray-800 leading-tight">BACK HOME</h3>
            <p className="text-xs text-gray-500 mb-2">(Sarah)</p>
            <div className="w-full mt-auto">
              <div className="bg-white p-2 rounded-lg border border-teal-200 flex items-center justify-between shadow-sm">
                <span className="text-xs font-bold text-brand-teal">
                  📋 {sarahTasks.length} Active Tasks
                </span>
                <Plus size={16} className="text-brand-teal" />
              </div>
            </div>
          </div>

          {/* Dave */}
          <div 
            onClick={() => openUserTasks('dave')}
            className="flex-1 bg-orange-50 rounded-2xl p-3 border-2 border-brand-orange cursor-pointer hover:bg-orange-100 hover:shadow-md transition relative flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border-2 border-brand-orange mb-2 shadow-sm text-3xl">
              👨🏾
              <span className="absolute -top-2 -right-2 text-2xl">👷‍♂️</span>
            </div>
            <h3 className="font-bold text-gray-800 leading-tight">FIFO CAMP</h3>
            <p className="text-xs text-gray-500 mb-2">(Dave)</p>
            <div className="w-full mt-auto">
              <div className="bg-white p-2 rounded-lg border border-orange-200 flex items-center justify-between shadow-sm">
                <span className="text-xs font-bold text-brand-orange">
                  📋 {daveTasks.length} Active Tasks
                </span>
                <Plus size={16} className="text-brand-orange" />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 flex flex-col min-h-[150px]">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h3 className="font-bold text-gray-700">Recent Cheers & Activity</h3>
            <button onClick={() => { setTaskModalAssignee('sarah'); setShowTaskModal(true); }} className="text-brand-teal bg-teal-50 p-1.5 rounded-full hover:bg-teal-100 transition">
              <Plus size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto max-h-52 pr-1 flex flex-col gap-3">
            {backpats.map(bp => {
              const fromLower = (bp.from || '').toLowerCase();
              const isSarah = fromLower === 'sarah';
              const isDave = fromLower === 'dave';
              const isSystem = fromLower === 'system';
              
              const borderClass = isSarah 
                ? 'border-brand-teal bg-teal-50/50' 
                : isDave 
                ? 'border-brand-orange bg-orange-50/50' 
                : 'border-gray-200 bg-gray-50';
                
              const avatar = isSarah ? '👩🏽' : isDave ? '👨🏾' : '🤖';
              const roleIcon = isSarah ? '☀️' : isDave ? '👷‍♂️' : null;

              return (
                <div key={bp.id} className={`flex gap-3 items-start p-3 rounded-xl border-2 transition ${borderClass}`}>
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm text-xl">
                      {avatar}
                    </div>
                    {roleIcon && (
                      <span className="absolute -top-1 -right-1 text-xs bg-white rounded-full p-0.5 shadow-sm border border-gray-100">
                        {roleIcon}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-gray-800">
                        {isSystem ? (
                          <span className="text-gray-500 font-extrabold uppercase tracking-wide">{bp.type}</span>
                        ) : (
                          <span>
                            <span className="capitalize">{bp.from}</span> sent a {bp.type === 'Task Created' || bp.type === 'Task Completed' ? 'update' : 'cheer'}
                          </span>
                        )}
                      </p>
                      <span className="text-lg">
                        {bp.type === 'Streak' ? '🚀' : bp.type === 'Task Completed' ? '✅' : bp.type === 'Task Created' ? '📋' : bp.type === 'Goal Update' ? '🎯' : '👍'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1 font-medium bg-white/80 py-1.5 px-2 rounded-lg border border-gray-100 inline-block leading-tight">
                      {bp.message}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white/80 backdrop-blur-md border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-20">
        <button 
          onClick={() => setShowBackpatModal(true)}
          className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold text-lg py-4 rounded-full shadow-[0_8px_0_#C54A1E,0_15px_20px_rgba(255,107,53,0.4)] active:shadow-[0_0px_0_#C54A1E] active:translate-y-2 transition-all flex items-center justify-center gap-2"
        >
          <Gift size={24} />
          Celebrate / Send Cheer
        </button>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedUserTasks && users && (
          <UserTasksModal
            user={users[selectedUserTasks]}
            activeGoal={activeGoal}
            tasks={tasks}
            onClose={() => setSelectedUserTasks(null)}
            onTaskToggle={fetchData}
            onAddTask={() => {
              setTaskModalAssignee(selectedUserTasks);
              setSelectedUserTasks(null);
              setShowTaskModal(true);
            }}
          />
        )}
        {showEditGoalModal && (
          <EditGoalModal
            activeGoal={activeGoal}
            onClose={() => setShowEditGoalModal(false)}
            onSave={() => {
              setShowEditGoalModal(false);
              fetchData();
            }}
          />
        )}
        {showTaskModal && (
          <CreateTaskModal
            activeGoal={activeGoal}
            defaultAssignee={taskModalAssignee}
            onClose={() => setShowTaskModal(false)} 
            onSave={() => {
              setShowTaskModal(false);
              fetchData();
            }} 
          />
        )}
        {showBackpatModal && (
          <SendBackpatModal 
            onClose={() => setShowBackpatModal(false)} 
            onSave={() => {
              setShowBackpatModal(false);
              fetchData();
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
