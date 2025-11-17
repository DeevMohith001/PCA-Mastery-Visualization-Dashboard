import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { ChevronDown, ChevronUp, Stethoscope, Milk, Zap, BookOpen, ArrowLeft } from "lucide-react";
import { Separator } from "./ui/separator";

interface ContentSection {
  title: string;
  content: React.ReactNode;
}

interface DomainStory {
  emoji: string;
  icon: React.ReactNode;
  title: string;
  colorScheme: {
    bg: string;
    cardBg: string;
    border: string;
    accent: string;
    text: string;
  };
  sections: ContentSection[];
}

const domainStories: Record<string, DomainStory> = {
  medical: {
    emoji: "🩺",
    icon: <Stethoscope className="w-5 h-5" />,
    title: "PCA Explained to a Doctor (Diabetes Data)",
    colorScheme: {
      bg: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
      cardBg: "bg-blue-50/50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      accent: "bg-blue-500",
      text: "text-blue-700 dark:text-blue-300",
    },
    sections: [
      {
        title: "What is PCA (Principal Component Analysis)?",
        content: (
          <div className="space-y-4">
            <p className="leading-relaxed">
              Imagine you have too many medical test results for every patient —
              blood sugar, insulin, blood pressure, BMI, age, skin thickness, pregnancies, and more.
            </p>
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="font-medium mb-2">More tests = more information</p>
              <p className="text-sm text-muted-foreground">But also more confusion.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">Some tests tell the same story.</p>
              <p className="text-sm">For example:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📄</span>
                  <span className="text-sm">High glucose usually means high insulin</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">📄</span>
                  <span className="text-sm">High BMI often means higher blood pressure</span>
                </li>
              </ul>
            </div>
            <p className="leading-relaxed">
              So you're checking many values that are repeating the same pattern.
            </p>
            <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl">
              <p className="font-semibold mb-2">PCA is like a smart assistant that says:</p>
              <p className="text-sm italic">
                "Instead of looking at 8–10 separate test results, let me combine them into just a few summary health scores that keep the important information."
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Why We Use PCA",
        content: (
          <div className="space-y-4">
            <p className="leading-relaxed">
              Because too much data can hide the real patterns. PCA helps you:
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold mt-1">✓</span>
                <span>See the bigger picture instead of individual numbers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold mt-1">✓</span>
                <span>Reduce repeated information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold mt-1">✓</span>
                <span>Find what really affects diabetes risk</span>
              </li>
            </ul>
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm italic">
                It's like summarizing 10 health pages into just 2 or 3 smart summary sheets.
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "How PCA Decides What Is Important",
        content: (
          <div className="space-y-4">
            <div className="space-y-4">
              <StepCard
                step={1}
                title="Standardize the Data"
                description="Each test has different units (blood sugar in mg/dL, BMI without units, pressure in mmHg). So PCA first puts everything on the same scale — like comparing apples to apples."
                color="blue"
              />
              <StepCard
                step={2}
                title="Find Relationships (Covariance)"
                description="It checks how tests move together — When glucose goes up, does insulin go up too? When BMI goes up, does pressure rise? These relationships help PCA find which features 'travel together.'"
                color="blue"
              />
              <StepCard
                step={3}
                title="Find New Directions (Eigenvectors)"
                description='PCA then finds new hidden directions that represent these combined patterns — for example, a "lifestyle" direction or a "genetic" direction.'
                color="blue"
              />
              <StepCard
                step={4}
                title="Rank the Directions (Eigenvalues)"
                description="It measures which direction explains more variation among patients. The one that shows bigger differences is more useful."
                color="blue"
              />
              <StepCard
                step={5}
                title="Pick Top Components"
                description='Finally, PCA keeps only the top few "summary health scores" that matter most, and ignores the rest (the less informative ones).'
                color="blue"
              />
            </div>
          </div>
        ),
      },
      {
        title: "Result for Doctors",
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Before PCA →</p>
                <p className="text-sm text-muted-foreground">
                  Dozens of scattered lab results, hard to compare.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">After PCA →</p>
                <p className="text-sm text-muted-foreground">
                  Few "summary health scores" showing clear patient patterns (like diabetic vs. non-diabetic).
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "TL;DR for the Doctor",
        content: (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border-2 border-amber-300 dark:border-amber-700">
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Quick Summary:</p>
            <p className="text-sm leading-relaxed">
              PCA turns complex medical reports into a few clear, meaningful health scores.
              It removes repetition, keeps important info, and helps doctors see patterns quickly — no math required.
            </p>
          </div>
        ),
      },
    ],
  },
  farming: {
    emoji: "🐄",
    icon: <Milk className="w-5 h-5" />,
    title: "PCA Explained to a Farmer (Milk Production)",
    colorScheme: {
      bg: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
      cardBg: "bg-green-50/50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      accent: "bg-green-500",
      text: "text-green-700 dark:text-green-300",
    },
    sections: [
      {
        title: "What is PCA?",
        content: (
          <div className="space-y-4">
            <p className="leading-relaxed">
              Imagine you run a dairy farm and track many things daily —
              feed type, amount of water, cow's weight, temperature, humidity, age, rest hours, health condition, and milk yield.
            </p>
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-green-200 dark:border-green-800">
              <p className="font-medium mb-2">That's a lot to track</p>
              <p className="text-sm text-muted-foreground">
                And sometimes, the more you collect, the more confusing it gets.
              </p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">You might notice that:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">📄</span>
                  <span className="text-sm">On hot days, cows drink more water but produce less milk.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">📄</span>
                  <span className="text-sm">When the feed quality improves, both health and milk go up.</span>
                </li>
              </ul>
            </div>
            <p className="leading-relaxed">
              So, several things are telling the same story — for example, heat stress or nutrition quality.
            </p>
            <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl">
              <p className="font-semibold mb-2">PCA acts like your data helper and says:</p>
              <p className="text-sm italic">
                "Instead of looking at 10 different farm readings, let's combine them into a few smart summary factors that show what really affects milk production."
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Why We Use PCA",
        content: (
          <div className="space-y-4">
            <p className="leading-relaxed">
              Because managing 10+ factors every day is exhausting — and many are connected.
              PCA simplifies all that into 2–3 main patterns like:
            </p>
            <div className="grid gap-3">
              <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-medium text-green-700 dark:text-green-300">
                  "Cow Comfort & Environment"
                </p>
              </div>
              <div className="p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-medium text-green-700 dark:text-green-300">
                  "Diet & Nutrition"
                </p>
              </div>
            </div>
            <p className="text-sm italic p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-green-200 dark:border-green-800">
              It helps you focus on what truly drives milk yield.
            </p>
          </div>
        ),
      },
      {
        title: "How PCA Decides What Is Important",
        content: (
          <div className="space-y-4">
            <StepCard
              step={1}
              title="Standardize the Data"
              description="Every measurement — like milk (litres), temperature (°C), and rest (hours) — has different units. PCA first puts them all on one scale."
              color="green"
            />
            <StepCard
              step={2}
              title="Find Relationships (Covariance)"
              description="It checks how these factors move together. When heat increases, rest decreases, milk drops — that's one connected pattern."
              color="green"
            />
            <StepCard
              step={3}
              title="Find New Directions (Eigenvectors)"
              description='PCA creates new combined patterns — like one representing "environmental stress" and another representing "nutrition strength."'
              color="green"
            />
            <StepCard
              step={4}
              title="Rank the Directions (Eigenvalues)"
              description="It checks which of these patterns affects milk production the most."
              color="green"
            />
            <StepCard
              step={5}
              title="Pick Top Components"
              description="Finally, PCA keeps only the top few factors that explain most changes in milk production."
              color="green"
            />
          </div>
        ),
      },
      {
        title: "Result for Farmers",
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Before PCA →</p>
                <p className="text-sm text-muted-foreground">
                  10+ confusing measurements every day.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">After PCA →</p>
                <p className="text-sm text-muted-foreground">
                  2–3 clear factors that explain most of the changes in milk output.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "TL;DR for the Farmer",
        content: (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border-2 border-amber-300 dark:border-amber-700">
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Quick Summary:</p>
            <p className="text-sm leading-relaxed">
              PCA helps farmers focus on key reasons for milk changes, instead of chasing many small details.
              It simplifies farm data into clear, useful insights for better decisions.
            </p>
          </div>
        ),
      },
    ],
  },
  engineering: {
    emoji: "⚙️",
    icon: <Zap className="w-5 h-5" />,
    title: "PCA Explained to an Engineer (Electricity Consumption)",
    colorScheme: {
      bg: "from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20",
      cardBg: "bg-yellow-50/50 dark:bg-yellow-950/30",
      border: "border-yellow-200 dark:border-yellow-800",
      accent: "bg-yellow-500",
      text: "text-yellow-700 dark:text-yellow-300",
    },
    sections: [
      {
        title: "What is PCA?",
        content: (
          <div className="space-y-4">
            <p className="leading-relaxed">
              Imagine you're monitoring city electricity —
              voltage, current, temperature, time of day, number of people, appliance use, humidity, and so on.
            </p>
            <div className="p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="font-medium mb-2">You've got a mountain of readings</p>
              <p className="text-sm text-muted-foreground">But they all seem tangled.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium">For example:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">📄</span>
                  <span className="text-sm">
                    When the temperature rises, fans and ACs switch on — power use goes up.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-1">📄</span>
                  <span className="text-sm">
                    At night, load changes because people use fewer devices.
                  </span>
                </li>
              </ul>
            </div>
            <p className="leading-relaxed">
              So, many of these readings tell the same story — human activity or weather conditions.
            </p>
            <div className="p-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl">
              <p className="font-semibold mb-2">PCA steps in like your smart system optimizer and says:</p>
              <p className="text-sm italic">
                "Let's combine all these connected measurements into a few summary indicators that explain how and why electricity use changes."
              </p>
            </div>
          </div>
        ),
      },
      {
        title: "Why We Use PCA",
        content: (
          <div className="space-y-4">
            <p className="leading-relaxed">
              Because with so many readings, it's hard to tell what's really driving power usage.
              PCA helps find the main reasons —
            </p>
            <ul className="space-y-3 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-semibold mt-1">→</span>
                <span>One factor representing weather effects</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-semibold mt-1">→</span>
                <span>Another showing user behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500 font-semibold mt-1">→</span>
                <span>Another showing grid condition</span>
              </li>
            </ul>
            <p className="text-sm italic p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-yellow-200 dark:border-yellow-800">
              It makes monitoring easier and helps plan power distribution better.
            </p>
          </div>
        ),
      },
      {
        title: "How PCA Decides What Is Important",
        content: (
          <div className="space-y-4">
            <StepCard
              step={1}
              title="Standardize the Data"
              description="All readings (voltage, temperature, time, etc.) are measured differently. PCA first brings them to the same scale."
              color="yellow"
            />
            <StepCard
              step={2}
              title="Find Relationships (Covariance)"
              description="It sees how these values move together. When temperature rises, current usage rises — that's a relationship."
              color="yellow"
            />
            <StepCard
              step={3}
              title="Find New Directions (Eigenvectors)"
              description='PCA finds new combined "directions" like → "Weather-driven load" → "Human activity load"'
              color="yellow"
            />
            <StepCard
              step={4}
              title="Rank the Directions (Eigenvalues)"
              description="It identifies which of these combined directions explains most of the variation in energy use."
              color="yellow"
            />
            <StepCard
              step={5}
              title="Pick Top Components"
              description="Finally, it keeps only the top 2–3 main directions — the summary features that matter most for electricity management."
              color="yellow"
            />
          </div>
        ),
      },
      {
        title: "Result for Engineers",
        content: (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                <p className="font-semibold text-red-700 dark:text-red-300 mb-2">Before PCA →</p>
                <p className="text-sm text-muted-foreground">
                  Dozens of scattered readings, unclear connections.
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-700 dark:text-green-300 mb-2">After PCA →</p>
                <p className="text-sm text-muted-foreground">
                  2–3 main energy patterns that tell the full story of electricity use.
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "TL;DR for the Engineer",
        content: (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-xl border-2 border-amber-300 dark:border-amber-700">
            <p className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Quick Summary:</p>
            <p className="text-sm leading-relaxed">
              PCA simplifies complex electrical data into key patterns.
              It reduces noise, removes overlap, and makes it easier to understand what actually drives power consumption.
            </p>
          </div>
        ),
      },
    ],
  },
};

function StepCard({
  step,
  title,
  description,
  color,
}: {
  step: number;
  title: string;
  description: string;
  color: "blue" | "green" | "yellow";
}) {
  const colorMap = {
    blue: "bg-blue-500 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    green: "bg-green-500 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    yellow: "bg-yellow-500 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  };

  const bgColor = colorMap[color].split(" ")[0];

  return (
    <div className={`p-4 bg-white/50 dark:bg-slate-900/50 rounded-lg border ${colorMap[color].split(" ").slice(2).join(" ")}`}>
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 w-8 h-8 ${bgColor} text-white rounded-full flex items-center justify-center font-semibold text-sm`}>
          {step}
        </div>
        <div className="flex-1">
          <h5 className="font-semibold mb-1">{title}</h5>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}

function DomainCard({ domain, story }: { domain: string; story: DomainStory }) {
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <Card className={`shadow-lg bg-gradient-to-br ${story.colorScheme.bg} border-2 ${story.colorScheme.border}`}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className={`${story.colorScheme.accent} p-2 rounded-lg text-white`}>
            {story.icon}
          </div>
          <span className="text-4xl">{story.emoji}</span>
        </div>
        <CardTitle className="text-2xl">{story.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {story.sections.map((section, index) => (
              <div
                key={index}
                className="bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors"
                >
                  <h4 className="font-semibold text-left">{section.title}</h4>
                  {expandedSections.includes(index) ? (
                    <ChevronUp className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 flex-shrink-0" />
                  )}
                </button>
                {expandedSections.includes(index) && (
                  <div className="px-5 pb-5 pt-2">
                    <Separator className="mb-4" />
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface PCAExplainedSectionProps {
  onBack?: () => void;
}

export function PCAExplainedSection({ onBack }: PCAExplainedSectionProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center space-y-3 px-4">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="w-8 h-8 text-primary" />
          <h2 className="text-3xl font-bold">PCA Explained for Everyone</h2>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Simple real-world stories to understand what PCA is, why we use it, and how it decides what's important.
        </p>
        {onBack && (
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        )}
      </div>

      <Separator />

      {/* Tabs for each domain */}
      <Tabs defaultValue="medical" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto p-2">
          <TabsTrigger value="medical" className="flex flex-col sm:flex-row items-center gap-2 py-3">
            <Stethoscope className="w-5 h-5" />
            <div className="text-center sm:text-left">
              <div className="font-semibold">🩺 Medical</div>
              <div className="text-xs text-muted-foreground hidden sm:block">Diabetes Data</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="farming" className="flex flex-col sm:flex-row items-center gap-2 py-3">
            <Milk className="w-5 h-5" />
            <div className="text-center sm:text-left">
              <div className="font-semibold">🐄 Farming</div>
              <div className="text-xs text-muted-foreground hidden sm:block">Milk Production</div>
            </div>
          </TabsTrigger>
          <TabsTrigger value="engineering" className="flex flex-col sm:flex-row items-center gap-2 py-3">
            <Zap className="w-5 h-5" />
            <div className="text-center sm:text-left">
              <div className="font-semibold">⚙️ Engineering</div>
              <div className="text-xs text-muted-foreground hidden sm:block">Electricity</div>
            </div>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medical" className="mt-6">
          <DomainCard domain="medical" story={domainStories.medical} />
        </TabsContent>

        <TabsContent value="farming" className="mt-6">
          <DomainCard domain="farming" story={domainStories.farming} />
        </TabsContent>

        <TabsContent value="engineering" className="mt-6">
          <DomainCard domain="engineering" story={domainStories.engineering} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
