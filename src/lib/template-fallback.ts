import { BriefResult, DetailedPlanResult } from './ai-service';

/**
 * Generates a simple brief if all AI providers fail.
 * This ensures "Guaranteed Response" logic where the user always receives a path.
 */
export function generateTemplateBrief(situation: string, goal: string, constraints: string): BriefResult {
  const shortGoal = goal.length > 60 ? goal.substring(0, 60) + "..." : goal;
  const shortSituation = situation.length > 100 ? situation.substring(0, 100) + "..." : situation;

  return {
    summary: `The Bottom Line: You want to achieve: "${shortGoal}". This plan gives you three clear ways to handle your current situation: "${shortSituation}".`,
    paths: {
      safe: {
        title: "Slow & Steady",
        description: "6-12 months. Low risk, gradual progress while maintaining absolute stability.",
        pros: ["minimal risk", "sustainable pace"],
        cons: ["takes longer"]
      },
      balanced: {
        title: "Balanced Speed",
        description: "3-6 months. Moderate pace. Strategic risk taking with a solid fallback plan.",
        pros: ["faster results", "managed risk"],
        cons: ["requires higher discipline"]
      },
      growth: {
        title: "Fast Track",
        description: "30-90 days. High growth. Aggressive moves, maximal effort, no safety net.",
        pros: ["immediate results", "huge momentum"],
        cons: ["high stress", "high risk"]
      }
    },
    comparison: "Slow & Steady is about security. Balanced Speed is about balance. Fast Track is about maximum speed.",
    recommendedPath: "balanced",
    actionPlan: {
      day30: [
        "Find the one thing taking up too much of your time and stop doing it.",
        "Set up a simple weekly check-in to see how you're doing.",
        "Talk to one person who has already done what you want to do."
      ],
      day60: [
        "Focus on the most important task you found in the first month.",
        "Create a simple system for your daily tasks to save energy.",
        "Get feedback on your progress from someone you trust."
      ],
      day90: [
        "Look at your progress and decide if you need to change anything.",
        "Celebrate how far you've come and set your next big goal.",
        "Turn your successful actions into permanent habits."
      ]
    },
    focusStatement: `Your Mantra: "I am moving toward '${shortGoal}' with one clear step at a time."`
  };
}

/**
 * Generates a detailed roadmap using a simple template when AI is busy.
 */
export function generateTemplateDetailedPlan(
  pathType: 'safe' | 'balanced' | 'growth',
  situation: string,
  goal: string,
  constraints: string
): DetailedPlanResult {
  const roadmap: DetailedPlanResult['roadmap'] = [];

  const timelineMap = {
    safe: { timeline: '6-12 months', unit: 'biweek' as const, count: 12, periodName: 'Bi-week' },
    balanced: { timeline: '3-6 months', unit: 'week' as const, count: 12, periodName: 'Week' },
    growth: { timeline: '30-90 days', unit: 'day' as const, count: 15, periodName: 'Day' }
  };

  const { timeline, unit, count, periodName } = timelineMap[pathType];

  for (let period = 1; period <= count; period++) {
    roadmap.push({
      period,
      unit,
      theme: `Phase of ${pathType} evolution`,
      objectives: [
        `Work on your main ${pathType} task for ${periodName} ${period}`,
        `Check if you are still on track for: ${goal.substring(0, 30)}...`,
        `Keep in mind your limits: ${constraints.substring(0, 30)}...`
      ],
      daily: {
        morning: "08:00 AM: Work on your main goal",
        afternoon: "02:00 PM: Focus on high-impact actions",
        evening: "08:00 PM: Review progress and plan tomorrow"
      },
      milestone: `Complete everything planned for ${periodName} ${period}.`,
      contingency: "If you get overwhelmed, go back to the simplest version of your plan."
    });
  }

  return {
    summary: `Your step-by-step plan: This ${timeline} ${pathType} plan helps you reach your goal of "${goal}" by working through your current situation.`,
    timeline,
    startDate: 'Now',
    endDate: 'Strategic Completion',
    roadmap,
    rituals: [
      "Drink water and move your body first thing in the morning",
      "Turn off screens an hour before bed to rest your brain",
      "Regularly review your goal and adjust your focus"
    ],
    risks: [
      { threat: "Feeling tired or overwhelmed", mitigation: "Take small breaks and stick to your schedule." },
      { threat: "Trying to do too much", mitigation: "Focus only on the most important tasks." }
    ],
    resources: ["Focused time", "Helpful mentors", "Existence Brief Dashboard"],
    accountability: "Keep a simple log of what you did."
  };
}
