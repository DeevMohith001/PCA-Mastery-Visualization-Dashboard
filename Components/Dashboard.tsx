import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { Info, Play, RotateCcw, BookOpen, Database, Settings, BarChart3, Sparkles } from "lucide-react";
import { AlgorithmModal } from "./AlgorithmModal";
import VisualizationCharts from "./VisualizationCharts";
import { DataStatistics } from "./DataStatistics";
import { ThemeToggle } from "./ThemeToggle";
import { PCAGlossary } from "./PCAGlossary";
import { PCAExplainedSection } from "./PCAExplainedSection";
import { datasets, datasetList } from "../utils/datasets";
import { performPCA, getOptimalComponents } from "../utils/pca";
import { toast } from "sonner@2.0.3";

export function Dashboard() {
  const [selectedDataset, setSelectedDataset] = useState("electricity");
  const [nComponents, setNComponents] = useState(2);
  const [normalize, setNormalize] = useState(true);
  const [pcaResult, setPcaResult] = useState<any>(null);
  const [isAlgorithmModalOpen, setIsAlgorithmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDataPreview, setShowDataPreview] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const currentDataset = datasets[selectedDataset];
  const maxComponents = Math.min(
    currentDataset.features.length,
    currentDataset.data.length
  );

  useEffect(() => {
    // Auto-run PCA on initial load
    runPCA();
    // Auto-hide welcome message after 5 seconds
    const timer = setTimeout(() => setShowWelcome(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const runPCA = async () => {
    setIsLoading(true);
    toast.loading("Running PCA analysis...", { id: "pca-loading" });
    
    try {
      // Simulate computation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = performPCA(
        currentDataset.data,
        nComponents,
        normalize
      );
      
      setPcaResult(result);
      
      const totalVariance = (result.cumulativeVariance[nComponents - 1] * 100).toFixed(1);
      const varianceNum = parseFloat(totalVariance);
      
      if (varianceNum >= 95) {
        toast.success(`🎉 Excellent! ${totalVariance}% variance explained`, { 
          id: "pca-loading",
          description: `Outstanding dimensionality reduction with ${nComponents} components!`
        });
      } else if (varianceNum >= 80) {
        toast.success(`✅ PCA Complete! ${totalVariance}% variance explained`, { 
          id: "pca-loading",
          description: `Good reduction: ${nComponents} components from ${currentDataset.features.length} features`
        });
      } else {
        toast.success(`PCA Complete! ${totalVariance}% variance explained`, { 
          id: "pca-loading",
          description: `Consider adding more components for better coverage`
        });
      }
    } catch (error) {
      toast.error("PCA computation failed", { id: "pca-loading" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDatasetChange = (value: string) => {
    setSelectedDataset(value);
    const newDataset = datasets[value];
    const newMaxComponents = Math.min(
      newDataset.features.length,
      newDataset.data.length
    );
    if (nComponents > newMaxComponents) {
      setNComponents(Math.min(2, newMaxComponents));
    }
  };

  const suggestOptimalComponents = () => {
    if (pcaResult) {
      const optimal = getOptimalComponents(pcaResult.cumulativeVariance, 0.95);
      setNComponents(optimal);
      toast.success(`Suggested ${optimal} components for 95% variance`, {
        description: "Click 'Apply PCA' to update"
      });
    }
  };

  const resetSettings = () => {
    setNComponents(2);
    setNormalize(true);
    toast.info("Settings reset to defaults");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1>
                PCA Mastery Dashboard
              </h1>
              <p className="text-muted-foreground">
                Interactive visualization for understanding Principal Component Analysis
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsAlgorithmModalOpen(true)}
                className="hidden md:flex"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Learn PCA
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Dataset
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Dataset</Label>
                  <Select value={selectedDataset} onValueChange={handleDatasetChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {datasetList.map((ds) => (
                        <SelectItem key={ds.value} value={ds.value}>
                          {ds.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-muted rounded-lg space-y-2">
                  <p className="text-sm font-medium">{currentDataset.emoji} {currentDataset.name}</p>
                  <p className="text-xs text-muted-foreground">{currentDataset.description}</p>
                  <Separator className="my-2" />
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Samples</p>
                      <p className="font-semibold">{currentDataset.data.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Features</p>
                      <p className="font-semibold">{currentDataset.features.length}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => setShowDataPreview(!showDataPreview)}
                  >
                    {showDataPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </div>

                {showDataPreview && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <p className="text-xs font-medium mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {currentDataset.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  PCA Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Components: {nComponents}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={suggestOptimalComponents}
                      disabled={!pcaResult}
                    >
                      <Info className="w-3 h-3 mr-1" />
                      Suggest
                    </Button>
                  </div>
                  <Slider
                    value={[nComponents]}
                    onValueChange={(value) => setNComponents(value[0])}
                    min={1}
                    max={maxComponents}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    Reduce {currentDataset.features.length} features to {nComponents} component{nComponents > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="normalize">Standardize Data</Label>
                    <p className="text-xs text-muted-foreground">Scale to unit variance</p>
                  </div>
                  <Switch
                    id="normalize"
                    checked={normalize}
                    onCheckedChange={setNormalize}
                  />
                </div>

                {pcaResult && (
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                    <p className="text-xs font-medium mb-1">Current Results:</p>
                    <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {(pcaResult.cumulativeVariance[nComponents - 1] * 100).toFixed(1)}% variance explained
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nComponents} of {maxComponents} components used
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    onClick={runPCA} 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2 animate-spin" />
                        Computing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Apply PCA
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    onClick={resetSettings}
                    variant="outline"
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-48">
                  <div className="space-y-3 text-sm pr-3">
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="font-medium text-blue-900 dark:text-blue-100">🎯 Choosing Components</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Aim for 80-95% cumulative variance. Use the scree plot to find the "elbow".
                      </p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded">
                      <p className="font-medium text-purple-900 dark:text-purple-100">📊 Reading Loadings</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        High loadings show which features drive each component. This helps interpret results.
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                      <p className="font-medium text-green-900 dark:text-green-100">✅ Standardization</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Always standardize when features have different scales (e.g., age vs salary).
                      </p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-950 rounded">
                      <p className="font-medium text-amber-900 dark:text-amber-100">⚠️ Limitations</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PCA assumes linear relationships. For non-linear data, consider t-SNE or UMAP.
                      </p>
                    </div>
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded">
                      <p className="font-medium text-indigo-900 dark:text-indigo-100">📉 Interact with the graphs — not just view them</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Hover to see real data values, scroll or slide to explore all components, and watch how each PCA step transforms your dataset's shape.
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        The graphs update automatically whenever you change the dataset or number of components — so experiment freely to see PCA in action.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <PCAGlossary />
          </div>

          {/* Main Content - Visualizations */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="visualizations" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="visualizations">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Visualizations
                </TabsTrigger>
                <TabsTrigger value="data">
                  <Database className="w-4 h-4 mr-2" />
                  Data
                </TabsTrigger>
                <TabsTrigger value="learn">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Learn PCA
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visualizations" className="space-y-4">
                {showWelcome && (
                  <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-none relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <CardHeader className="relative">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center gap-2">
                            <Sparkles className="w-6 h-6" />
                            Welcome to PCA Mastery Dashboard!
                          </CardTitle>
                          <CardDescription className="text-white/90 mt-2">
                            Your interactive learning tool for understanding Principal Component Analysis
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowWelcome(false)}
                          className="text-white hover:bg-white/20"
                        >
                          ✕
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                          <p className="font-semibold mb-1">1️⃣ Choose Dataset</p>
                          <p className="text-white/80 text-xs">
                            Select from datasets like Electricity, Milk Production, or Diabetes in the sidebar
                          </p>
                        </div>
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                          <p className="font-semibold mb-1">2️⃣ Adjust Settings</p>
                          <p className="text-white/80 text-xs">
                            Experiment with number of components and normalization options
                          </p>
                        </div>
                        <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg">
                          <p className="font-semibold mb-1">3️⃣ Learn Algorithm</p>
                          <p className="text-white/80 text-xs">
                            Click "Show PCA Algorithm" to understand the mathematics behind the scenes
                          </p>
                        </div>
                      </div>
                      <p className="mt-4 text-xs text-white/70 text-center">
                        💡 Tip: PCA has already been run on the Electricity dataset below. Explore the visualizations!
                      </p>
                    </CardContent>
                  </Card>
                )}

                {pcaResult ? (
                  <VisualizationCharts 
                    pcaResult={pcaResult}
                    dataset={currentDataset}
                    featureNames={currentDataset.features}
                  />
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <BarChart3 className="w-16 h-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">
                        Click "Apply PCA" to generate visualizations
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="data" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dataset Overview</CardTitle>
                    <CardDescription>Basic information about the selected dataset</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Samples</p>
                          <p className="font-semibold">{currentDataset.data.length}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Features</p>
                          <p className="font-semibold">{currentDataset.features.length}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Classes</p>
                          <p className="font-semibold">
                            {currentDataset.targetNames?.length || new Set(currentDataset.targetValues).size}
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="font-semibold">
                            {currentDataset.targetNames ? 'Classification' : 'Regression'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Feature Names</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentDataset.features.map((feature, idx) => (
                            <Badge key={idx} variant="outline">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {currentDataset.targetNames && (
                        <div>
                          <h4 className="font-medium mb-2">Target Classes</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentDataset.targetNames.map((name, idx) => (
                              <Badge key={idx} variant="secondary">
                                {name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-medium mb-2">Sample Data (first 5 rows)</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="border-b">
                                {currentDataset.features.slice(0, 4).map((feature, idx) => (
                                  <th key={idx} className="text-left p-2 font-medium">
                                    {feature.length > 12 ? feature.slice(0, 12) + '...' : feature}
                                  </th>
                                ))}
                                <th className="text-left p-2 font-medium">Target</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentDataset.data.slice(0, 5).map((row, rowIdx) => (
                                <tr key={rowIdx} className="border-b hover:bg-muted/50">
                                  {row.slice(0, 4).map((val, colIdx) => (
                                    <td key={colIdx} className="p-2 font-mono text-xs">
                                      {val.toFixed(2)}
                                    </td>
                                  ))}
                                  <td className="p-2">
                                    <Badge variant="outline" className="text-xs">
                                      {currentDataset.targetNames 
                                        ? currentDataset.targetNames[currentDataset.targetValues[rowIdx] as number]
                                        : currentDataset.targetValues[rowIdx]}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <DataStatistics dataset={currentDataset} />
              </TabsContent>

              <TabsContent value="learn" className="space-y-4">
                <PCAExplainedSection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Algorithm Modal */}
      <AlgorithmModal
        isOpen={isAlgorithmModalOpen}
        onClose={() => setIsAlgorithmModalOpen(false)}
        nComponents={nComponents}
        normalize={normalize}
        solver="auto"
      />
    </div>
  );
}