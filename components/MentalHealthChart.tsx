import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import type { MentalHealthDataPoint } from '../types';

interface OverviewChartsProps {
  data: MentalHealthDataPoint[];
  aiName: string;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="label font-semibold text-gray-700 dark:text-gray-300">{`Date: ${label}`}</p>
          {payload.map((pld: any) => (
            <div key={pld.dataKey} style={{ color: pld.color }} className="flex items-center">
              <span className="font-medium">{`${pld.name}: ${pld.value}`}</span>
              <span className="text-xs ml-2 text-slate-500 dark:text-slate-400">({pld.payload.source})</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};

const OverviewCharts: React.FC<OverviewChartsProps> = ({ data, aiName }) => {
  const chartableData = data.filter(d => d.mood !== null || d.stress !== null || d.energy !== null);
  
  if (chartableData.length === 0) {
    return (
        <div role="status" className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 min-h-[200px]">
            <p className="text-slate-500 dark:text-slate-400 text-center">Not enough data to display charts. Complete a check-in or chat with {aiName} to get started.</p>
        </div>
    )
  }

  const lastDataPoint = chartableData.length > 0 ? chartableData[chartableData.length - 1] : { mood: 0, stress: 0, energy: 0 };
  const radarData = [
    { subject: 'Mood', A: lastDataPoint.mood, fullMark: 10 },
    { subject: 'Stress', A: lastDataPoint.stress, fullMark: 10 },
    { subject: 'Energy', A: lastDataPoint.energy, fullMark: 10 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2" role="figure" aria-label="Line chart showing trends for Mood, Stress, and Energy.">
            <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={chartableData}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis domain={[1, 10]} stroke="#64748b" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="mood" name="Mood" stroke="#84cc16" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} connectNulls />
                <Line type="monotone" dataKey="stress" name="Stress" stroke="#f43f5e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} connectNulls />
                <Line type="monotone" dataKey="energy" name="Energy" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} connectNulls />
            </LineChart>
            </ResponsiveContainer>
        </div>
        <div className="md:col-span-1" role="figure" aria-label="Radar chart showing the latest scores for Mood, Stress, and Energy.">
            <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid strokeOpacity={0.3} />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar name="Latest" dataKey="A" stroke="#65a30d" fill="#84cc16" fillOpacity={0.6} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    </div>
  );
};

export default OverviewCharts;