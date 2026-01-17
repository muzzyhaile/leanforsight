import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, Label } from 'recharts';
import { Scenario, ScenarioType } from '../types';

interface ScenarioMapProps {
  scenarios: Scenario[];
  onScenarioClick?: (scenario: Scenario) => void;
}

interface ScenarioDataPoint {
  scenario: Scenario;
  x: number; // Desirability axis (-100 to 100)
  y: number; // Probability axis (0 to 100)
  size: number;
}

/**
 * ScenarioMap Component
 * 
 * Interactive 2D visualization of scenarios plotted on desirability vs. probability axes.
 * Provides an alternative view to card layout for exploring relationships between scenarios.
 */
export const ScenarioMap: React.FC<ScenarioMapProps> = ({ scenarios, onScenarioClick }) => {
  /**
   * Map scenarios to 2D positions based on their type
   * This provides a structured layout that reflects the RAM framework
   */
  const dataPoints: ScenarioDataPoint[] = useMemo(() => {
    return scenarios.map((scenario) => {
      let x = 0; // Desirability (-100 = worst, 100 = best)
      let y = 50; // Probability (0 = unlikely, 100 = certain)

      switch (scenario.type) {
        case ScenarioType.BEST_CASE:
          x = 75; // Highly desirable
          y = 30; // Possible but not certain
          break;
        case ScenarioType.WORST_CASE:
          x = -75; // Highly undesirable
          y = 30; // Possible but not certain
          break;
        case ScenarioType.PREFERRED:
          x = 85; // Most desirable
          y = 60; // More achievable through action
          break;
        case ScenarioType.PLAUSIBLE:
          x = 0; // Neutral desirability
          y = 70; // Most likely baseline
          break;
      }

      return {
        scenario,
        x,
        y,
        size: 800, // Bubble size
      };
    });
  }, [scenarios]);

  /**
   * Get color for scenario type
   */
  const getColor = (type: ScenarioType): string => {
    switch (type) {
      case ScenarioType.BEST_CASE:
        return '#4ade80'; // green
      case ScenarioType.WORST_CASE:
        return '#ef4444'; // red
      case ScenarioType.PREFERRED:
        return '#a855f7'; // purple
      case ScenarioType.PLAUSIBLE:
        return '#94a3b8'; // slate
      default:
        return '#64748b';
    }
  };

  /**
   * Custom tooltip renderer
   */
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length > 0) {
      const data: ScenarioDataPoint = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-slate-200 max-w-xs">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            {data.scenario.type}
          </p>
          <p className="text-sm font-bold text-slate-900 mb-2">{data.scenario.title}</p>
          <p className="text-xs text-slate-600 leading-relaxed">{data.scenario.description}</p>
          {data.scenario.indicators?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-700 mb-1">Key Indicators:</p>
              <ul className="space-y-1">
                {data.scenario.indicators.slice(0, 2).map((indicator, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex items-start gap-1">
                    <span className="text-slate-400">•</span>
                    <span>{indicator}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">Scenario Landscape</h3>
        <p className="text-sm text-slate-500 mt-1">
          Interactive map showing scenarios plotted by desirability and probability
        </p>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={500}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            
            <XAxis
              type="number"
              dataKey="x"
              domain={[-100, 100]}
              ticks={[-100, -50, 0, 50, 100]}
              tickFormatter={(value) => {
                if (value === -100) return 'Undesirable';
                if (value === 100) return 'Desirable';
                return '';
              }}
              stroke="#64748b"
              tick={{ fontSize: 12 }}
            >
              <Label
                value="Desirability →"
                position="bottom"
                offset={40}
                style={{ fontSize: 14, fontWeight: 600, fill: '#475569' }}
              />
            </XAxis>
            
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(value) => {
                if (value === 0) return 'Unlikely';
                if (value === 100) return 'Certain';
                return '';
              }}
              stroke="#64748b"
              tick={{ fontSize: 12 }}
            >
              <Label
                value="Probability →"
                angle={-90}
                position="left"
                offset={40}
                style={{ fontSize: 14, fontWeight: 600, fill: '#475569' }}
              />
            </YAxis>
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            <Scatter
              data={dataPoints}
              onClick={(data: ScenarioDataPoint) => {
                if (onScenarioClick) {
                  onScenarioClick(data.scenario);
                }
              }}
              style={{ cursor: onScenarioClick ? 'pointer' : 'default' }}
            >
              {dataPoints.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.scenario.type)} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {/* Quadrant Labels Overlay */}
        <div className="absolute top-10 left-20 text-xs text-slate-400 font-medium">
          Worst Case
        </div>
        <div className="absolute top-10 right-20 text-xs text-slate-400 font-medium">
          Best Case
        </div>
        <div className="absolute bottom-20 left-20 text-xs text-slate-400 font-medium">
          Low Impact
        </div>
        <div className="absolute bottom-20 right-20 text-xs text-slate-400 font-medium">
          Preferred
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap justify-center gap-4">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getColor(scenario.type) }}
            ></div>
            <span className="text-xs font-medium text-slate-700">{scenario.type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

ScenarioMap.displayName = 'ScenarioMap';