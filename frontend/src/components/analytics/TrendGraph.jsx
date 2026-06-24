import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const TrendGraph = ({ data }) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#172330] border border-[#253746] px-3 py-2 rounded-xl shadow-premium text-xs">
          <p className="font-bold text-white mb-1">{payload[0].payload.period}</p>
          <p className="text-gray-400 font-medium">Uploads: <span className="text-[#FFA37A] font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-80 bg-[#172330] border border-[#253746] p-6 rounded-2xl">
      <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Monthly Resume Uploads</h3>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#253746" vertical={false} />
            <XAxis 
              dataKey="period" 
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
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#FFA37A" 
              strokeWidth={3}
              dot={{ fill: '#FFA37A', stroke: '#172330', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default TrendGraph;
