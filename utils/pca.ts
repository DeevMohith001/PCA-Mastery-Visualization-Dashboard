// PCA Implementation in TypeScript
export interface PCAResult {
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

// Matrix operations
function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function multiply(a: number[][], b: number[][]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < a[0].length; k++) {
        sum += a[i][k] * b[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function mean(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function std(arr: number[], meanVal: number): number {
  const variance = arr.reduce((sum, val) => sum + Math.pow(val - meanVal, 2), 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

// Standardize data (zero mean, unit variance)
function standardize(data: number[][], normalize: boolean): { 
  standardized: number[][]; 
  means: number[]; 
  stds: number[]; 
} {
  const nSamples = data.length;
  const nFeatures = data[0].length;
  const means: number[] = [];
  const stds: number[] = [];
  
  // Calculate mean for each feature
  for (let j = 0; j < nFeatures; j++) {
    const featureValues = data.map(row => row[j]);
    means[j] = mean(featureValues);
    stds[j] = normalize ? std(featureValues, means[j]) : 1;
  }
  
  // Center and scale data
  const standardized = data.map(row => 
    row.map((val, j) => (val - means[j]) / stds[j])
  );
  
  return { standardized, means, stds };
}

// Compute covariance matrix
function covarianceMatrix(data: number[][]): number[][] {
  const nSamples = data.length;
  const nFeatures = data[0].length;
  const cov: number[][] = Array(nFeatures).fill(0).map(() => Array(nFeatures).fill(0));
  
  for (let i = 0; i < nFeatures; i++) {
    for (let j = 0; j < nFeatures; j++) {
      let sum = 0;
      for (let k = 0; k < nSamples; k++) {
        sum += data[k][i] * data[k][j];
      }
      cov[i][j] = sum / (nSamples - 1);
    }
  }
  
  return cov;
}

// Compute correlation matrix
function correlationMatrix(data: number[][]): number[][] {
  const nSamples = data.length;
  const nFeatures = data[0].length;
  const corr: number[][] = Array(nFeatures).fill(0).map(() => Array(nFeatures).fill(0));
  
  // Calculate means and standard deviations
  const means: number[] = [];
  const stds: number[] = [];
  for (let j = 0; j < nFeatures; j++) {
    const featureValues = data.map(row => row[j]);
    means[j] = mean(featureValues);
    stds[j] = std(featureValues, means[j]);
  }
  
  // Calculate correlation coefficients
  for (let i = 0; i < nFeatures; i++) {
    for (let j = 0; j < nFeatures; j++) {
      if (i === j) {
        corr[i][j] = 1;
      } else {
        let sum = 0;
        for (let k = 0; k < nSamples; k++) {
          sum += ((data[k][i] - means[i]) / stds[i]) * ((data[k][j] - means[j]) / stds[j]);
        }
        corr[i][j] = sum / (nSamples - 1);
      }
    }
  }
  
  return corr;
}

// Simplified SVD using power iteration (for educational purposes)
// In production, you'd use a proper numerical library
function simplifiedSVD(matrix: number[][], nComponents: number): {
  eigenvalues: number[];
  eigenvectors: number[][];
} {
  const n = matrix.length;
  const eigenvalues: number[] = [];
  const eigenvectors: number[][] = [];
  
  // Power iteration for each component
  for (let comp = 0; comp < Math.min(nComponents, n); comp++) {
    let v = Array(n).fill(0).map(() => Math.random());
    let eigenvalue = 0;
    
    // Normalize initial vector
    const norm = Math.sqrt(v.reduce((sum, val) => sum + val * val, 0));
    v = v.map(val => val / norm);
    
    // Power iteration
    for (let iter = 0; iter < 100; iter++) {
      const Av = Array(n).fill(0);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          Av[i] += matrix[i][j] * v[j];
        }
      }
      
      // Orthogonalize against previous eigenvectors
      for (let prevComp = 0; prevComp < comp; prevComp++) {
        const dot = Av.reduce((sum, val, i) => sum + val * eigenvectors[prevComp][i], 0);
        for (let i = 0; i < n; i++) {
          Av[i] -= dot * eigenvectors[prevComp][i];
        }
      }
      
      const newNorm = Math.sqrt(Av.reduce((sum, val) => sum + val * val, 0));
      eigenvalue = newNorm;
      v = Av.map(val => val / (newNorm + 1e-10));
    }
    
    eigenvalues.push(eigenvalue);
    eigenvectors.push(v);
  }
  
  return { eigenvalues, eigenvectors };
}

export function performPCA(
  data: number[][], 
  nComponents: number, 
  normalize: boolean = true
): PCAResult {
  // Step 1: Standardize data
  const { standardized, means, stds } = standardize(data, normalize);
  
  // Step 2: Compute correlation matrix from original data
  const corrMatrix = correlationMatrix(data);
  
  // Step 3: Compute covariance matrix
  const cov = covarianceMatrix(standardized);
  
  // Step 4: Compute eigenvalues and eigenvectors
  const { eigenvalues, eigenvectors } = simplifiedSVD(cov, nComponents);
  
  // Step 5: Sort by eigenvalues (already sorted from SVD)
  const totalVariance = eigenvalues.reduce((a, b) => a + b, 0);
  const explainedVarianceRatio = eigenvalues.map(ev => ev / totalVariance);
  const cumulativeVariance = explainedVarianceRatio.reduce((acc: number[], val, i) => {
    acc.push(i === 0 ? val : acc[i - 1] + val);
    return acc;
  }, []);
  
  // Step 6: Project data onto principal components
  const components = transpose(eigenvectors);
  const transformedData = standardized.map(row => {
    return components.map(component => {
      return row.reduce((sum, val, i) => sum + val * component[i], 0);
    });
  });
  
  // Calculate reconstruction error for different numbers of components
  const reconstructionError: number[] = [];
  for (let k = 1; k <= Math.min(nComponents, eigenvalues.length); k++) {
    const variance = eigenvalues.slice(k).reduce((a, b) => a + b, 0);
    reconstructionError.push(variance / totalVariance);
  }
  
  // Calculate loadings (correlation between original features and PCs)
  const loadings = eigenvectors.map((eigenvector, compIdx) => {
    const eigenvalue = eigenvalues[compIdx];
    return eigenvector.map(loading => loading * Math.sqrt(eigenvalue));
  });
  
  return {
    transformedData,
    explainedVariance: eigenvalues,
    explainedVarianceRatio,
    cumulativeVariance,
    components,
    eigenvalues,
    mean: means,
    std: stds,
    reconstructionError,
    loadings: transpose(loadings),
    correlationMatrix: corrMatrix,
    originalData: data,
    standardizedData: standardized
  };
}

export function getOptimalComponents(cumulativeVariance: number[], threshold: number = 0.95): number {
  return cumulativeVariance.findIndex(v => v >= threshold) + 1;
}
