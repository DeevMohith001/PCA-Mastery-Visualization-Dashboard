import React, { useState, useRef, useEffect, useMemo } from 'react';
import { BarChart, Bar, ScatterChart, Scatter, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ComposedChart, Tooltip, ZAxis } from 'recharts';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Scale, Network, Compass, TrendingUp, Target, CheckCircle2, AlertCircle, Zap, Database, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';

interface Dataset {
  name: string;
  emoji: string;
  features: string[];
  data: number[][];
  targetValues: (number | string)[];
  targetNames?: string[];
}

interface PCAResult {
  transformedData: number[][];
  explainedVariance: number[];
  explainedVarianceRatio: number[];
  cumulativeVariance: number[];
  components: number[][];
  eigenvalues: number[];
  mean: number[];
  std: number[];
  reconstructionError: number[];
  loadings: number[][];
  correlationMatrix: number[][];
  originalData: number[][];
  standardizedData: number[][];
}

interface PCAStoryGalleryProps {
  dataset: Dataset;
  pcaResult: PCAResult;
  nComponents: number;
}

interface BulletPoint {
  icon: React.ReactNode;
  text: string;
}

interface StepData {
  stepNumber: number;
  title: string;
  icon: React.ReactNode;
  bullets: BulletPoint[];
  chart: React.ReactNode;
  thumbnailPreview: React.ReactNode;
}

// Dataset color mapping
const getDatasetColor = (datasetName: string): string => {
  const colorMap: { [key: string]: string } = {
    'Iris': '#34D399',
    'Wine': '#F87171',
    'Breast Cancer': '#FBBF24',
    'Diabetes': '#60A5FA'
  };
  return colorMap[datasetName] || '#3b82f6';
};

// Helper function to compute correlation pairs
const getCorrelationPairs = (corrMatrix: number[][], features: string[]) => {
  let maxCorr = -2;
  let minCorr = 2;
  let maxPair = { featureA: '', featureB: '', corr: 0, idxA: 0, idxB: 1 };
  let minPair = { featureA: '', featureB: '', corr: 0, idxA: 0, idxB: 1 };

  for (let i = 0; i < corrMatrix.length; i++) {
    for (let j = i + 1; j < corrMatrix[i].length; j++) {
      const corr = corrMatrix[i][j];
      if (Math.abs(corr) > Math.abs(maxCorr) && Math.abs(corr) < 1) {
        maxCorr = corr;
        maxPair = { featureA: features[i], featureB: features[j], corr, idxA: i, idxB: j };
      }
      if (Math.abs(corr) < Math.abs(minCorr)) {
        minCorr = corr;
        minPair = { featureA: features[i], featureB: features[j], corr, idxA: i, idxB: j };
      }
    }
  }

  return { maxPair, minPair };
};

const PCAStoryGallery: React.FC<PCAStoryGalleryProps> = ({ dataset, pcaResult, nComponents }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [showDataSummary, setShowDataSummary] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pcPairSelection, setPcPairSelection] = useState('PC1-PC2');
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  // Get dataset-specific color
  const accentColor = getDatasetColor(dataset.name);
  const totalVariance = (pcaResult.cumulativeVariance[nComponents - 1] * 100).toFixed(1);

  // Trigger transition effect when dataset or components change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [dataset.name, nComponents]);

  // ============ ISSUE 1: Step 1 - Dynamic Component Standardization (K-aware) ============
  const step1Data = useMemo(() => {
    // Create data for K principal components
    const beforeData = Array.from({ length: nComponents }, (_, idx) => ({
      name: `PC${idx + 1}`,
      value: pcaResult.explainedVariance[idx] || 0, // Raw eigenvalue/variance
      pcIndex: idx
    }));

    const afterData = Array.from({ length: nComponents }, (_, idx) => ({
      name: `PC${idx + 1}`,
      value: pcaResult.explainedVarianceRatio[idx] || 0, // Normalized variance ratio (0-1)
      variancePercent: (pcaResult.explainedVarianceRatio[idx] || 0) * 100,
      pcIndex: idx
    }));

    return { beforeData, afterData, K: nComponents };
  }, [pcaResult, nComponents]);

  // ============ ISSUE 2: Step 2 - Real Correlation Pairs ============
  const step2Data = useMemo(() => {
    const { maxPair, minPair } = getCorrelationPairs(pcaResult.correlationMatrix, dataset.features);
    
    const strongData = dataset.data.map(row => ({
      x: row[maxPair.idxA],
      y: row[maxPair.idxB]
    }));

    const weakData = dataset.data.map(row => ({
      x: row[minPair.idxA],
      y: row[minPair.idxB]
    }));

    return { strongData, weakData, maxPair, minPair };
  }, [dataset, pcaResult]);

  // ============ ISSUE 3: Step 3 - Adaptive PC Visualization ============
  const step3Data = useMemo(() => {
    const projectionData = pcaResult.transformedData.map((row, idx) => ({
      pc1: row[0] || 0,
      pc2: row[1] || 0,
      pc3: row[2] || 0,
      class: dataset.targetValues[idx]
    }));

    return projectionData;
  }, [pcaResult, dataset]);

  // ============ ISSUE 4: Step 4 - Scree Plot ============
  const step4Data = useMemo(() => {
    return pcaResult.explainedVarianceRatio.map((variance, index) => ({
      name: `PC${index + 1}`,
      variance: (variance * 100),
      cumulative: (pcaResult.cumulativeVariance[index] * 100)
    }));
  }, [pcaResult]);

  // ============ ISSUE 4: Step 5 - Dynamic Heatmap with ALL features and K columns ============
  const step5Data = useMemo(() => {
    return dataset.features.map((feature, featureIdx) => {
      const loadings: any = { feature };
      for (let i = 0; i < nComponents; i++) {
        loadings[`pc${i + 1}`] = Math.abs(pcaResult.loadings[featureIdx]?.[i] || 0);
        loadings[`pc${i + 1}_signed`] = pcaResult.loadings[featureIdx]?.[i] || 0;
      }
      return loadings;
    });
  }, [dataset, pcaResult, nComponents]);

  // Get top features by importance
  const topFeatures = useMemo(() => {
    const featureImportance = dataset.features.map((feature, idx) => {
      const importance = pcaResult.loadings[idx]
        ?.slice(0, nComponents)
        .reduce((sum, val) => sum + Math.abs(val), 0) || 0;
      return { feature, importance };
    });
    return featureImportance
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 3)
      .map(f => f.feature);
  }, [dataset, pcaResult, nComponents]);

  const steps: StepData[] = [
    {
      stepNumber: 1,
      title: "Standardize the Data",
      icon: <Scale className="w-6 h-6" />,
      bullets: [
        {
          icon: <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />,
          text: `Transforming ${dataset.features.length} features into ${nComponents} principal components.`
        },
        {
          icon: <AlertCircle className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Each PC combines features to capture maximum variance."
        },
        {
          icon: <Zap className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Standardization ensures numerical stability and fairness."
        },
        {
          icon: <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />,
          text: `Currently using ${nComponents} component${nComponents > 1 ? 's' : ''} (${totalVariance}% variance explained).`
        }
      ],
      chart: (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 px-4 py-4">
          {/* Dynamic title showing K value */}
          <motion.div 
            className="text-center"
            key={nComponents}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h4 className="text-base mb-1" style={{ color: accentColor, fontWeight: 600 }}>
              Scaling {step1Data.K} Principal Component{step1Data.K > 1 ? 's' : ''} to Unit Variance
            </h4>
            <p className="text-xs text-slate-500">
              Showing {step1Data.K} component{step1Data.K > 1 ? 's' : ''} standardized for PCA calculation
            </p>
          </motion.div>

          {/* Charts Side by Side with Animations */}
          <motion.div 
            className="w-full flex items-center gap-6"
            key={`step1-${nComponents}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-3 text-center">Before Scaling (Raw Eigenvalues)</p>
              <ScrollArea className={step1Data.K > 10 ? "h-[280px]" : ""}>
                <ResponsiveContainer width="100%" height={Math.max(250, Math.min(step1Data.K * 40, 400))}>
                  <BarChart data={step1Data.beforeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                      angle={step1Data.K > 5 ? -20 : 0} 
                      textAnchor={step1Data.K > 5 ? "end" : "middle"}
                      height={step1Data.K > 5 ? 60 : 30} 
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                              <p className="text-xs text-slate-300 mb-1 font-semibold">{data.name}</p>
                              <p className="text-xs text-slate-400">Raw variance: {data.value.toFixed(4)}</p>
                              <p className="text-xs text-slate-500 mt-1">Eigenvalue before normalization</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={500} animationBegin={200}>
                      {step1Data.beforeData.map((_, index) => (
                        <Cell key={`cell-before-${index}`} fill="#94A3B8" />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {step1Data.K > 10 && (
                  <Badge className="mt-2" variant="secondary">
                    Scroll for all {step1Data.K} components
                  </Badge>
                )}
              </ScrollArea>
            </div>
            <div className="flex items-center">
              <ChevronRight className="w-8 h-8" style={{ color: accentColor }} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400 mb-3 text-center">After Scaling (Variance Ratios)</p>
              <ScrollArea className={step1Data.K > 10 ? "h-[280px]" : ""}>
                <ResponsiveContainer width="100%" height={Math.max(250, Math.min(step1Data.K * 40, 400))}>
                  <BarChart data={step1Data.afterData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11, fill: '#94a3b8' }} 
                      angle={step1Data.K > 5 ? -20 : 0} 
                      textAnchor={step1Data.K > 5 ? "end" : "middle"}
                      height={step1Data.K > 5 ? 60 : 30}
                    />
                    <YAxis domain={[0, 1]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                              <p className="text-xs text-slate-300 mb-1 font-semibold">{data.name}</p>
                              <p className="text-xs text-slate-400">Normalized: {data.value.toFixed(4)}</p>
                              <p className="text-xs mt-1" style={{ color: accentColor }}>
                                Explains {data.variancePercent.toFixed(1)}% of total variance
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                ✓ Scaled to unit variance for PCA
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={500} animationBegin={200}>
                      {step1Data.afterData.map((_, index) => (
                        <Cell key={`cell-after-${index}`} fill={accentColor} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {step1Data.K > 10 && (
                  <Badge className="mt-2" variant="secondary">
                    Scroll for all {step1Data.K} components
                  </Badge>
                )}
              </ScrollArea>
            </div>
          </motion.div>

          {/* Progress Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <Badge 
              variant="outline" 
              className="mt-2"
              style={{ borderColor: accentColor, color: accentColor }}
            >
              ✓ {step1Data.K} component{step1Data.K > 1 ? 's' : ''} active
            </Badge>
          </motion.div>
        </div>
      ),
      thumbnailPreview: (
        <div className="w-full h-full flex items-center justify-center px-1">
          <div className="flex gap-1 w-full">
            <div className="flex-1 bg-slate-600 rounded-t h-8"></div>
            <div className="flex-1 rounded-t h-8" style={{ backgroundColor: accentColor }}></div>
          </div>
        </div>
      )
    },
    {
      stepNumber: 2,
      title: "Find Relationships (Covariance)",
      icon: <Network className="w-6 h-6" />,
      bullets: [
        {
          icon: <Network className="w-5 h-5" style={{ color: accentColor }} />,
          text: `In ${dataset.name}, "${step2Data.maxPair.featureA}" and "${step2Data.maxPair.featureB}" show strong correlation (${step2Data.maxPair.corr.toFixed(2)}).`
        },
        {
          icon: <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />,
          text: "High |corr| ⇒ info can be compressed together."
        },
        {
          icon: <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />,
          text: `"${step2Data.minPair.featureA}" and "${step2Data.minPair.featureB}" have weak correlation (${step2Data.minPair.corr.toFixed(2)}).`
        },
        {
          icon: <Zap className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Cuts noise/multicollinearity early."
        }
      ],
      chart: (
        <div className="w-full h-full flex items-center justify-center gap-8 px-4">
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-3 text-center">
              Strong Link: {step2Data.maxPair.featureA} vs {step2Data.maxPair.featureB}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: step2Data.maxPair.featureA, position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: step2Data.maxPair.featureB, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-2 rounded border border-slate-700">
                          <p className="text-xs text-slate-300">corr = {step2Data.maxPair.corr.toFixed(3)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={step2Data.strongData} fill={accentColor} opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 mb-3 text-center">
              No Link: {step2Data.minPair.featureA} vs {step2Data.minPair.featureB}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: step2Data.minPair.featureA, position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  label={{ value: step2Data.minPair.featureB, angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-2 rounded border border-slate-700">
                          <p className="text-xs text-slate-300">corr = {step2Data.minPair.corr.toFixed(3)}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={step2Data.weakData} fill="#64748b" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      ),
      thumbnailPreview: (
        <div className="w-full h-full flex items-center justify-center px-1">
          <div className="grid grid-cols-5 gap-px w-full h-full">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-full w-1 h-1" style={{ backgroundColor: accentColor }}></div>
            ))}
          </div>
        </div>
      )
    },
    {
      stepNumber: 3,
      title: "Find New Directions (Eigen Decomposition)",
      icon: <Compass className="w-6 h-6" />,
      bullets: [
        {
          icon: <Compass className="w-5 h-5" style={{ color: accentColor }} />,
          text: nComponents === 1 
            ? `PC1 captures ${(pcaResult.explainedVarianceRatio[0] * 100).toFixed(1)}% of variance.`
            : `PC1 captures ${(pcaResult.explainedVarianceRatio[0] * 100).toFixed(1)}%, PC2 captures ${(pcaResult.explainedVarianceRatio[1] * 100).toFixed(1)}%.`
        },
        {
          icon: <Network className="w-5 h-5" style={{ color: accentColor }} />,
          text: `PCs combine features like ${topFeatures[0]} and ${topFeatures[1]} in new directions.`
        },
        {
          icon: <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />,
          text: nComponents >= 3 
            ? `Using ${nComponents} components for visualization.`
            : "PCs are orthogonal (uncorrelated)."
        },
        {
          icon: <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Projection keeps patterns with fewer dimensions."
        }
      ],
      chart: (
        <div className="w-full h-full flex flex-col items-center justify-center relative px-4">
          {nComponents === 1 ? (
            // K = 1: Show histogram/density
            <div className="w-full">
              <p className="text-xs text-slate-400 mb-3 text-center">
                PC1 Projection ({(pcaResult.explainedVarianceRatio[0] * 100).toFixed(1)}% variance)
              </p>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={step3Data.slice(0, 50).map((d, i) => ({ x: d.pc1, y: 1 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis type="number" dataKey="x" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'PC1', position: 'insideBottom', offset: -5, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Bar dataKey="y" fill={accentColor} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : nComponents === 2 ? (
            // K = 2: Show 2D scatter
            <div className="w-full">
              <p className="text-xs text-slate-400 mb-3 text-center">
                2D PCA Projection
              </p>
              <ResponsiveContainer width="100%" height={320}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    type="number" 
                    dataKey="pc1" 
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: `PC1 (${(pcaResult.explainedVarianceRatio[0] * 100).toFixed(1)}%)`, position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="pc2" 
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ value: `PC2 (${(pcaResult.explainedVarianceRatio[1] * 100).toFixed(1)}%)`, angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Scatter data={step3Data} fill={accentColor} opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          ) : (
            // K >= 3: Show pair selector with dropdown
            <div className="w-full">
              <div className="flex items-center justify-center gap-4 mb-3">
                <p className="text-xs text-slate-400">Select PC Pair:</p>
                <Select value={pcPairSelection} onValueChange={setPcPairSelection}>
                  <SelectTrigger className="w-32 h-8 text-xs bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: nComponents - 1 }, (_, i) => 
                      Array.from({ length: nComponents - i - 1 }, (_, j) => (
                        <SelectItem key={`PC${i + 1}-PC${i + j + 2}`} value={`PC${i + 1}-PC${i + j + 2}`}>
                          PC{i + 1} vs PC{i + j + 2}
                        </SelectItem>
                      ))
                    ).flat()}
                  </SelectContent>
                </Select>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis 
                    type="number" 
                    dataKey={`pc${parseInt(pcPairSelection.split('-')[0].replace('PC', ''))}`}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ 
                      value: `${pcPairSelection.split('-')[0]} (${(pcaResult.explainedVarianceRatio[parseInt(pcPairSelection.split('-')[0].replace('PC', '')) - 1] * 100).toFixed(1)}%)`, 
                      position: 'insideBottom', 
                      offset: -10, 
                      fill: '#94a3b8',
                      fontSize: 11
                    }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey={`pc${parseInt(pcPairSelection.split('-')[1].replace('PC', ''))}`}
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    label={{ 
                      value: `${pcPairSelection.split('-')[1]} (${(pcaResult.explainedVarianceRatio[parseInt(pcPairSelection.split('-')[1].replace('PC', '')) - 1] * 100).toFixed(1)}%)`, 
                      angle: -90, 
                      position: 'insideLeft', 
                      fill: '#94a3b8',
                      fontSize: 11
                    }}
                  />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
                  <Scatter data={step3Data} fill={accentColor} opacity={0.6} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      ),
      thumbnailPreview: (
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${accentColor}30` }}>
            <Compass className="w-4 h-4" style={{ color: accentColor }} />
          </div>
        </div>
      )
    },
    {
      stepNumber: 4,
      title: "Rank the Directions (Eigenvalues)",
      icon: <TrendingUp className="w-6 h-6" />,
      bullets: [
        {
          icon: <TrendingUp className="w-5 h-5" style={{ color: accentColor }} />,
          text: `The top ${nComponents} components explain ${totalVariance}% of variance in ${dataset.name}.`
        },
        {
          icon: <Target className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Use Scree plot (elbow) to choose K."
        },
        {
          icon: <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Cumulative variance target: 90–95%."
        },
        {
          icon: <AlertCircle className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Long tail PCs ≈ noise, safe to drop."
        }
      ],
      chart: (
        <div className="w-full h-full flex items-center justify-center px-4">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={step4Data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Variance %', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Cumulative %', angle: 90, position: 'insideRight', fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }} />
              <Bar yAxisId="left" dataKey="variance" radius={[8, 8, 0, 0]}>
                {step4Data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < nComponents ? accentColor : `${accentColor}66`} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumulative" stroke="#f59e0b" strokeWidth={3} dot={{ fill: '#f59e0b', r: 5 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      ),
      thumbnailPreview: (
        <div className="w-full h-full flex items-center justify-center px-1">
          <div className="flex gap-1 items-end w-full h-full pb-2">
            <div className="flex-1 rounded-t h-10" style={{ backgroundColor: accentColor }}></div>
            <div className="flex-1 rounded-t h-6" style={{ backgroundColor: `${accentColor}99` }}></div>
            <div className="flex-1 rounded-t h-3" style={{ backgroundColor: `${accentColor}66` }}></div>
          </div>
        </div>
      )
    },
    {
      stepNumber: 5,
      title: "Pick Top Components & Important Features",
      icon: <Target className="w-6 h-6" />,
      bullets: [
        {
          icon: <Target className="w-5 h-5" style={{ color: accentColor }} />,
          text: `Feature contributions to top ${nComponents} components.`
        },
        {
          icon: <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />,
          text: `Key features: ${topFeatures.join(', ')}.`
        },
        {
          icon: <Network className="w-5 h-5" style={{ color: accentColor }} />,
          text: "High absolute loading ⇒ important feature."
        },
        {
          icon: <Zap className="w-5 h-5" style={{ color: accentColor }} />,
          text: "Output = key features driving differences."
        }
      ],
      chart: (
        <div className="w-full h-full flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <ScrollArea className="h-[350px] rounded-md border border-slate-700">
              <div className="p-4">
                <div className="grid gap-2 text-xs sticky top-0 bg-slate-900 z-10 pb-2" style={{ gridTemplateColumns: `120px repeat(${nComponents}, 80px)` }}>
                  <div className="p-2 font-semibold text-slate-300">Feature</div>
                  {Array.from({ length: nComponents }, (_, i) => (
                    <div key={i} className="p-2 text-center font-semibold text-slate-300">PC{i + 1}</div>
                  ))}
                </div>
                {step5Data.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid gap-2 text-xs mb-2" style={{ gridTemplateColumns: `120px repeat(${nComponents}, 80px)` }}>
                    <div className="p-2 text-right text-slate-300 font-medium truncate" title={row.feature}>{row.feature}</div>
                    {Array.from({ length: nComponents }, (_, i) => {
                      const value = row[`pc${i + 1}`] as number;
                      const signedValue = row[`pc${i + 1}_signed`] as number;
                      const hexColor = accentColor.replace('#', '');
                      const r = parseInt(hexColor.substr(0, 2), 16);
                      const g = parseInt(hexColor.substr(2, 2), 16);
                      const b = parseInt(hexColor.substr(4, 2), 16);
                      return (
                        <div 
                          key={i}
                          className="rounded-lg p-3 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 cursor-pointer group relative"
                          style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${value})` }}
                          title={`${row.feature} → PC${i + 1}: ${signedValue.toFixed(3)}`}
                        >
                          <span className="text-sm">{(value * 100).toFixed(0)}%</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
              <span>Low Impact</span>
              <div className="flex items-center gap-1">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((opacity) => {
                  const hexColor = accentColor.replace('#', '');
                  const r = parseInt(hexColor.substr(0, 2), 16);
                  const g = parseInt(hexColor.substr(2, 2), 16);
                  const b = parseInt(hexColor.substr(4, 2), 16);
                  return (
                    <div 
                      key={opacity}
                      className="w-6 h-4 rounded"
                      style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` }}
                    />
                  );
                })}
              </div>
              <span>High Impact</span>
            </div>
          </div>
        </div>
      ),
      thumbnailPreview: (
        <div className="w-full h-full flex items-center justify-center p-1">
          <div className="grid grid-cols-3 gap-px w-full h-full">
            {[0.9, 0.3, 0.2, 0.6, 0.7, 0.4, 0.3, 0.8, 0.5].map((opacity, i) => {
              const hexColor = accentColor.replace('#', '');
              const r = parseInt(hexColor.substr(0, 2), 16);
              const g = parseInt(hexColor.substr(2, 2), 16);
              const b = parseInt(hexColor.substr(4, 2), 16);
              return (
                <div key={i} className="rounded-sm" style={{ backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})` }}></div>
              );
            })}
          </div>
        </div>
      )
    }
  ];

  const goToStep = (step: number) => {
    if (step >= 0 && step < steps.length) {
      setCurrentStep(step);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextStep();
      } else if (e.key === 'ArrowLeft') {
        prevStep();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  // Touch navigation
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX.current = e.changedTouches[0].clientX;
      const diff = touchStartX.current - touchEndX.current;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          nextStep();
        } else {
          prevStep();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [currentStep]);

  return (
    <div className="w-full h-full flex items-center justify-center p-3 md:p-6" ref={containerRef}>
      <motion.div 
        className="w-full max-w-[1200px] rounded-[22px] p-4 md:p-8 relative"
        style={{
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: `0 0 60px ${accentColor}33, inset 0 0 40px ${accentColor}20`
        }}
        animate={isTransitioning ? {
          opacity: [1, 0.7, 1]
        } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Live Badge */}
        <motion.div 
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge 
            variant="outline" 
            className="px-3 py-1.5 text-xs backdrop-blur-md border-slate-700"
            style={{ 
              background: 'rgba(15, 23, 42, 0.8)',
              borderColor: accentColor
            }}
          >
            <span className="flex items-center gap-2">
              <Database className="w-3 h-3" style={{ color: accentColor }} />
              <span className="text-slate-300">
                {dataset.emoji} {dataset.name} | {nComponents} Components | {totalVariance}% Variance
              </span>
            </span>
          </Badge>
        </motion.div>

        {/* Header with Progress */}
        <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8">
          <div>
            <h2 className="text-xl md:text-2xl text-slate-100 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              How PCA Decides Which Features Are Important
            </h2>
            <p className="text-xs md:text-sm text-slate-400">
              Step {currentStep + 1} of {steps.length} — {Math.round(((currentStep + 1) / steps.length) * 100)}% complete
            </p>
          </div>
          
          {/* Progress Dots */}
          <div className="flex items-center gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentStep ? accentColor : index < currentStep ? `${accentColor}99` : '#475569',
                  width: index === currentStep ? '2rem' : '0.75rem',
                  height: '0.75rem'
                }}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Thumbnail Navigation */}
        <div className="mb-6 flex items-center justify-center gap-3 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <button
              key={index}
              onClick={() => goToStep(index)}
              className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all duration-300 overflow-hidden ${
                index === currentStep 
                  ? 'ring-2 bg-slate-800/80 scale-105' 
                  : 'bg-slate-800/40 hover:bg-slate-800/60 hover:scale-105'
              }`}
              style={index === currentStep ? { borderColor: accentColor, ringColor: accentColor } : {}}
              aria-label={`Go to Step ${step.stepNumber}: ${step.title}`}
            >
              <div className="w-full h-full p-2">
                {step.thumbnailPreview}
              </div>
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col gap-4">
          {/* Center Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Step Header */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accentColor}30` }}>
                    <div style={{ color: accentColor }}>
                      {steps[currentStep].icon}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Step {steps[currentStep].stepNumber}</p>
                    <h3 className="text-lg md:text-xl text-slate-100" style={{ fontWeight: 600 }}>
                      {steps[currentStep].title}
                    </h3>
                  </div>
                </div>

                {/* Bullets */}
                <motion.div
                  className="space-y-3 mb-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1
                      }
                    }
                  }}
                >
                  {steps[currentStep].bullets.map((bullet, idx) => (
                    <motion.div
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      className="flex items-start gap-3 group"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {bullet.icon}
                      </div>
                      <p className="text-base md:text-lg leading-[150%] text-slate-200" style={{ fontWeight: 500 }}>
                        {bullet.text}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Chart */}
                <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
                  {steps[currentStep].chart}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Data Summary and Navigation */}
        <div className="mt-6 space-y-3">
          {/* Data Summary Button */}
          <Dialog open={showDataSummary} onOpenChange={setShowDataSummary}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                📊 View Dataset Summary
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {dataset.emoji} {dataset.name} Dataset Summary
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Samples</p>
                    <p className="text-2xl font-semibold">{dataset.data.length}</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Features</p>
                    <p className="text-2xl font-semibold">{dataset.features.length}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Features ({dataset.features.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {dataset.features.map((feature, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {dataset.targetNames && (
                  <div>
                    <h4 className="font-semibold mb-2">Classes</h4>
                    <div className="flex flex-wrap gap-2">
                      {dataset.targetNames.map((className, idx) => (
                        <Badge 
                          key={idx}
                          style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                        >
                          {className}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 rounded-lg border">
                  <h4 className="font-semibold mb-1">PCA Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Using {nComponents} components explains <span className="font-semibold" style={{ color: accentColor }}>{totalVariance}%</span> of the variance.
                    This reduces dimensionality from {dataset.features.length} to {nComponents} while preserving most information.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Navigation Arrows */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="w-full md:w-auto bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Previous
            </Button>

            <div className="hidden md:block text-sm text-slate-400" style={{ letterSpacing: '0.5px' }}>
              Use arrow keys or click thumbnails to navigate
            </div>
            
            <div className="md:hidden text-xs text-slate-400 text-center" style={{ letterSpacing: '0.5px' }}>
              Swipe or use arrow keys
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className="w-full md:w-auto bg-slate-800/60 border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PCAStoryGallery;