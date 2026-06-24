import React from 'react';
import Card from '../ui/Card';

export const StatsCard = ({ title, value, subtext, icon, trend }) => {
  return (
    <Card className="border-[#253746] bg-[#172330] flex items-center justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{title}</span>
        <h3 className="text-3xl font-extrabold text-white tracking-tight">{value}</h3>
        {subtext && (
          <span className="text-xs text-gray-500 font-medium">
            {trend && <span className="text-emerald-400 font-bold mr-1">{trend}</span>}
            {subtext}
          </span>
        )}
      </div>
      <div className="w-12 h-12 rounded-xl bg-[#FF763D]/10 border border-[#FF763D]/20 flex items-center justify-center text-[#FF763D]">
        {icon}
      </div>
    </Card>
  );
};
export default StatsCard;
