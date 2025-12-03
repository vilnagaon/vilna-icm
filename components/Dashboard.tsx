import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { UserStats } from '../types';

interface DashboardProps {
  stats: UserStats;
  onPlay: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, onPlay }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Stats Cards */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">ICM Accuracy</p>
          <div className="flex items-baseline mt-2">
            <h2 className="text-3xl font-bold text-white">
              {stats.handsPlayed > 0 ? Math.round((stats.correct / stats.handsPlayed) * 100) : 0}%
            </h2>
            <span className="ml-2 text-green-400 text-sm">+2.4% this week</span>
          </div>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Current Streak</p>
          <div className="flex items-baseline mt-2">
            <h2 className="text-3xl font-bold text-yellow-400">{stats.streak}</h2>
            <span className="ml-2 text-slate-500 text-sm">Best: 14</span>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <p className="text-slate-400 text-sm font-medium">Hands Analyzed</p>
          <div className="flex items-baseline mt-2">
            <h2 className="text-3xl font-bold text-blue-400">{stats.handsPlayed}</h2>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg h-80">
        <h3 className="text-lg font-semibold text-white mb-4">Performance Trend</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.history}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
              itemStyle={{ color: '#e2e8f0' }}
            />
            <Line 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#10b981" 
              strokeWidth={3} 
              dot={{ fill: '#10b981', r: 4 }} 
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center pt-4">
        <button 
          onClick={onPlay}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-12 rounded-full shadow-lg shadow-blue-500/20 transition-transform active:scale-95 text-lg"
        >
          Start Session
        </button>
      </div>
    </div>
  );
};