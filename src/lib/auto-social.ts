/**
 * SEO & Viral sharing logic
 */

export function generateTweetText(goal: string, briefId: string): string {
  const shortGoal = goal.length > 50 ? goal.substring(0, 50) + '...' : goal;
  return `Someone just planned their "${shortGoal}" with Existence Brief. 🎯\n\nAI-synthesized strategic trajectories for life. \n\nGet your free brief here: https://existencebrief.com/p/${briefId}\n\n#StrategicPlanning #ExistenceBrief #AI`;
}

export function generateLinkedInContent(goal: string, briefId: string): string {
  return `Strategic clarity is just 3 questions away. 

Existence Brief just helped someone map their trajectory to "${goal}".

What's your next move?

Map your path: https://existencebrief.com/p/${briefId}

#CareerGrowth #LifeStrategist #ExistenceBrief`;
}
