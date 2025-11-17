import React, { useRef } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './ui/card';
import { ArrowRight, Scale, Network, Compass, TrendingUp, Target, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

// Mock data for visualizations
const step1BeforeData = [
  { name: 'BP', value: 120 },
  { name: 'Sugar', value: 200 },
  { name: 'BMI', value: 25 },
  { name: 'Age', value: 45 },
];

const step1AfterData = [
  { name: 'BP', value: 0.5 },
  { name: 'Sugar', value: 0.5 },
  { name: 'BMI', value: 0.5 },
  { name: 'Age', value: 0.5 },
];

const step2CorrelatedData = Array.from({ length: 30 }, (_, i) => ({
  x: i,
  y: i * 0.8 + Math.random() * 5,
}));

const step2UncorrelatedData = Array.from({ length: 30 }, (_, i) => ({
  x: i,
  y: Math.random() * 30,
}));

const step3PCData = Array.from({ length: 40 }, (_, i) => ({
  x: Math.random() * 100 - 50,
  y: Math.random() * 60 - 30,
}));

const step4EigenvaluesData = [
  { name: 'PC1', value: 45 },
  { name: 'PC2', value: 25 },
  { name: 'PC3', value: 15 },
  { name: 'PC4', value: 10 },
  { name: 'PC5', value: 5 },
];

const step5HeatmapData = [
  { feature: 'BP', pc1: 0.9, pc2: 0.2, pc3: 0.1 },
  { feature: 'Cholesterol', pc1: 0.85, pc2: 0.3, pc3: 0.15 },
  { feature: 'Sugar', pc1: 0.4, pc2: 0.8, pc3: 0.2 },
  { feature: 'BMI', pc1: 0.6, pc2: 0.5, pc3: 0.4 },
  { feature: 'Age', pc1: 0.3, pc2: 0.2, pc3: 0.85 },
];

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  visualization: React.ReactNode;
  notes: string[];
  icon: React.ReactNode;
}

const StepCard: React.FC<StepCardProps> = ({ stepNumber, title, description, visualization, notes, icon }) => {
  return (
    <div className="flex-shrink-0 w-[320px] h-[500px] group">
      <div className="h-full p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-400/40 hover:bg-white/8 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-400/30">
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-xs text-blue-400 mb-1">Step {stepNumber}</div>
            <h3 className="text-base text-slate-100">{title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {description}
        </p>

        <div className="flex-1 mb-4 bg-slate-900/40 rounded-xl p-3 border border-white/5 flex items-center justify-center min-h-[180px]">
          {visualization}
        </div>

        <div className="space-y-2 border-t border-white/10 pt-3">
          {notes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
              <p className="text-xs text-slate-400 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PCAStoryDashboard: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const steps = [
    {
      stepNumber: 1,
      title: "Standardize the Data",
      description: "Different features (like BP, sugar, BMI) have different units. PCA scales them equally.",
      icon: <Scale className="w-5 h-5" />,
      notes: [
        "Ensures fairness between features.",
        "Prevents bias from large numbers."
      ],
      visualization: (
        <div className="w-full h-full flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 mb-2 text-center">Before</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={step1BeforeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {step1BeforeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#64748b" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ArrowRight className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 mb-2 text-center">After</p>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={step1AfterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {step1AfterData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    {
      stepNumber: 2,
      title: "Find Relationships",
      description: "PCA checks how features move together to find redundancy.",
      icon: <Network className="w-5 h-5" />,
      notes: [
        "Correlated = overlap.",
        "Uncorrelated = unique info."
      ],
      visualization: (
        <div className="w-full h-full flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 mb-2 text-center">Strong Link</p>
            <ResponsiveContainer width="100%" height={130}>
              <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="x" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Scatter data={step2CorrelatedData} fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <p className="text-[10px] text-slate-400 mb-2 text-center">No Link</p>
            <ResponsiveContainer width="100%" height={130}>
              <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" dataKey="x" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 9, fill: '#94a3b8' }} />
                <Scatter data={step2UncorrelatedData} fill="#64748b" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    {
      stepNumber: 3,
      title: "Find New Directions",
      description: "Finds new directions capturing maximum variance.",
      icon: <Compass className="w-5 h-5" />,
      notes: [
        "PC1 = highest variance.",
        "PC2 = next independent."
      ],
      visualization: (
        <div className="w-full h-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height={180}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" dataKey="x" domain={[-60, 60]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis type="number" dataKey="y" domain={[-40, 40]} tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Scatter data={step3PCData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            <defs>
              <marker id="arrowhead-dark" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
              </marker>
              <marker id="arrowhead2-dark" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
                <polygon points="0 0, 8 3, 0 6" fill="#f97316" />
              </marker>
            </defs>
            <line x1="50%" y1="50%" x2="70%" y2="30%" stroke="#ef4444" strokeWidth="2.5" markerEnd="url(#arrowhead-dark)" />
            <line x1="50%" y1="50%" x2="35%" y2="35%" stroke="#f97316" strokeWidth="2" markerEnd="url(#arrowhead2-dark)" />
            <text x="71%" y="28%" fill="#ef4444" fontSize="10">PC1</text>
            <text x="33%" y="33%" fill="#f97316" fontSize="9">PC2</text>
          </svg>
        </div>
      )
    },
    {
      stepNumber: 4,
      title: "Rank Directions",
      description: "Ranks components by their information content.",
      icon: <TrendingUp className="w-5 h-5" />,
      notes: [
        "Eigenvalue = variance measure.",
        "Bigger bar = more info."
      ],
      visualization: (
        <div className="w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={step4EigenvaluesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {step4EigenvaluesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : index === 1 ? '#60a5fa' : '#93c5fd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      stepNumber: 5,
      title: "Pick Top Components",
      description: "Highlights which features influence top components.",
      icon: <Target className="w-5 h-5" />,
      notes: [
        "Bright = high contribution.",
        "Helps identify key features."
      ],
      visualization: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full">
            <div className="grid grid-cols-4 gap-1 text-[9px]">
              <div className="p-1"></div>
              {['PC1', 'PC2', 'PC3'].map(pc => (
                <div key={pc} className="p-1 text-center text-slate-400">{pc}</div>
              ))}
              {step5HeatmapData.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  <div className="p-1 text-right text-slate-400">{row.feature}</div>
                  <div 
                    className="rounded p-2 flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `rgba(59, 130, 246, ${row.pc1})` }}
                  >
                    {(row.pc1 * 100).toFixed(0)}%
                  </div>
                  <div 
                    className="rounded p-2 flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `rgba(59, 130, 246, ${row.pc2})` }}
                  >
                    {(row.pc2 * 100).toFixed(0)}%
                  </div>
                  <div 
                    className="rounded p-2 flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `rgba(59, 130, 246, ${row.pc3})` }}
                  >
                    {(row.pc3 * 100).toFixed(0)}%
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-[9px] text-slate-500">
              <span>Low</span>
              <div className="flex items-center gap-0.5">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                  <div 
                    key={opacity}
                    className="w-4 h-3 rounded-sm"
                    style={{ backgroundColor: `rgba(59, 130, 246, ${opacity})` }}
                  />
                ))}
              </div>
              <span>High</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div 
        className="w-[90%] max-w-6xl rounded-3xl p-8 relative"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 0 60px rgba(59, 130, 246, 0.2), inset 0 0 40px rgba(59, 130, 246, 0.05)'
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl text-slate-100 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            How PCA Decides Which Features Are Important
          </h2>
          <p className="text-sm text-slate-400">
            Step-by-step visual story inside the PCA Mastery Dashboard
          </p>
        </div>

        {/* Scrollable Cards Container */}
        <div className="relative">
          {/* Left Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 rounded-full w-10 h-10 -ml-5"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Cards */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1"
          >
            {steps.map((step, index) => (
              <StepCard key={index} {...step} />
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-slate-900/80 hover:bg-slate-800 text-white border border-white/10 rounded-full w-10 h-10 -mr-5"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-slate-500" style={{ letterSpacing: '0.5px' }}>
            Educational Story Mode — Learn How PCA Chooses Important Features
          </p>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default PCAStoryDashboard;
