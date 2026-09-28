// Seed script — creates demo users and realistic domain records.
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const phones = ["(415) 555-0132", "(212) 555-0187", "(312) 555-0149", "(617) 555-0110"];
const cities = ["Chicago, IL", "Austin, TX", "Boston, MA", "Denver, CO", "Seattle, WA"];

function pick<T>(arr: T[], i: number): T { return arr[i % arr.length]; }
function amount(i: number, base = 1000): number { return Math.round((base + ((i * 7919) % 900) * base) * 100) / 100; }
function daysAgo(i: number, spread = 180): Date { return new Date(Date.now() - ((i * 37) % spread) * 86400000); }

async function main() {
  const database = new URL(process.env.DATABASE_URL || "").pathname.slice(1);
  if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true" || !/^(demo_|inspection_test_)/.test(database)) throw new Error("Demo seeding requires ALLOW_DEMO_SEED=true and a dedicated demo_ or inspection_test_ database");
  if (!process.env.DEMO_PASSWORD || process.env.DEMO_PASSWORD.length < 16) throw new Error("Set DEMO_PASSWORD to at least 16 characters");
  const passwordHash = await bcrypt.hash(process.env.DEMO_PASSWORD!, 12);
  const demoUsers: Array<[string, string, Role]> = [
    ["admin@ai-organizational-velocity-analytics.local", "Demo Admin", "ADMIN"],
    ["manager@ai-organizational-velocity-analytics.local", "Demo Manager", "MANAGER"],
    ["analyst@ai-organizational-velocity-analytics.local", "Demo Analyst", "ANALYST"],
  ];
  for (const [email, name, role] of demoUsers) {
    await prisma.user.upsert({ where: { email }, update: {}, create: { email, name, role, passwordHash } });
  }

  const STATUSES_Team = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.team.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.team.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      department: `Department ${String(i + 1).padStart(3, "0")}`,
      lead: `Lead ${String(i + 1).padStart(3, "0")}`,
      headcount: 5 + ((i * 13) % 95),
      aiSpendMonthly: amount(i, 250),
      status: pick(STATUSES_Team, i)
      },
    });
  }

  const teamRefs = await prisma.team.findMany({ select: { id: true } });

  const STATUSES_DeliveryCycle = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.deliveryCycle.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.deliveryCycle.create({
      data: {
      name: `Name ${String(i + 1).padStart(3, "0")}`,
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      itemsCompleted: 5 + ((i * 13) % 95),
      avgCycleDays: amount(i, 250),
      medianCycleDays: amount(i, 250),
      status: pick(STATUSES_DeliveryCycle, i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_WorkItem = ["BACKLOG", "IN_PROGRESS", "IN_REVIEW", "DONE"];
  await prisma.workItem.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.workItem.create({
      data: {
      key: `Key ${String(i + 1).padStart(3, "0")}`,
      title: `Title ${String(i + 1).padStart(3, "0")}`,
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_WorkItem, i),
      cycleHours: amount(i, 250),
      reopenCount: 5 + ((i * 13) % 95),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_ReworkEvent = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.reworkEvent.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.reworkEvent.create({
      data: {
      workItemRef: `WorkItemRef ${String(i + 1).padStart(3, "0")}`,
      cause: `Cause ${String(i + 1).padStart(3, "0")}`,
      addedHours: amount(i, 250),
      origin: `Origin ${String(i + 1).padStart(3, "0")}`,
      occurredAt: daysAgo(i),
      status: pick(STATUSES_ReworkEvent, i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_ApprovalDelay = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.approvalDelay.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.approvalDelay.create({
      data: {
      gate: `Gate ${String(i + 1).padStart(3, "0")}`,
      approver: `Approver ${String(i + 1).padStart(3, "0")}`,
      delayHours: amount(i, 250),
      workItemRef: `WorkItemRef ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ApprovalDelay, i),
      resolvedAt: daysAgo(i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_CoordinationCost = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.coordinationCost.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.coordinationCost.create({
      data: {
      activity: `Activity ${String(i + 1).padStart(3, "0")}`,
      participants: `Participants ${String(i + 1).padStart(3, "0")}`,
      hoursPerWeek: amount(i, 250),
      weeklyCost: amount(i, 250),
      category: `Category ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_CoordinationCost, i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_QualitySignal = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.qualitySignal.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.qualitySignal.create({
      data: {
      kind: `Kind ${String(i + 1).padStart(3, "0")}`,
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      value: amount(i, 250),
      target: amount(i, 250),
      trend: `Trend ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_QualitySignal, i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_AiUsageRecord = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.aiUsageRecord.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.aiUsageRecord.create({
      data: {
      tool: `Tool ${String(i + 1).padStart(3, "0")}`,
      userRef: `UserRef ${String(i + 1).padStart(3, "0")}`,
      tokens: amount(i, 250),
      cost: amount(i, 250),
      taskType: `TaskType ${String(i + 1).padStart(3, "0")}`,
      usedAt: daysAgo(i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_ProductivityBaseline = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.productivityBaseline.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.productivityBaseline.create({
      data: {
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      baselineValue: amount(i, 250),
      currentValue: amount(i, 250),
      deltaPct: amount(i, 250),
      status: pick(STATUSES_ProductivityBaseline, i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_Experiment = ["HYPOTHESIS", "RUNNING", "MEASURED", "DECIDED"];
  await prisma.experiment.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.experiment.create({
      data: {
      hypothesis: `Hypothesis ${String(i + 1).padStart(3, "0")}`,
      change: `Change ${String(i + 1).padStart(3, "0")}`,
      successMetric: `SuccessMetric ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_Experiment, i),
      startedAt: daysAgo(i),
      result: `Result ${String(i + 1).padStart(3, "0")}`,
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_BenchmarkSnapshot = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.benchmarkSnapshot.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.benchmarkSnapshot.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      metric: `Metric ${String(i + 1).padStart(3, "0")}`,
      teamValue: amount(i, 250),
      orgP50: amount(i, 250),
      orgP90: amount(i, 250),
      status: pick(STATUSES_BenchmarkSnapshot, i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  const STATUSES_ExecutiveReport = ["OPEN", "IN_REVIEW", "APPROVED", "CLOSED"];
  await prisma.executiveReport.deleteMany();
  for (let i = 0; i < 25; i++) {
    await prisma.executiveReport.create({
      data: {
      period: `Period ${String(i + 1).padStart(3, "0")}`,
      generatedFor: `GeneratedFor ${String(i + 1).padStart(3, "0")}`,
      headline: `Headline ${String(i + 1).padStart(3, "0")}`,
      body: `Body ${String(i + 1).padStart(3, "0")}`,
      status: pick(STATUSES_ExecutiveReport, i),
      publishedAt: daysAgo(i),
      team: { connect: { id: teamRefs[i % teamRefs.length].id } }
      },
    });
  }

  await prisma.auditLog.create({ data: { actorName: "Seeder", action: "SEED", entity: "system", detail: "Demo dataset created" } });

  console.log("Seeded demo users and domain records.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
