import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogOverlay, DialogPortal } from "./ui/dialog";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Copy, ExternalLink, BookOpen, Code, Lightbulb } from "lucide-react";
import { useState } from "react";

interface AlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
  nComponents?: number;
  normalize?: boolean;
  solver?: string;
}

export function AlgorithmModal({ isOpen, onClose, nComponents = 3, normalize = true, solver = "auto" }: AlgorithmModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPseudo, setCopiedPseudo] = useState(false);

  const copyToClipboard = (text: string, type: 'code' | 'pseudo') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedPseudo(true);
      setTimeout(() => setCopiedPseudo(false), 2000);
    }
  };

  const pythonCode = `from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np

# Step 1: Standardize the data${normalize ? ' (enabled)' : ' (disabled)'}
${normalize ? 'scaler = StandardScaler()\nX_scaled = scaler.fit_transform(X)' : 'X_scaled = X'}

# Step 2: Initialize PCA
pca = PCA(
    n_components=${nComponents},
    whiten=${normalize},
    svd_solver='${solver}'
)

# Step 3: Fit and transform
X_pca = pca.fit_transform(X_scaled)

# Step 4: Access results
explained_variance = pca.explained_variance_
variance_ratio = pca.explained_variance_ratio_
components = pca.components_
cumulative_variance = np.cumsum(variance_ratio)

print(f"Variance explained: {variance_ratio}")
print(f"Cumulative variance: {cumulative_variance}")`;

  const pseudoCode = `Algorithm: Principal Component Analysis (PCA)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Input: Data matrix X (n × p), number of components k
Output: Transformed data Z (n × k), components matrix V

1. Center the data:
   μ ← mean(X, axis=0)
   X' ← X - μ
   
2. Standardize (if normalize=true):
   σ ← std(X', axis=0)
   X_std ← X' / σ
   
3. Compute covariance matrix:
   Cov ← (1/(n-1)) × X_std^T × X_std
   
4. Eigendecomposition or SVD:
   [V, Λ] ← eig(Cov)  or  [U, Σ, V] ← svd(X_std)
   where V contains eigenvectors (principal components)
   and Λ contains eigenvalues (variance amounts)
   
5. Sort by eigenvalues:
   idx ← argsort(Λ, descending=true)
   V_sorted ← V[idx]
   Λ_sorted ← Λ[idx]
   
6. Select top k components:
   V_k ← V_sorted[:k]
   
7. Project data onto components:
   Z ← X_std × V_k
   
8. Compute explained variance:
   variance_ratio ← Λ_sorted / sum(Λ)
   cumulative_variance ← cumsum(variance_ratio)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Complexity: O(min(n³, p³)) for full SVD
           O(npk) for randomized SVD (large datasets)`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-500" />
            Understanding the PCA Algorithm
          </DialogTitle>
          <DialogDescription>
            A comprehensive guide to how Principal Component Analysis works under the hood
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="steps">Algorithm</TabsTrigger>
            <TabsTrigger value="implementation">Code</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                What is PCA?
              </h3>
              <p className="text-muted-foreground mb-4">
                Principal Component Analysis (PCA) is a dimensionality reduction technique that transforms your data into a new coordinate system where the axes (principal components) capture the maximum variance in your data.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="font-medium mb-2">🎯 Simple Analogy:</p>
                <p className="text-sm text-muted-foreground">
                  Imagine photographing a 3D object. PCA finds the best camera angle that captures the most detail. If you have a cloud of 3D points, PCA finds the 2D plane that shows the most variation when you project the points onto it—like finding the best "shadow" that preserves the shape.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-3">Why Use PCA?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-950">Benefits</Badge>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Reduces data dimensions for visualization</li>
                    <li>Removes noise and redundant features</li>
                    <li>Speeds up machine learning algorithms</li>
                    <li>Reveals hidden patterns and correlations</li>
                    <li>Helps with data compression</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <Badge variant="outline" className="bg-amber-50 dark:bg-amber-950">Limitations</Badge>
                  <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                    <li>Assumes linear relationships</li>
                    <li>Sensitive to feature scaling</li>
                    <li>Components may lose interpretability</li>
                    <li>Doesn't work well with non-linear data</li>
                    <li>Requires dense matrices (memory intensive)</li>
                  </ul>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="steps" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">Step-by-Step Algorithm</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: "Center the Data",
                    equation: "X' = X - μ",
                    description: "Subtract the mean of each feature to focus on variation around zero. This ensures PCA captures variance, not just magnitude.",
                    example: "If feature 'height' has mean 170cm, we subtract 170 from all values."
                  },
                  {
                    step: 2,
                    title: "Standardize (Optional)",
                    equation: "X_std = (X' - μ) / σ",
                    description: `Scale features to unit variance ${normalize ? '(enabled in your settings)' : '(disabled)'}. This prevents features with large ranges from dominating the analysis.`,
                    example: "Age (0-100) and salary ($20k-$200k) would have equal influence after scaling."
                  },
                  {
                    step: 3,
                    title: "Compute Covariance Matrix",
                    equation: "Cov = (1/(n-1)) × X^T × X",
                    description: "Measure how features vary together. High covariance means features are correlated.",
                    example: "Height and weight typically have positive covariance—tall people tend to weigh more."
                  },
                  {
                    step: 4,
                    title: "Eigendecomposition / SVD",
                    equation: "Cov = V Λ V^T",
                    description: "Find eigenvectors (directions of maximum variance) and eigenvalues (amount of variance). We use Singular Value Decomposition for numerical stability.",
                    example: "Eigenvectors point along the principal axes; eigenvalues tell us how spread out data is along each axis."
                  },
                  {
                    step: 5,
                    title: "Sort Components",
                    equation: "Λ_sorted = sort(Λ, descending)",
                    description: "Order components by variance—PC1 captures the most variance, PC2 the second most, etc.",
                    example: "PC1 might capture 70% variance, PC2 20%, PC3 8%, PC4 2%."
                  },
                  {
                    step: 6,
                    title: "Select Components",
                    equation: `V_k = V[:${nComponents}]`,
                    description: `Keep the top k=${nComponents} components. The rest are discarded as noise.`,
                    example: "Keeping 3 components might retain 95% of variance while reducing 10 features to 3."
                  },
                  {
                    step: 7,
                    title: "Project Data",
                    equation: "Z = X_std × V_k",
                    description: "Transform data into the new coordinate system defined by principal components.",
                    example: "Each data point gets new coordinates along PC1, PC2, ..., PC_k axes."
                  }
                ].map((item) => (
                  <div key={item.step} className="border-l-4 border-indigo-500 pl-4">
                    <div className="flex items-start gap-3">
                      <Badge className="mt-1">{item.step}</Badge>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <code className="text-sm bg-muted px-2 py-1 rounded block my-2 font-mono">
                          {item.equation}
                        </code>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <p className="text-xs text-muted-foreground italic">
                          💡 {item.example}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-3">Pseudocode</h3>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre">
                  {pseudoCode}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pseudoCode, 'pseudo')}
                >
                  {copiedPseudo ? '✓ Copied!' : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="implementation" className="space-y-4">
            <Card className="p-6">
              <h3 className="flex items-center gap-2 mb-4">
                <Code className="w-5 h-5" />
                Implementation in scikit-learn
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                This dashboard uses a JavaScript implementation for educational purposes, but in production you would typically use scikit-learn's optimized PCA class. Here's how your current settings would translate:
              </p>
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  {pythonCode}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(pythonCode, 'code')}
                >
                  {copiedCode ? '✓ Copied!' : <><Copy className="w-3 h-3 mr-1" /> Copy</>}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-3">Your Current Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Components:</span>
                    <Badge variant="secondary">{nComponents}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Normalize:</span>
                    <Badge variant={normalize ? "default" : "outline"}>{normalize ? 'Yes' : 'No'}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Solver:</span>
                    <Badge variant="outline">{solver}</Badge>
                  </div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Solver Choice:</strong> {solver === 'auto' ? 
                      'Automatically selects full SVD for small datasets or randomized SVD for large ones.' : 
                      `Using ${solver} solver for eigendecomposition.`}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-3">Computational Complexity</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <Badge variant="outline">Full SVD</Badge>
                  <div>
                    <p className="font-mono text-xs">O(min(n³, p³))</p>
                    <p className="text-muted-foreground">where n = samples, p = features. Exact but slow for large datasets.</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="outline">Randomized SVD</Badge>
                  <div>
                    <p className="font-mono text-xs">O(npk + k²(n+p))</p>
                    <p className="text-muted-foreground">Much faster for large datasets, slightly approximate. Used when n, p {' > '} 500 and k {'<'} 0.8×min(n,p).</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">How PCA Reduces Noise</h3>
              <p className="text-sm text-muted-foreground mb-4">
                PCA assumes that true signal has high variance while noise has low variance. By keeping only high-variance components and discarding low-variance ones, we filter out noise.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 p-4 rounded-lg">
                <p className="text-sm">
                  <strong>Example:</strong> In image compression, the first few PCs capture the main shapes and structures (high variance), while later PCs capture pixel noise and details (low variance). JPEG compression uses similar principles.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Practical Use Cases</h3>
              <div className="grid gap-4">
                {[
                  {
                    title: "🧬 Genomics",
                    desc: "Analyze gene expression data with thousands of genes. PCA reduces to 2-3 components for visualization, revealing sample clusters (e.g., diseased vs. healthy)."
                  },
                  {
                    title: "🖼️ Image Compression",
                    desc: "Compress images by keeping top PCs. An image with 1000 pixels can be represented by 100 components with minimal quality loss."
                  },
                  {
                    title: "💹 Finance",
                    desc: "Analyze correlations between stock prices. PCA reveals market factors—PC1 might represent overall market movement, PC2 sector-specific trends."
                  },
                  {
                    title: "🤖 Machine Learning Preprocessing",
                    desc: "Speed up training by reducing features. A neural network on 100 features might train 10x faster with 10 PCA components."
                  },
                  {
                    title: "📊 Data Visualization",
                    desc: "Visualize high-dimensional data in 2D/3D. See clusters, outliers, and patterns invisible in raw feature space."
                  }
                ].map((useCase, idx) => (
                  <div key={idx} className="border-l-2 border-indigo-300 dark:border-indigo-700 pl-4">
                    <h4 className="font-medium mb-1">{useCase.title}</h4>
                    <p className="text-sm text-muted-foreground">{useCase.desc}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">When NOT to Use PCA</h3>
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-sm">
                    <strong>Non-linear data:</strong> PCA only captures linear relationships. For Swiss roll or circular patterns, use t-SNE, UMAP, or kernel PCA instead.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm">
                    <strong>Interpretability matters:</strong> Principal components are linear combinations of all features, making them hard to interpret. If you need explainable features, use feature selection instead.
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-950 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
                  <p className="text-sm">
                    <strong>Sparse data:</strong> PCA creates dense components even from sparse input, losing computational efficiency. Consider truncated SVD for sparse matrices.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">Why SVD Over Eigendecomposition?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                While PCA is mathematically defined using eigendecomposition of the covariance matrix, modern implementations use Singular Value Decomposition (SVD) for several reasons:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <Badge className="h-6">1</Badge>
                  <p><strong>Numerical Stability:</strong> SVD is more stable when features are highly correlated or when the covariance matrix is near-singular.</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="h-6">2</Badge>
                  <p><strong>Efficiency:</strong> SVD can be computed directly on the data matrix X without forming the covariance matrix, saving memory.</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="h-6">3</Badge>
                  <p><strong>Randomized Algorithms:</strong> Randomized SVD allows fast approximation for very large datasets.</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Impact of Whitening</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Whitening (whiten=True) additionally scales principal components by 1/√eigenvalue, making all components have unit variance. This decorrelates the data completely.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Badge variant="outline" className="mb-2">Without Whitening</Badge>
                  <p className="text-muted-foreground">PC1 might have large values, PC2 smaller—reflects original variance structure.</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-2">With Whitening</Badge>
                  <p className="text-muted-foreground">All PCs have equal variance—useful for algorithms assuming spherical distributions (e.g., ICA).</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Kernel PCA for Non-linear Data</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Standard PCA only finds linear combinations. Kernel PCA applies the "kernel trick" to find non-linear principal components.
              </p>
              <code className="block bg-muted p-3 rounded text-xs font-mono">
                from sklearn.decomposition import KernelPCA<br/>
                kpca = KernelPCA(n_components=2, kernel='rbf')<br/>
                X_kpca = kpca.fit_transform(X)
              </code>
              <p className="text-xs text-muted-foreground mt-2">
                Common kernels: 'linear' (equivalent to PCA), 'poly' (polynomial), 'rbf' (radial basis function), 'sigmoid'
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Learn More</h3>
              <div className="space-y-2">
                <a 
                  href="https://scikit-learn.org/stable/modules/generated/sklearn.decomposition.PCA.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  scikit-learn PCA Documentation
                </a>
                <a 
                  href="https://en.wikipedia.org/wiki/Principal_component_analysis" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Wikipedia: Principal Component Analysis
                </a>
                <a 
                  href="https://arxiv.org/abs/1404.1100" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Tutorial on Principal Component Analysis (PDF)
                </a>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
