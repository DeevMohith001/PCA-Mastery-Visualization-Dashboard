import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, ReferenceLine, ComposedChart } from "recharts";
import { Badge } from "./ui/badge";
import { Info, ArrowRight } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import PCAStoryGallery from './PCAStoryGallery';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4'];

interface VisualizationChartsProps {
  pcaResult: any;
  dataset: any;
  featureNames: string[];
}

export function VarianceChart({ explainedVarianceRatio, cumulativeVariance }: { 
  explainedVarianceRatio: number[];
  cumulativeVariance: number[];
}) {
  const data = explainedVarianceRatio.map((variance, index) => ({
    name: `PC${index + 1}`,
    variance: (variance * 100).toFixed(2),
    cumulative: (cumulativeVariance[index] * 100).toFixed(2)
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Explained Variance</CardTitle>
            <CardDescription>How much variance each component captures</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  This chart shows how much of the total variance each principal component captures.
                  The cumulative line shows total variance when combining components. Aim for 80-95% cumulative variance.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Variance (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Individual: <span className="text-indigo-600 dark:text-indigo-400">{payload[0].payload.variance}%</span>
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Cumulative: <span className="text-purple-600 dark:text-purple-400">{payload[0].payload.cumulative}%</span>
                      </p>
                      <p className="text-xs mt-1 text-muted-foreground italic">
                        {parseFloat(payload[0].payload.variance) > 50 ? 
                          "This component captures the majority of variance!" :
                          parseFloat(payload[0].payload.variance) > 20 ?
                          "This is a significant component." :
                          "This component captures less variation."}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar dataKey="variance" fill="#6366f1" name="Individual Variance (%)" />
            <Line type="monotone" dataKey="cumulative" stroke="#8b5cf6" name="Cumulative (%)" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>How to read:</strong> The bars show individual variance per component. 
            The purple line shows cumulative variance—if it reaches 95% at PC3, those 3 components capture 95% of the information.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScreePlot({ eigenvalues }: { eigenvalues: number[] }) {
  const data = eigenvalues.map((value, index) => ({
    name: `PC${index + 1}`,
    eigenvalue: value.toFixed(3),
    index: index + 1
  }));

  // Simple elbow detection (maximum curvature)
  let elbowIndex = 1;
  if (eigenvalues.length > 2) {
    let maxCurvature = 0;
    for (let i = 1; i < eigenvalues.length - 1; i++) {
      const curvature = eigenvalues[i - 1] - 2 * eigenvalues[i] + eigenvalues[i + 1];
      if (curvature > maxCurvature) {
        maxCurvature = curvature;
        elbowIndex = i + 1;
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Scree Plot</CardTitle>
            <CardDescription>Eigenvalues for each component</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  The scree plot helps determine optimal number of components by finding the "elbow"—
                  where the curve flattens. Components after the elbow contribute little variance.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Eigenvalue', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Eigenvalue: <span className="text-indigo-600 dark:text-indigo-400">{payload[0].payload.eigenvalue}</span>
                      </p>
                      {payload[0].payload.index === elbowIndex && (
                        <Badge className="mt-1" variant="outline">Suggested elbow</Badge>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="eigenvalue" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 5 }}
              activeDot={{ r: 7 }}
            />
            <ReferenceLine 
              x={`PC${elbowIndex}`} 
              stroke="#ef4444" 
              strokeDasharray="3 3" 
              label={{ value: 'Elbow', position: 'top' }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            📊 <strong>Elbow detected at PC{elbowIndex}:</strong> Consider using {elbowIndex} components 
            for an optimal balance between dimensionality reduction and information retention.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function PCAScatterPlot({ 
  transformedData, 
  targetValues, 
  targetNames 
}: { 
  transformedData: number[][]; 
  targetValues: (number | string)[];
  targetNames?: string[];
}) {
  if (!transformedData || !transformedData.length) {
    return null;
  }

  const data = transformedData.map((point, index) => ({
    pc1: Number(point[0]) || 0,
    pc2: Number(point[1]) || 0,
    pc1Display: (point[0] || 0).toFixed(3),
    pc2Display: (point[1] || 0).toFixed(3),
    target: targetValues[index],
    label: targetNames ? targetNames[targetValues[index] as number] : `Class ${targetValues[index]}`,
    index
  }));

  const uniqueTargets = Array.from(new Set(targetValues));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>2D PCA Projection</CardTitle>
            <CardDescription>First two principal components</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  This scatter plot projects your data onto the first two principal components (PC1 and PC2),
                  which capture the most variance. Points colored by class show how well PCA separates different groups.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              dataKey="pc1" 
              name="PC1" 
              label={{ value: 'First Principal Component', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="pc2" 
              name="PC2" 
              label={{ value: 'Second Principal Component', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">Sample {data.index}</p>
                      <p className="text-sm text-muted-foreground">Class: {data.label}</p>
                      <p className="text-sm text-muted-foreground">PC1: {data.pc1Display}</p>
                      <p className="text-sm text-muted-foreground">PC2: {data.pc2Display}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {uniqueTargets.map((target, idx) => (
              <Scatter
                key={target}
                name={targetNames ? targetNames[target as number] : `Class ${target}`}
                data={data.filter(d => d.target === target)}
                fill={COLORS[idx % COLORS.length]}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🎯 <strong>Interpretation:</strong> Clusters indicate similar samples. Well-separated clusters mean PCA 
            successfully captures class differences. Overlapping clusters suggest these classes are inherently similar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function LoadingsHeatmap({ 
  loadings, 
  featureNames 
}: { 
  loadings: number[][];
  featureNames: string[];
}) {
  // Prepare data for visualization
  const maxComponents = Math.min(loadings[0]?.length || 0, 5);
  const data = featureNames.slice(0, 10).map((feature, featureIdx) => {
    const row: any = { feature: feature.length > 15 ? feature.slice(0, 15) + '...' : feature };
    for (let compIdx = 0; compIdx < maxComponents; compIdx++) {
      row[`PC${compIdx + 1}`] = loadings[featureIdx]?.[compIdx]?.toFixed(3) || 0;
    }
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Feature Loadings</CardTitle>
            <CardDescription>How features contribute to each component</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Loadings show each feature's contribution to principal components. 
                  High absolute values (near ±1) mean the feature strongly influences that component.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium">Feature</th>
                {Array.from({ length: maxComponents }, (_, i) => (
                  <th key={i} className="text-center p-2 font-medium">PC{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/50">
                  <td className="p-2 text-sm">{row.feature}</td>
                  {Array.from({ length: maxComponents }, (_, i) => {
                    const value = parseFloat(row[`PC${i + 1}`]);
                    const absValue = Math.abs(value);
                    const intensity = Math.min(absValue * 255, 255);
                    const bgColor = value > 0 
                      ? `rgba(99, 102, 241, ${absValue})` 
                      : `rgba(236, 72, 153, ${absValue})`;
                    return (
                      <td 
                        key={i} 
                        className="p-2 text-center text-sm font-mono"
                        style={{ backgroundColor: bgColor, color: absValue > 0.5 ? 'white' : 'inherit' }}
                      >
                        {row[`PC${i + 1}`]}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="p-2 rounded" style={{ backgroundColor: 'rgba(99, 102, 241, 0.7)' }}>
            <p className="text-xs text-white">Positive loading (feature increases with PC)</p>
          </div>
          <div className="p-2 rounded" style={{ backgroundColor: 'rgba(236, 72, 153, 0.7)' }}>
            <p className="text-xs text-white">Negative loading (feature decreases with PC)</p>
          </div>
        </div>
        <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🔍 <strong>Reading loadings:</strong> A loading of 0.9 for "petal_length" on PC1 means PC1 is strongly 
            driven by petal length. High loadings help interpret what each component represents.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 1️⃣ Feature Correlation Heatmap
export function FeatureCorrelationHeatmap({ 
  correlationMatrix, 
  featureNames 
}: { 
  correlationMatrix: number[][];
  featureNames: string[];
}) {
  if (!correlationMatrix || !correlationMatrix.length) {
    return null;
  }

  const maxFeatures = Math.min(featureNames.length, 10);
  const displayFeatures = featureNames.slice(0, maxFeatures);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Feature Correlation Heatmap</CardTitle>
            <CardDescription>Shows how strongly features are correlated</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Correlation values range from -1 to 1. High correlations (near ±1) indicate redundancy 
                  that PCA can eliminate by combining correlated features.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 text-sm">Feature</th>
                {displayFeatures.map((name, i) => (
                  <th key={i} className="text-center p-2 text-xs" title={name}>
                    {name.length > 8 ? name.slice(0, 8) + '...' : name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayFeatures.map((rowName, rowIdx) => (
                <tr key={rowIdx} className="border-b hover:bg-muted/50">
                  <td className="p-2 text-sm" title={rowName}>
                    {rowName.length > 12 ? rowName.slice(0, 12) + '...' : rowName}
                  </td>
                  {displayFeatures.map((_, colIdx) => {
                    const value = correlationMatrix[rowIdx]?.[colIdx] || 0;
                    const absValue = Math.abs(value);
                    const hue = value > 0 ? 220 : 340; // Blue for positive, pink for negative
                    const bgColor = `hsla(${hue}, 70%, 60%, ${absValue})`;
                    return (
                      <td 
                        key={colIdx} 
                        className="p-2 text-center text-xs font-mono"
                        style={{ 
                          backgroundColor: bgColor, 
                          color: absValue > 0.5 ? 'white' : 'inherit' 
                        }}
                        title={`${rowName} vs ${displayFeatures[colIdx]}: ${value.toFixed(3)}`}
                      >
                        {value.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🔗 <strong>Interpretation:</strong> PCA removes redundancy among highly correlated features. 
            Dark cells indicate strong correlations that PCA will capture in fewer components.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 2️⃣ Before vs After PCA Comparison
export function BeforeAfterPCAComparison({ 
  originalData,
  transformedData,
  targetValues,
  targetNames,
  featureNames
}: { 
  originalData: number[][];
  transformedData: number[][];
  targetValues: (number | string)[];
  targetNames?: string[];
  featureNames: string[];
}) {
  if (!originalData || !originalData.length || !transformedData || !transformedData.length) {
    return null;
  }

  // Use first two features for "before" visualization
  const beforeData = originalData.map((point, index) => ({
    x: Number(point[0]) || 0,
    y: Number(point[1]) || 0,
    target: targetValues[index],
    label: targetNames ? targetNames[targetValues[index] as number] : `Class ${targetValues[index]}`,
    index
  }));

  // Use first two PCs for "after" visualization
  const afterData = transformedData.map((point, index) => ({
    x: Number(point[0]) || 0,
    y: Number(point[1]) || 0,
    target: targetValues[index],
    label: targetNames ? targetNames[targetValues[index] as number] : `Class ${targetValues[index]}`,
    index
  }));

  const uniqueTargets = Array.from(new Set(targetValues));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Before vs After PCA</CardTitle>
            <CardDescription>See how PCA rotates and clarifies data structure</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Left shows original features. Right shows data after PCA transformation. 
                  Notice how clusters become clearer along PC1 and PC2.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Before PCA */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-center">Before PCA</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name={featureNames[0] || "Feature 1"}
                  label={{ value: featureNames[0] || "Feature 1", position: 'insideBottom', offset: -5, fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name={featureNames[1] || "Feature 2"}
                  label={{ value: featureNames[1] || "Feature 2", angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                          <p>Sample {data.index}</p>
                          <p className="text-muted-foreground">{data.label}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {uniqueTargets.map((target, idx) => (
                  <Scatter
                    key={target}
                    name={targetNames ? targetNames[target as number] : `Class ${target}`}
                    data={beforeData.filter(d => d.target === target)}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* After PCA */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-center">After PCA</h4>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number" 
                  dataKey="x" 
                  name="PC1"
                  label={{ value: 'PC1 (max variance)', position: 'insideBottom', offset: -5, fontSize: 11 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="y" 
                  name="PC2"
                  label={{ value: 'PC2 (2nd variance)', angle: -90, position: 'insideLeft', fontSize: 11 }}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                          <p>Sample {data.index}</p>
                          <p className="text-muted-foreground">{data.label}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {uniqueTargets.map((target, idx) => (
                  <Scatter
                    key={target}
                    name={targetNames ? targetNames[target as number] : `Class ${target}`}
                    data={afterData.filter(d => d.target === target)}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            ✨ <strong>What changed:</strong> PCA rotates and spreads the data along new directions (PC1, PC2). 
            Notice how clusters become clearer and separation improves in the transformed space.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 3️⃣ Cumulative Explained Variance (Standalone)
export function CumulativeVariancePlot({ 
  cumulativeVariance 
}: { 
  cumulativeVariance: number[];
}) {
  const data = cumulativeVariance.map((variance, index) => ({
    name: `PC${index + 1}`,
    cumulative: (variance * 100).toFixed(2),
    threshold95: 95,
    index: index + 1
  }));

  const recommended = cumulativeVariance.findIndex(v => v >= 0.95) + 1;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Cumulative Explained Variance</CardTitle>
            <CardDescription>Total variance retained vs. number of components</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Shows cumulative variance as you add more components. 
                  Select enough PCs to reach about 95% variance coverage.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Cumulative Variance (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.name}</p>
                      <p className="text-sm text-purple-600 dark:text-purple-400">
                        Cumulative: {payload[0].payload.cumulative}%
                      </p>
                      {payload[0].payload.index === recommended && (
                        <Badge className="mt-1" variant="outline">Recommended</Badge>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine y={95} stroke="#10b981" strokeDasharray="3 3" label={{ value: '95% threshold', position: 'right' }} />
            <Line 
              type="monotone" 
              dataKey="cumulative" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            📈 <strong>Recommendation:</strong> Use {recommended > 0 ? recommended : 'all'} component{recommended !== 1 ? 's' : ''} 
            to capture 95% of variance—a good balance between compression and information retention.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 5️⃣ Enhanced Loading Plot with PC Combinations
export function EnhancedLoadingPlot({ 
  loadings, 
  featureNames 
}: { 
  loadings: number[][];
  featureNames: string[];
}) {
  if (!loadings || !loadings.length || !loadings[0]) {
    return null;
  }

  const maxFeatures = Math.min(featureNames.length, 8);
  const maxComponents = Math.min(loadings[0]?.length || 0, 3);

  // Calculate PC combinations
  const data = featureNames.slice(0, maxFeatures).map((feature, featureIdx) => {
    const row: any = { 
      feature: feature.length > 15 ? feature.slice(0, 15) + '...' : feature,
      fullName: feature
    };
    
    // Individual PCs
    for (let compIdx = 0; compIdx < maxComponents; compIdx++) {
      row[`PC${compIdx + 1}`] = Math.abs(loadings[featureIdx]?.[compIdx] || 0);
    }
    
    // PC combinations
    if (maxComponents >= 2) {
      row['PC1+PC2'] = Math.sqrt(
        Math.pow(loadings[featureIdx]?.[0] || 0, 2) + 
        Math.pow(loadings[featureIdx]?.[1] || 0, 2)
      );
    }
    if (maxComponents >= 3) {
      row['PC2+PC3'] = Math.sqrt(
        Math.pow(loadings[featureIdx]?.[1] || 0, 2) + 
        Math.pow(loadings[featureIdx]?.[2] || 0, 2)
      );
    }
    
    return row;
  });

  const pcKeys: string[] = [];
  for (let i = 0; i < maxComponents; i++) {
    pcKeys.push(`PC${i + 1}`);
  }
  if (maxComponents >= 2) pcKeys.push('PC1+PC2');
  if (maxComponents >= 3) pcKeys.push('PC2+PC3');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Feature Contribution (Loading Plot)</CardTitle>
            <CardDescription>Including PC combinations (PC1+PC2), (PC2+PC3)</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Displays how much each feature contributes to PCs. Combinations like PC1+PC2 
                  show overall influence across multiple components. High values mean stronger influence.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" label={{ value: 'Loading Magnitude', position: 'insideBottom', offset: -5 }} />
            <YAxis type="category" dataKey="feature" width={100} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.fullName}</p>
                      {payload.map((entry: any, idx: number) => (
                        <p key={idx} className="text-sm" style={{ color: entry.color }}>
                          {entry.name}: {(entry.value as number).toFixed(3)}
                        </p>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {pcKeys.map((key, idx) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={COLORS[idx % COLORS.length]} 
                name={key}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🎯 <strong>How to read:</strong> Each bar shows feature contribution. PC1+PC2 and PC2+PC3 
            combinations reveal overall feature importance across multiple dimensions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 6️⃣ Biplot (Samples + Features Together)
export function Biplot({ 
  transformedData,
  loadings,
  targetValues,
  targetNames,
  featureNames
}: { 
  transformedData: number[][];
  loadings: number[][];
  targetValues: (number | string)[];
  targetNames?: string[];
  featureNames: string[];
}) {
  if (!transformedData || !transformedData.length || !loadings || !loadings.length) {
    return null;
  }

  // Sample points
  const sampleData = transformedData.map((point, index) => ({
    pc1: Number(point[0]) || 0,
    pc2: Number(point[1]) || 0,
    pc1Display: (point[0] || 0).toFixed(3),
    pc2Display: (point[1] || 0).toFixed(3),
    target: targetValues[index],
    label: targetNames ? targetNames[targetValues[index] as number] : `Class ${targetValues[index]}`,
    index,
    type: 'sample'
  }));

  const uniqueTargets = Array.from(new Set(targetValues));

  // Feature vectors (scaled for visibility)
  const scale = 3; // Scale factor for arrow visibility
  const maxFeatures = Math.min(featureNames.length, 8);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Biplot (Samples + Features)</CardTitle>
            <CardDescription>Arrows show feature influence on PC1 and PC2</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Points = samples, Arrows = feature directions. Arrow length and direction 
                  show how features influence PC1 and PC2. Long arrows = strong influence.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              type="number" 
              dataKey="pc1" 
              name="PC1"
              label={{ value: 'PC1', position: 'insideBottom', offset: -5 }}
            />
            <YAxis 
              type="number" 
              dataKey="pc2" 
              name="PC2"
              label={{ value: 'PC2', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.label || data.feature}</p>
                      <p className="text-sm text-muted-foreground">PC1: {data.pc1Display || data.pc1?.toFixed(3)}</p>
                      <p className="text-sm text-muted-foreground">PC2: {data.pc2Display || data.pc2?.toFixed(3)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            {uniqueTargets.map((target, idx) => (
              <Scatter
                key={target}
                name={targetNames ? targetNames[target as number] : `Class ${target}`}
                data={sampleData.filter(d => d.target === target)}
                fill={COLORS[idx % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        
        {/* Feature arrows overlay */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-muted rounded">
            <p className="font-semibold mb-1">Feature Vectors (→):</p>
            {featureNames.slice(0, maxFeatures).map((name, idx) => {
              const pc1 = (loadings[idx]?.[0] || 0) * scale;
              const pc2 = (loadings[idx]?.[1] || 0) * scale;
              const magnitude = Math.sqrt(pc1 * pc1 + pc2 * pc2);
              return (
                <p key={idx} className="text-muted-foreground">
                  {name.slice(0, 12)}: ({pc1.toFixed(2)}, {pc2.toFixed(2)}) 
                  <span className="ml-1 text-xs">|{magnitude.toFixed(2)}|</span>
                </p>
              );
            })}
          </div>
          <div className="p-2 bg-muted rounded">
            <p className="font-semibold mb-1">Interpretation:</p>
            <p className="text-muted-foreground">• Long arrows = features strongly influence PCs</p>
            <p className="text-muted-foreground">• Arrow direction = how feature affects PC space</p>
            <p className="text-muted-foreground">• Close arrows = correlated features</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🎨 <strong>Reading the Biplot:</strong> This combines sample positions with feature influence vectors. 
            Helps interpret relationships using PC1, PC2, and their combination (PC1+PC2).
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 7️⃣ Pairwise PC Scatter Matrix
export function PairwisePCScatterMatrix({ 
  transformedData,
  targetValues,
  targetNames
}: { 
  transformedData: number[][];
  targetValues: (number | string)[];
  targetNames?: string[];
}) {
  if (!transformedData || !transformedData.length) {
    return null;
  }

  const maxComponents = Math.min(transformedData[0]?.length || 0, 3);
  const uniqueTargets = Array.from(new Set(targetValues));

  // Create pairs: PC1 vs PC2, PC1 vs PC3, PC2 vs PC3
  const pairs: Array<{ xIdx: number; yIdx: number; xLabel: string; yLabel: string }> = [];
  if (maxComponents >= 2) {
    pairs.push({ xIdx: 0, yIdx: 1, xLabel: 'PC1', yLabel: 'PC2' });
  }
  if (maxComponents >= 3) {
    pairs.push({ xIdx: 0, yIdx: 2, xLabel: 'PC1', yLabel: 'PC3' });
    pairs.push({ xIdx: 1, yIdx: 2, xLabel: 'PC2', yLabel: 'PC3' });
  }

  if (pairs.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Pairwise PC Scatter Matrix</CardTitle>
            <CardDescription>Relationships between components: PC1 vs PC2, PC1 vs PC3, PC2+PC3</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Each mini-plot shows relationships between component pairs. 
                  Reveals cluster separation across different PC combinations.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`grid gap-4 ${pairs.length === 1 ? 'grid-cols-1' : pairs.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {pairs.map((pair, pairIdx) => {
            const data = transformedData.map((point, index) => ({
              x: Number(point[pair.xIdx]) || 0,
              y: Number(point[pair.yIdx]) || 0,
              target: targetValues[index],
              label: targetNames ? targetNames[targetValues[index] as number] : `Class ${targetValues[index]}`,
              index
            }));

            return (
              <div key={pairIdx}>
                <h4 className="text-sm font-semibold mb-2 text-center">
                  {pair.xLabel} vs {pair.yLabel}
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis 
                      type="number" 
                      dataKey="x" 
                      name={pair.xLabel}
                      label={{ value: pair.xLabel, position: 'insideBottom', offset: -5, fontSize: 11 }}
                    />
                    <YAxis 
                      type="number" 
                      dataKey="y" 
                      name={pair.yLabel}
                      label={{ value: pair.yLabel, angle: -90, position: 'insideLeft', fontSize: 11 }}
                    />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                              <p>Sample {data.index}</p>
                              <p className="text-muted-foreground">{data.label}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {uniqueTargets.map((target, idx) => (
                      <Scatter
                        key={target}
                        name={targetNames ? targetNames[target as number] : `Class ${target}`}
                        data={data.filter(d => d.target === target)}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-pink-50 dark:bg-pink-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🔍 <strong>Cluster Exploration:</strong> Each plot reveals different perspectives of your data. 
            PC2+PC3 can show separation not visible in PC1 vs PC2 alone.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// 8️⃣ 3D PCA Scatter Plot (Simulated with perspective)
export function ThreeDPCAPlot({ 
  transformedData,
  targetValues,
  targetNames
}: { 
  transformedData: number[][];
  targetValues: (number | string)[];
  targetNames?: string[];
}) {
  if (!transformedData || !transformedData.length) {
    return null;
  }

  const has3D = transformedData[0]?.length >= 3;
  
  if (!has3D) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>3D PCA Scatter Plot</CardTitle>
          <CardDescription>Requires at least 3 components</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Increase the number of components to 3 or more to view the 3D projection.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Create multiple 2D projections to simulate 3D
  const uniqueTargets = Array.from(new Set(targetValues));

  const projections = [
    { x: 0, y: 1, title: 'PC1 vs PC2' },
    { x: 0, y: 2, title: 'PC1 vs PC3' },
    { x: 1, y: 2, title: 'PC2 vs PC3' }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>3D PCA Scatter Plot</CardTitle>
            <CardDescription>Sample spread in 3D space (PC1, PC2, PC3)</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Multiple 2D projections simulate 3D space. Shows how PCA captures 
                  structure and separation across three principal components.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projections.map((proj, idx) => {
            const data = transformedData.map((point, index) => ({
              x: Number(point[proj.x]) || 0,
              y: Number(point[proj.y]) || 0,
              z: Number(point[2]) || 0,
              target: targetValues[index],
              label: targetNames ? targetNames[targetValues[index] as number] : `Class ${targetValues[index]}`,
              index
            }));

            return (
              <div key={idx}>
                <h4 className="text-xs font-semibold mb-1 text-center">{proj.title}</h4>
                <ResponsiveContainer width="100%" height={200}>
                  <ScatterChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" dataKey="x" hide />
                    <YAxis type="number" dataKey="y" hide />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-background border rounded-lg p-2 shadow-lg text-xs">
                              <p>Sample {data.index}</p>
                              <p className="text-muted-foreground">{data.label}</p>
                              <p className="text-muted-foreground">PC3: {data.z?.toFixed(2)}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {uniqueTargets.map((target, tidx) => (
                      <Scatter
                        key={target}
                        data={data.filter(d => d.target === target)}
                        fill={COLORS[tidx % COLORS.length]}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            );
          })}
        </div>
        <div className="mt-4 p-3 bg-violet-50 dark:bg-violet-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            🌐 <strong>3D Perspective:</strong> Three views reveal the complete 3D structure. 
            Highlights how PCA captures data organization and class separation across all three dimensions.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReconstructionErrorChart({ reconstructionError }: { reconstructionError: number[] }) {
  const data = reconstructionError.map((error, index) => ({
    components: index + 1,
    error: (error * 100).toFixed(2),
    retained: ((1 - error) * 100).toFixed(2)
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Reconstruction Error</CardTitle>
            <CardDescription>Information loss vs. number of components</CardDescription>
          </div>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">
                  Shows the trade-off between dimensionality reduction and information loss. 
                  Lower error means better reconstruction of original data.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="components" label={{ value: 'Number of Components', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Error (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{payload[0].payload.components} Components</p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Error: {payload[0].payload.error}%
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Retained: {payload[0].payload.retained}%
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="error" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Trade-off:</strong> More components = less error but higher dimensionality. 
            Find the sweet spot where error is acceptable for your use case.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function VisualizationCharts({ pcaResult, dataset, featureNames }: VisualizationChartsProps) {
  if (!pcaResult) {
    return null;
  }

  // Extract number of components from the PCA result
  const nComponents = pcaResult.components.length;

  return (
    <div className="space-y-6">
      {/* PCA Story Gallery - Educational Panel */}
      <div 
        className="w-full min-h-[700px] rounded-2xl flex items-center justify-center"
        style={{ 
          background: 'linear-gradient(135deg, #0A1B2B 0%, #0f2942 100%)'
        }}
        id="visualizations-section"
      >
        <PCAStoryGallery 
          dataset={dataset}
          pcaResult={pcaResult}
          nComponents={nComponents}
        />
      </div>
    </div>
  );
}
