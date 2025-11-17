// Test component to verify scatter plots work
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const testData = [
  { x: 1, y: 2, class: 'A' },
  { x: 2, y: 3, class: 'A' },
  { x: 3, y: 1, class: 'B' },
  { x: 4, y: 4, class: 'B' },
];

const classAData = testData.filter(d => d.class === 'A');
const classBData = testData.filter(d => d.class === 'B');

export function TestScatter() {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Scatter Plot</h1>
      <ResponsiveContainer width={400} height={300}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Legend />
          <Scatter name="Class A" data={classAData} fill="#8884d8" />
          <Scatter name="Class B" data={classBData} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
