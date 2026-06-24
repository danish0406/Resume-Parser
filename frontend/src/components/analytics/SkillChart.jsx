import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const SkillChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: item.skill_name || item.name,
    count: item.count || 0
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#172330] border border-[#253746] px-3 py-2 rounded-xl shadow-premium text-xs">
          <p className="font-bold text-white mb-1">{payload[0].payload.name}</p>
          <p className="text-gray-400 font-medium">Count: <span className="text-[#FF763D] font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-[#172330] border border-[#253746] p-6 rounded-2xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Top Skills Distribution</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#253746" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#8A9CA8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <YAxis 
              stroke="#8A9CA8" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="count" 
              fill="#FF763D" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default SkillChart;
