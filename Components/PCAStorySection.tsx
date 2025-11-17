import React from 'react';
import { BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight, Scale, Network, Compass, TrendingUp, Target } from 'lucide-react';
import { motion } from 'motion/react';

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
  delay: number;
}

const StepCard: React.FC<StepCardProps> = ({ stepNumber, title, description, visualization, notes, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
    >
      <Card className="p-6 bg-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-gray-100 min-h-[600px] flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-sm text-blue-600 mb-1">Step {stepNumber}</div>
            <h3 className="text-xl mb-2">{title}</h3>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>

        <div className="flex-1 mb-4 bg-gray-50 rounded-xl p-4 flex items-center justify-center min-h-[240px]">
          {visualization}
        </div>

        <div className="space-y-2 border-t pt-4">
          {notes.map((note, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
              <p className="text-xs text-gray-600 leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

const PCAStorySection: React.FC = () => {
  const steps = [
    {
      stepNumber: 1,
      title: "Standardize the Data",
      description: "Different features (like BP, sugar, BMI) have different units. PCA first makes them all on the same scale, so no one feature dominates just because it has bigger numbers.",
      icon: <Scale className="w-6 h-6" />,
      notes: [
        "This ensures fairness between features.",
        "Scaling avoids misleading importance due to large numerical values.",
        "Common scaling methods: z-score normalization or min-max scaling."
      ],
      visualization: (
        <div className="w-full h-full flex items-center gap-8">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 text-center">Before Scaling</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={step1BeforeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {step1BeforeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#94a3b8" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ArrowRight className="w-6 h-6 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 text-center">After Scaling</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={step1AfterData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {step1AfterData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill="#2563eb" />
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
      title: "Find Relationships (Covariance)",
      description: "PCA checks how features move together. If two things always rise or fall together, one might be repeating the other's job.",
      icon: <Network className="w-6 h-6" />,
      notes: [
        "Covariance measures how features change together.",
        "Strong correlation → redundant information.",
        "PCA merges correlated features to reduce noise."
      ],
      visualization: (
        <div className="w-full h-full flex items-center gap-8">
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 text-center">Strong Link</p>
            <ResponsiveContainer width="100%" height={180}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 11 }} />
                <Scatter data={step2CorrelatedData} fill="#2563eb" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-2 text-center">No Link</p>
            <ResponsiveContainer width="100%" height={180}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" dataKey="x" tick={{ fontSize: 11 }} />
                <YAxis type="number" dataKey="y" tick={{ fontSize: 11 }} />
                <Scatter data={step2UncorrelatedData} fill="#94a3b8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      )
    },
    {
      stepNumber: 3,
      title: "Find New Directions (Eigen Decomposition)",
      description: "PCA looks for new 'directions' in the data that show the biggest difference between points. These new directions are called principal components.",
      icon: <Compass className="w-6 h-6" />,
      notes: [
        "PC1 = direction with maximum variance.",
        "PC2 = next independent direction.",
        "Together, they summarize complex data patterns."
      ],
      visualization: (
        <div className="w-full h-full flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" dataKey="x" domain={[-60, 60]} tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="y" domain={[-40, 40]} tick={{ fontSize: 11 }} />
              <Scatter data={step3PCData} fill="#2563eb" />
            </ScatterChart>
          </ResponsiveContainer>
          <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#dc2626" />
              </marker>
              <marker id="arrowhead2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#ea580c" />
              </marker>
            </defs>
            <line x1="50%" y1="50%" x2="75%" y2="25%" stroke="#dc2626" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <line x1="50%" y1="50%" x2="30%" y2="30%" stroke="#ea580c" strokeWidth="2.5" markerEnd="url(#arrowhead2)" />
            <text x="76%" y="22%" fill="#dc2626" fontSize="12">PC1</text>
            <text x="28%" y="28%" fill="#ea580c" fontSize="11">PC2</text>
          </svg>
        </div>
      )
    },
    {
      stepNumber: 4,
      title: "Rank the Directions (Eigenvalues)",
      description: "Each new direction has a score that says how much information it holds. PCA sorts these — biggest score means most useful direction.",
      icon: <TrendingUp className="w-6 h-6" />,
      notes: [
        "Eigenvalue = amount of variance captured.",
        "Higher eigenvalue → more informative component.",
        "Usually, top 2–3 PCs explain 90–95% of total variance."
      ],
      visualization: (
        <div className="w-full h-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={step4EigenvaluesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'Variance %', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {step4EigenvaluesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : index === 1 ? '#3b82f6' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )
    },
    {
      stepNumber: 5,
      title: "Pick Top Components & Important Features",
      description: "Finally, PCA checks which original features (like BP, sugar, etc.) are most connected to those top directions — those are the most important features.",
      icon: <Target className="w-6 h-6" />,
      notes: [
        "Bright = high contribution (important).",
        "Dark = low contribution (less impact).",
        "Helps identify the top medical indicators influencing the dataset."
      ],
      visualization: (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="grid grid-cols-4 gap-1">
              <div className="text-xs p-2"></div>
              {['PC1', 'PC2', 'PC3'].map(pc => (
                <div key={pc} className="text-xs p-2 text-center">{pc}</div>
              ))}
              {step5HeatmapData.map((row, rowIdx) => (
                <React.Fragment key={rowIdx}>
                  <div className="text-xs p-2 text-right">{row.feature}</div>
                  <div 
                    className="rounded p-4 flex items-center justify-center text-xs text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `rgba(37, 99, 235, ${row.pc1})` }}
                  >
                    {(row.pc1 * 100).toFixed(0)}%
                  </div>
                  <div 
                    className="rounded p-4 flex items-center justify-center text-xs text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `rgba(37, 99, 235, ${row.pc2})` }}
                  >
                    {(row.pc2 * 100).toFixed(0)}%
                  </div>
                  <div 
                    className="rounded p-4 flex items-center justify-center text-xs text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: `rgba(37, 99, 235, ${row.pc3})` }}
                  >
                    {(row.pc3 * 100).toFixed(0)}%
                  </div>
                </React.Fragment>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
              <span>Low Impact</span>
              <div className="flex items-center gap-1">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => (
                  <div 
                    key={opacity}
                    className="w-6 h-4 rounded"
                    style={{ backgroundColor: `rgba(37, 99, 235, ${opacity})` }}
                  />
                ))}
              </div>
              <span>High Impact</span>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm mb-4">
            🧭 Educational Story
          </div>
          <h2 className="text-4xl mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            How PCA Decides Which Features Are Important
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            From raw data to key insights — a visual story for everyone.
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            Principal Component Analysis (PCA) helps us find which features truly matter by scaling, comparing, ranking, and selecting. Here's how it works in five simple steps.
          </p>
        </motion.div>

        {/* Step Cards - Responsive Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
          {steps.map((step, index) => (
            <StepCard key={index} {...step} delay={index * 0.1} />
          ))}
        </div>

        {/* Horizontal Scroll for Mobile/Tablet */}
        <div className="lg:hidden mb-12 -mx-4 px-4">
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {steps.map((step, index) => (
              <div key={index} className="flex-shrink-0 w-[85vw] sm:w-[450px] snap-center">
                <StepCard {...step} delay={0} />
              </div>
            ))}
          </div>
        </div>

        {/* Closing Section */}
        <motion.div 
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 max-w-3xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <blockquote className="text-xl text-gray-700 italic mb-6 leading-relaxed">
              "PCA simplifies complexity — it's like summarizing a 10-page report into a single, meaningful headline."
            </blockquote>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
              onClick={() => {
                const visualizationsSection = document.querySelector('#visualizations-section');
                visualizationsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See PCA in Action
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
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
    </section>
  );
};

export default PCAStorySection;
