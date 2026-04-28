import { supabase } from './supabase';

/**
 * Generates a mock weekly newsletter based on top briefs
 */
export async function generateWeeklyNewsletter() {
  const { data: topBriefs } = await supabase
    .from('briefs')
    .select('id, goal, summary')
    .eq('is_public', true)
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = {
    totalBriefs: 500, // Replace with real count
    topGoals: topBriefs?.map(b => b.goal) || ['Career Transition', 'Starting a Business']
  };

  return {
    subject: `Weekly Clarity: ${stats.totalBriefs} New Roadmaps Synthesized`,
    content: `
      # Strategic Weekly Recap
      
      This week, our intelligence grid processed ${stats.totalBriefs} unique situational briefs.
      
      ## Top Goals This Week:
      ${stats.topGoals.map(g => `- ${g}`).join('\n')}
      
      ## Featured Roadmap
      "${topBriefs?.[0]?.goal || 'Strategic Career Pivot'}"
      
      Read the full declassified Roadmap: https://existencebrief.com/p/${topBriefs?.[0]?.id || 'featured'}
      
      ---
      Build your own trajectory: https://existencebrief.com
    `,
    sent_at: new Date().toISOString()
  };
}
