import { BriefResult, DetailedPlanResult } from './ai-service';

/**
 * Generates a structured tactical brief if all AI providers fail.
 * This ensures "Guaranteed Response" logic where the user always receives a path.
 */
export function generateTemplateBrief(situation: string, goal: string, constraints: string): BriefResult {
  const shortGoal = goal.length > 60 ? goal.substring(0, 60) + "..." : goal;
  const shortSituation = situation.length > 100 ? situation.substring(0, 100) + "..." : situation;

  return {
    summary: `Based on your situation: "${shortSituation}", you are pursuing: "${shortGoal}". This framework provides safe, balanced, and growth trajectories to navigate your current landscape.`,
    paths: {
      safe: {
        title: "Protocol Alpha: Preservation",
        description: "A calculated, low-friction approach focused on solidifying your current position while making incremental gains toward your objective.",
        pros: ["Minimal resource depletion", "high predictability", "Emotional stability"],
        cons: ["Slower objective attainment", "Opportunity cost", "Potential for status quo bias"]
      },
      balanced: {
        title: "Protocol Delta: Optimization",
        description: "The primary recommendation. This path balances strategic risk with sustainable growth, optimizing for long-term compounding effects over instant wins.",
        pros: ["Optimal ROE (Return on Effort)", "Flexible pivot points", "Manageable stress load"],
        cons: ["Requires disciplined trade-offs", "Potential for split focus", "Moderate risk exposure"]
      },
      growth: {
        title: "Protocol Omega: Breakthrough",
        description: "An asymmetric, high-velocity bet designed to bypass traditional bottlenecks by committing maximum resources to your goal's most critical lever.",
        pros: ["Maximum impact potential", "Rapid feedback loops", "Highest ROI"],
        cons: ["High resource intensity", "Extreme focus requirement", "Significant risk of burnout"]
      }
    },
    comparison: "The Safe path prioritizes survival and gradual build, Balanced seeks a strategic middle-ground, and Growth bets heavily on a singular high-impact objective.",
    recommendedPath: "balanced",
    actionPlan: {
      day30: [
        "Audit current resource allocation (time, capital, energy).",
        "Identify and remove the single largest distraction to your objective.",
        "Establish a weekly review cadence for tactical benchmarks."
      ],
      day60: [
        "Commit to the core lever identified in Day 30.",
        "Systematize recurring tasks to free up cognitive bandwidth.",
        "Seek a pressure test of your strategy from an outside expert."
      ],
      day90: [
        "Analyze progress data against initial goal projections.",
        "Decide between scaling current momentum or a strategic pivot.",
        "Solidify gains and establish the baseline for the next cycle."
      ]
    },
    focusStatement: `I am committed to achieving: "${shortGoal}" through disciplined execution and strategic clarity.`
  };
}

/**
 * Generates a detailed 12-week roadmap using a deterministic template when AI is busy.
 */
export function generateTemplateDetailedPlan(
  pathType: 'safe' | 'balanced' | 'growth',
  situation: string,
  goal: string,
  constraints: string
): DetailedPlanResult {
  const roadmap: DetailedPlanResult['roadmap'] = [];

  const phases = [
    { range: [1, 2], theme: "Foundation & System Audit" },
    { range: [3, 4], theme: "Momentum Building & Beta Testing" },
    { range: [5, 8], theme: "Core Execution Layer" },
    { range: [9, 10], theme: "Optimization & Expansion" },
    { range: [11, 12], theme: "Review & Scaling" }
  ];

  for (let week = 1; week <= 12; week++) {
    const phase = phases.find(p => week >= p.range[0] && week <= p.range[1]) || phases[0];
    roadmap.push({
      week,
      theme: phase.theme,
      objectives: [
        `Execute primary ${pathType} lever for week ${week}`,
        `Audit objective alignment with: ${goal.substring(0, 30)}...`,
        `Maintain operational constraints: ${constraints.substring(0, 30)}...`
      ],
      daily: {
        morning: "08:00 AM: Strategic deep work on core objective.",
        afternoon: "02:00 PM: Tactical outreach and resource management.",
        evening: "08:00 PM: Daily performance audit and Day+1 planning."
      },
      milestone: `Verification of Week ${week} trajectory completion.`,
      contingency: "Revert to baseline preservation protocols if performance drops below 80%."
    });
  }

  return {
    summary: `This 12-week ${pathType} trajectory is engineered to achieve your goal of "${goal}" by systematically addressing the situation: "${situation.substring(0, 50)}...".`,
    roadmap,
    rituals: [
      "05:00 AM: Physiological priming (Exercise/Hydration)",
      "09:00 PM: Digital blackout and cognitive recovery",
      "Sunday 18:00: Weekly structural audit"
    ],
    risks: [
      { threat: "Burnout/Cognitive Load", mitigation: "Enforce strict work-rest cycles and digital boundaries." },
      { threat: "Scope Creep", mitigation: "Aggressively prune non-essential tasks every 7 days." }
    ],
    resources: ["Focused time (4 hours/day)", "Strategic support network", "Existence Brief Dashboard"],
    accountability: "Weekly progress log reviewed against pre-defined KPIs."
  };
}
