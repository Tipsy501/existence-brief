/**
 * Simple A/B testing framework
 */

type TestConfig = {
  variants: string[];
};

const TESTS: Record<string, TestConfig> = {
  hero_headline: {
    variants: [
      'Stop Guessing. Synthesize Your Execution Plan.',
      'Your Tactical Roadmap to Strategic Clarity.',
      'The Last Strategy Tool You\'ll Ever Need.'
    ]
  },
  cta_label: {
    variants: [
      'Generate Your Brief',
      'Start Free Execution Plan',
      'Get Strategic Clarity'
    ]
  }
};

export function getVariant(testName: string): string {
  if (typeof window === 'undefined') return TESTS[testName].variants[0];
  
  const saved = localStorage.getItem(`ab_test_${testName}`);
  if (saved) return saved;

  const randomIndex = Math.floor(Math.random() * TESTS[testName].variants.length);
  const variant = TESTS[testName].variants[randomIndex];
  
  localStorage.setItem(`ab_test_${testName}`, variant);
  
  // Log event for analytics
  console.log(`[A/B Test] ${testName} variant: ${variant}`);
  
  return variant;
}
