import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataStatisticsProps {
  dataset: any;
}

export function DataStatistics({ dataset }: DataStatisticsProps) {
  // Calculate basic statistics for each feature
  const calculateStats = (featureIdx: number) => {
    const values = dataset.data.map((row: number[]) => row[featureIdx]);
    const mean = values.reduce((a: number, b: number) => a + b, 0) / values.length;
    const sorted = [...values].sort((a: number, b: number) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const median = sorted[Math.floor(sorted.length / 2)];
    const variance = values.reduce((sum: number, val: number) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const std = Math.sqrt(variance);
    
    return { mean, median, min, max, std };
  };

  // Get class distribution
  const getClassDistribution = () => {
    const counts = new Map();
    dataset.targetValues.forEach((val: any) => {
      counts.set(val, (counts.get(val) || 0) + 1);
    });
    
    return Array.from(counts.entries()).map(([classVal, count]) => ({
      name: dataset.targetNames ? dataset.targetNames[classVal as number] : `Class ${classVal}`,
      count: count as number,
      percentage: ((count as number / dataset.targetValues.length) * 100).toFixed(1)
    }));
  };

  const classDistribution = getClassDistribution();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Class Distribution</CardTitle>
          <CardDescription>Balance of target classes in the dataset</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={classDistribution}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-lg p-3 shadow-lg">
                        <p className="font-semibold">{payload[0].payload.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Count: {payload[0].payload.count} ({payload[0].payload.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex flex-wrap gap-2">
            {classDistribution.map((cls, idx) => (
              <Badge key={idx} variant="outline">
                {cls.name}: {cls.count} samples ({cls.percentage}%)
              </Badge>
            ))}
          </div>
          {classDistribution.length > 0 && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">
                {Math.max(...classDistribution.map(c => c.count)) / Math.min(...classDistribution.map(c => c.count)) > 1.5 
                  ? "⚠️ Class imbalance detected. Consider this when interpreting PCA results."
                  : "✅ Classes are reasonably balanced."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Statistics</CardTitle>
          <CardDescription>Summary statistics for each feature</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-medium">Feature</th>
                  <th className="text-right p-2 font-medium">Mean</th>
                  <th className="text-right p-2 font-medium">Std</th>
                  <th className="text-right p-2 font-medium">Min</th>
                  <th className="text-right p-2 font-medium">Max</th>
                </tr>
              </thead>
              <tbody>
                {dataset.features.map((feature: string, idx: number) => {
                  const stats = calculateStats(idx);
                  return (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2">{feature}</td>
                      <td className="p-2 text-right font-mono text-xs">{stats.mean.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono text-xs">{stats.std.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono text-xs">{stats.min.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono text-xs">{stats.max.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Why this matters:</strong> Large differences in feature ranges (e.g., one feature 0-1, another 0-1000) 
              can dominate PCA. Standardization scales all features to comparable ranges, ensuring fair contribution.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
