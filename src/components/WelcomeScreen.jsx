import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Gift, Map } from 'lucide-react';

export default function WelcomeScreen({ onBegin }) {
  return (
    <div className="flex-1 flex flex-col relative bg-[#0EB2A1] h-full overflow-hidden text-center items-center justify-between p-6 pb-12">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://www.transparenttextures.com/patterns/comic-bg.png')] z-0"></div>
      
      {/* Top Graphic / Logo */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
        className="z-10 mt-12 w-full flex flex-col items-center"
      >
        <img src="/logo.png" alt="Milestone Mates Logo" className="w-56 h-auto drop-shadow-xl mb-6" />
        <h1 className="text-4xl font-black text-white drop-shadow-md tracking-wide leading-tight mb-2" style={{ WebkitTextStroke: '1.5px #FF8800' }}>
          MILESTONE MATES
        </h1>
        <p className="text-teal-50 font-bold text-lg drop-shadow-sm px-4">
          Created for FIFO Families
        </p>
      </motion.div>

      {/* Center Features */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="z-10 w-full bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-5 border-4 border-white/50 my-6"
      >
        <div className="flex items-center gap-4 text-left">
          <div className="bg-teal-100 text-brand-teal p-3 rounded-2xl shadow-inner">
            <Leaf size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Track Growth</h3>
            <p className="text-gray-500 text-xs font-medium">Log tasks & shared goals</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-left">
          <div className="bg-orange-100 text-brand-orange p-3 rounded-2xl shadow-inner">
            <Gift size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Celebrate Milestones</h3>
            <p className="text-gray-500 text-xs font-medium">Send cheers & virtual backpats</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-left">
          <div className="bg-yellow-100 text-brand-gold p-3 rounded-2xl shadow-inner">
            <Map size={28} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Map Rituals</h3>
            <p className="text-gray-500 text-xs font-medium">Keep family routines alive</p>
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
        className="z-10 w-full px-4"
      >
        <button 
          onClick={onBegin}
          className="w-full bg-gradient-to-r from-brand-orange to-brand-gold hover:from-brand-orange-dark hover:to-orange-500 text-white font-black text-2xl py-5 rounded-2xl shadow-[0_8px_0_#C54A1E,0_15px_20px_rgba(255,107,53,0.4)] active:shadow-[0_0px_0_#C54A1E] active:translate-y-2 transition-all flex items-center justify-center tracking-wide border-2 border-white/20"
        >
          LET'S BEGIN
        </button>
      </motion.div>

    </div>
  );
}
