# 📊 PCA Visualization Dashboard

<img src="assets\Screenshot 2025-11-17 181810.png" width="400">


A **TypeScript + React** dashboard to visualize **Principal Component Analysis (PCA)** on multiple datasets. Explore **2D/3D scatter plots**, **biplots**, **pairwise PC scatter matrices**, and **before/after PCA comparisons** interactively.

Built using **Recharts** for visualizations and **shadcn/ui** for UI components.

---

## 🚀 Table of Contents

* [🌟 Demo](#-demo)
* [✨ Features](#-features)
* [📂 Datasets](#-datasets)
* [💻 Installation](#-installation)
* [🛠 Usage](#-usage)
* [📈 PCA Implementation](#-pca-implementation)
* [🛠 Scatter Plot Fixes](#-scatter-plot-fixes)
* [✅ Testing](#-testing)
* [📜 Licenses](#-licenses)
* [🤝 Contributing](#-contributing)

---

## 🌟 Demo

Interactive PCA visualizations for:

* ⚡ Electricity consumption
* 🥛 Milk production
* 🩺 Diabetes diagnostics

Visualizations include:

* **2D PCA Scatter Plot**
* **3D PCA Projections**
* **Biplots (Samples + Features)**
* **Pairwise PC Scatter Matrices**
* **Before/After PCA Comparison**

---

## ✨ Features

* Interactive scatter plots with **Recharts**
* **2D & 3D PCA projections**
* Formatted **tooltips** for precise values
* **Responsive grid layout** for mobile-first design
* **Null-safe**: prevents crashes on missing or empty data
* Numeric safety via `Number()` conversions
* Dynamic **pairwise plots** for PCA exploration

---

## 📂 Datasets

Included example datasets:

<details>
<summary>⚡ Electricity</summary>

**Description:** Hourly electricity consumption with load, temperature, humidity, and time patterns.
**Features:** `load_kw`, `temperature`, `humidity`, `hour_of_day`, `day_of_week`, `is_weekend`
**Target:** `consumption_level` (Low, Medium, High)

</details>

<details>
<summary>🥛 Milk Production</summary>

**Description:** Monthly milk production with seasonal, feed quality, temperature, and herd size metrics.
**Features:** `production_liters`, `feed_quality`, `temperature_avg`, `herd_size`, `rainfall_mm`, `month`
**Target:** `season` (Winter, Spring, Summer, Fall)

</details>

<details>
<summary>🩺 Diabetes</summary>

**Description:** Medical diagnostics dataset for diabetes prediction.
**Features:** `glucose`, `blood_pressure`, `bmi`, `age`, `insulin`, `skin_thickness`
**Target:** `outcome` (No Diabetes, Diabetes)

</details>

All datasets are defined in `datasets.ts`.

---

## 💻 Installation

```bash
# Clone repository
git clone https://github.com/yourusername/pca-dashboard.git
cd pca-dashboard

# Install dependencies
npm install

# Run development server
npm run dev
```

---

## 🛠 Usage

1. Open the app at `http://localhost:3000`
2. Select a dataset from the dashboard
3. Explore visualizations:

   * 2D PCA scatter plots
   * 3D PCA projections
   * Biplots
   * Pairwise scatter matrices
   * Before/After PCA comparison
4. Hover points for tooltips with formatted values
5. Resize browser to see responsive layouts

---

## 📈 PCA Implementation

Implemented in **TypeScript** in `pca.ts`.

<details>
<summary>Click to expand PCA features</summary>

* **Standardization** (zero mean, unit variance)
* **Covariance & correlation matrices**
* **Simplified eigenvalue decomposition (SVD)**
* **Projection onto principal components**
* **Explained variance & cumulative variance**
* **Loadings** (feature-PC correlations)
* **Reconstruction error**

**Example Usage:**

```ts
import { performPCA } from './pca';

const result = performPCA(data, 3);
console.log(result.transformedData);
console.log(result.explainedVarianceRatio);
```

</details>

---

## 🛠 Scatter Plot Fixes

Previous issues resolved:

* ✅ Numeric conversion using `Number()` instead of `.toFixed()`
* ✅ Added margins for all charts to avoid clipping
* ✅ Null/undefined checks for safer rendering
* ✅ Responsive grid layouts for mobile devices
* ✅ Tooltips now use separate formatted display values
* ✅ Fixed all scatter plot components:

  * `PCAScatterPlot`
  * `BeforeAfterPCAComparison`
  * `Biplot`
  * `PairwisePCScatterMatrix`
  * `ThreeDPCAPlot`

---

## ✅ Testing

Includes `TestScatter.tsx` for verifying scatter plot rendering.

Sample test data:

```ts
const testData = [
  { x: 1, y: 2, class: 'A' },
  { x: 2, y: 3, class: 'A' },
  { x: 3, y: 1, class: 'B' },
  { x: 4, y: 4, class: 'B' },
];
```

**Checklist:**

* [ ] Points render correctly
* [ ] Colors differentiate classes
* [ ] Tooltips show accurate values
* [ ] Mobile responsive
* [ ] No console errors

---

## 📜 Licenses

* **shadcn/ui components:** [MIT License](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
* **Unsplash photos:** [Unsplash License](https://unsplash.com/license)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

### ⚡ Optional Enhancements

* Screenshots or GIFs of the dashboard
* Support for **custom datasets** uploaded by users
* PCA clustering & advanced dimensionality reduction
* Performance benchmarks for large datasets
