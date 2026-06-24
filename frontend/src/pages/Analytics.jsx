import React, { useState, useEffect } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import SkillChart from '../components/analytics/SkillChart';
import TrendGraph from '../components/analytics/TrendGraph';
import Spinner from '../components/ui/Spinner';
import Card from '../components/ui/Card';
import { analyticsAPI } from '../services/api';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const Analytics = () => {
  const [skills, setSkills] = useState([]);
  const [scores, setScores] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [skillsRes, scoresRes, statusRes, trendsRes] = await Promise.all([
          analyticsAPI.skills(),
          analyticsAPI.scores(),
          analyticsAPI.status(),
          analyticsAPI.trends()
        ]);

        if (skillsRes.data.success) setSkills(skillsRes.data.data);
        if (scoresRes.data.success) setScores(scoresRes.data.data);
        if (statusRes.data.success) setStatuses(statusRes.data.data);
        if (trendsRes.data.success) setTrends(trendsRes.data.data);
      } catch (err) {
        console.error('Failed to fetch talent analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <div className="h-[60vh] flex items-center justify-center">
          <Spinner size="large" />
        </div>
      </PageWrapper>
    );
  }

  const STATUS_COLORS = {
    New: '#3B82F6',
    Shortlisted: '#10B981',
    Rejected: '#EF4444',
    Interview: '#FFA37A'
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#172330] border border-[#253746] px-3 py-2 rounded-xl shadow-premium text-xs text-white">
          <p className="font-bold mb-1">{payload[0].name}</p>
          <p className="text-gray-400 font-medium">Count: <span className="font-bold text-[#FF763D]">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#172330] border border-[#253746] px-3 py-2 rounded-xl shadow-premium text-xs text-white">
          <p className="font-bold mb-1">Score Range {payload[0].payload.range}</p>
          <p className="text-gray-400 font-medium">Candidates: <span className="font-bold text-[#FF763D]">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <PageWrapper>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SkillChart data={skills} />

          <div className="w-full h-80 bg-[#172330] border border-[#253746] p-6 rounded-2xl flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Pipeline Status Breakdown</h3>
            <div className="w-full h-56 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statuses}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="status"
                  >
                    {statuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.status] || '#6B7280'} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    iconSize={10} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs text-gray-400 font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full h-80 bg-[#172330] border border-[#253746] p-6 rounded-2xl flex flex-col">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Resume Score Distribution</h3>
            <div className="w-full h-64 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#253746" vertical={false} />
                  <XAxis 
                    dataKey="range" 
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
                  <Tooltip content={<CustomBarTooltip />} />
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

          <TrendGraph data={trends} />
        </div>
      </div>
    </PageWrapper>
  );
};
export default Analytics;
