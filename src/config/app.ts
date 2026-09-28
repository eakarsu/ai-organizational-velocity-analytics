export interface PageConfig {
  label: string;
  href: string;
  description: string;
  entities: string[];
  workflows: string[];
}

export interface EntityConfig {
  name: string;
  label: string;
  fields: Array<{ name: string; kind: "string" | "number" | "boolean" | "date" }>;
}

export interface WorkflowConfig {
  slug: string;
  title: string;
  description: string;
  prompt: string;
  fields: string[];
}

export const appConfig = {
  slug: "ai-organizational-velocity-analytics",
  title: "Organizational Velocity Analytics",
  tagline: "Measure whether AI actually improves delivery speed",
  accent: "fuchsia",
};

export const pages: PageConfig[] = [
  {
    label: "Flow",
    href: "/flow",
    description: "Work items, delivery cycles, cycle-time baselines.",
    entities: ["WorkItem", "DeliveryCycle", "ProductivityBaseline"],
    workflows: ["velocity-brief"],
  },
  {
    label: "Friction",
    href: "/friction",
    description: "Rework, approval delays, coordination costs.",
    entities: ["ReworkEvent", "ApprovalDelay", "CoordinationCost"],
    workflows: ["friction-analysis"],
  },
  {
    label: "AI Impact",
    href: "/ai-impact",
    description: "AI usage vs. delivery outcomes, quality signals.",
    entities: ["AiUsageRecord", "QualitySignal"],
    workflows: ["gains-vs-activity"],
  },
  {
    label: "Executive",
    href: "/executive",
    description: "Teams, benchmarks, experiments, reports.",
    entities: ["Team", "BenchmarkSnapshot", "Experiment", "ExecutiveReport"],
    workflows: [],
  },
];

export const entities: Record<string, EntityConfig> = {
  Team: {
    name: "Team",
    label: "Team",
    fields: [{ name: "name", kind: "string" }, { name: "department", kind: "string" }, { name: "lead", kind: "string" }, { name: "headcount", kind: "number" }, { name: "aiSpendMonthly", kind: "number" }, { name: "status", kind: "string" }],
  },
  DeliveryCycle: {
    name: "DeliveryCycle",
    label: "Delivery Cycle",
    fields: [{ name: "name", kind: "string" }, { name: "period", kind: "string" }, { name: "itemsCompleted", kind: "number" }, { name: "avgCycleDays", kind: "number" }, { name: "medianCycleDays", kind: "number" }, { name: "status", kind: "string" }],
  },
  WorkItem: {
    name: "WorkItem",
    label: "Work Item",
    fields: [{ name: "key", kind: "string" }, { name: "title", kind: "string" }, { name: "kind", kind: "string" }, { name: "status", kind: "string" }, { name: "cycleHours", kind: "number" }, { name: "reopenCount", kind: "number" }],
  },
  ReworkEvent: {
    name: "ReworkEvent",
    label: "Rework Event",
    fields: [{ name: "workItemRef", kind: "string" }, { name: "cause", kind: "string" }, { name: "addedHours", kind: "number" }, { name: "origin", kind: "string" }, { name: "occurredAt", kind: "date" }, { name: "status", kind: "string" }],
  },
  ApprovalDelay: {
    name: "ApprovalDelay",
    label: "Approval Delay",
    fields: [{ name: "gate", kind: "string" }, { name: "approver", kind: "string" }, { name: "delayHours", kind: "number" }, { name: "workItemRef", kind: "string" }, { name: "status", kind: "string" }, { name: "resolvedAt", kind: "date" }],
  },
  CoordinationCost: {
    name: "CoordinationCost",
    label: "Coordination Cost",
    fields: [{ name: "activity", kind: "string" }, { name: "participants", kind: "string" }, { name: "hoursPerWeek", kind: "number" }, { name: "weeklyCost", kind: "number" }, { name: "category", kind: "string" }, { name: "status", kind: "string" }],
  },
  QualitySignal: {
    name: "QualitySignal",
    label: "Quality Signal",
    fields: [{ name: "kind", kind: "string" }, { name: "metric", kind: "string" }, { name: "value", kind: "number" }, { name: "target", kind: "number" }, { name: "trend", kind: "string" }, { name: "status", kind: "string" }],
  },
  AiUsageRecord: {
    name: "AiUsageRecord",
    label: "AI Usage",
    fields: [{ name: "tool", kind: "string" }, { name: "userRef", kind: "string" }, { name: "tokens", kind: "number" }, { name: "cost", kind: "number" }, { name: "taskType", kind: "string" }, { name: "usedAt", kind: "date" }],
  },
  ProductivityBaseline: {
    name: "ProductivityBaseline",
    label: "Productivity Baseline",
    fields: [{ name: "metric", kind: "string" }, { name: "period", kind: "string" }, { name: "baselineValue", kind: "number" }, { name: "currentValue", kind: "number" }, { name: "deltaPct", kind: "number" }, { name: "status", kind: "string" }],
  },
  Experiment: {
    name: "Experiment",
    label: "Experiment",
    fields: [{ name: "hypothesis", kind: "string" }, { name: "change", kind: "string" }, { name: "successMetric", kind: "string" }, { name: "status", kind: "string" }, { name: "startedAt", kind: "date" }, { name: "result", kind: "string" }],
  },
  BenchmarkSnapshot: {
    name: "BenchmarkSnapshot",
    label: "Benchmark",
    fields: [{ name: "period", kind: "string" }, { name: "metric", kind: "string" }, { name: "teamValue", kind: "number" }, { name: "orgP50", kind: "number" }, { name: "orgP90", kind: "number" }, { name: "status", kind: "string" }],
  },
  ExecutiveReport: {
    name: "ExecutiveReport",
    label: "Executive Report",
    fields: [{ name: "period", kind: "string" }, { name: "generatedFor", kind: "string" }, { name: "headline", kind: "string" }, { name: "body", kind: "string" }, { name: "status", kind: "string" }, { name: "publishedAt", kind: "date" }],
  },
};

export const workflows: WorkflowConfig[] = [
  {
    slug: "velocity-brief",
    title: "Draft: Velocity Briefing",
    description: "Executive briefing on true delivery velocity.",
    prompt: "Describe measured cycle time, rework, quality and costs using supplied evidence. State missing comparisons and avoid attributing causality to AI without a suitable evaluation design.",
    fields: ["team", "period", "cycleTrend", "qualityTrend"],
  },
  {
    slug: "friction-analysis",
    title: "Draft: Friction Root-Cause",
    description: "Analyze the largest friction sources.",
    prompt: "You are an operations analyst. Rank rework events, approval delays, and coordination costs by cost impact; recommend the top three structural fixes.",
    fields: ["reworkSummary", "approvalSummary", "coordinationSummary", "period"],
  },
  {
    slug: "gains-vs-activity",
    title: "Draft: Gains vs Activity Separator",
    description: "Separate genuine productivity gains from increased activity.",
    prompt: "You are a productivity researcher. Distinguish genuine productivity outcomes (more shipped value at equal quality) from mere activity (more AI output, more meetings).",
    fields: ["aiUsage", "deliveryOutcomes", "qualityMetrics", "meetingLoad"],
  },
];

export function findPage(href: string): PageConfig | undefined {
  return pages.find((p) => p.href === href);
}
