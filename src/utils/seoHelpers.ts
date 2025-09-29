import { SeoKeyword, TrendKeyword, SeoMetrics } from '@/types/seo';

// High-value keywords for microstock platforms
export const HIGH_VALUE_KEYWORDS = {
  business: ['strategy', 'success', 'growth', 'leadership', 'innovation', 'digital', 'corporate'],
  technology: ['ai', 'blockchain', 'cloud', 'data', 'cybersecurity', 'automation', 'software'],
  lifestyle: ['wellness', 'fitness', 'travel', 'food', 'family', 'home', 'fashion'],
  finance: ['investment', 'banking', 'cryptocurrency', 'trading', 'insurance', 'budget'],
  medical: ['healthcare', 'medical', 'hospital', 'doctor', 'nurse', 'medicine', 'health'],
  education: ['learning', 'student', 'university', 'graduation', 'knowledge', 'training']
};

// Trending keywords for 2024-2025
export const TRENDING_KEYWORDS: TrendKeyword[] = [
  { keyword: 'sustainability', trend: 'rising', volume: 95, relevance: 9 },
  { keyword: 'remote work', trend: 'stable', volume: 88, relevance: 8 },
  { keyword: 'ai technology', trend: 'rising', volume: 92, relevance: 10 },
  { keyword: 'electric vehicle', trend: 'rising', volume: 85, relevance: 8 },
  { keyword: 'mental health', trend: 'rising', volume: 90, relevance: 9 },
  { keyword: 'eco friendly', trend: 'rising', volume: 87, relevance: 8 },
  { keyword: 'digital transformation', trend: 'stable', volume: 83, relevance: 8 },
  { keyword: 'renewable energy', trend: 'rising', volume: 89, relevance: 9 },
  { keyword: 'cryptocurrency', trend: 'stable', volume: 78, relevance: 7 },
  { keyword: 'virtual reality', trend: 'rising', volume: 82, relevance: 8 }
];

// Calculate keyword priority based on multiple factors
export const calculateKeywordPriority = (
  keyword: string,
  category: string,
  isVisible: boolean = false
): SeoKeyword => {
  const keywordLower = keyword.toLowerCase();
  
  // Base priority
  let priority = 5;
  let commercialValue = 5;
  let searchVolume: 'high' | 'medium' | 'low' = 'medium';
  let competition: 'high' | 'medium' | 'low' = 'medium';
  let keywordCategory: 'primary' | 'secondary' | 'long-tail' | 'trend' = 'secondary';

  // If keyword is visible in image, high priority
  if (isVisible) {
    priority += 3;
    keywordCategory = 'primary';
  }

  // Check high-value keywords
  Object.entries(HIGH_VALUE_KEYWORDS).forEach(([cat, keywords]) => {
    if (keywords.some(k => keywordLower.includes(k.toLowerCase()))) {
      priority += 2;
      commercialValue += 2;
      searchVolume = 'high';
      competition = 'high';
    }
  });

  // Check trending keywords
  const trendMatch = TRENDING_KEYWORDS.find(t => 
    keywordLower.includes(t.keyword.toLowerCase()) || 
    t.keyword.toLowerCase().includes(keywordLower)
  );
  
  if (trendMatch) {
    priority += 2;
    commercialValue += 1;
    keywordCategory = 'trend';
    searchVolume = trendMatch.volume > 85 ? 'high' : 'medium';
  }

  // Long-tail keyword detection (3+ words)
  if (keyword.split(' ').length >= 3) {
    keywordCategory = 'long-tail';
    competition = 'low';
    commercialValue += 1;
  }

  // Specific industry terms get higher priority
  const industryTerms = ['professional', 'business', 'corporate', 'commercial', 'industry'];
  if (industryTerms.some(term => keywordLower.includes(term))) {
    priority += 1;
    commercialValue += 1;
  }

  // Cap values at maximum
  priority = Math.min(priority, 10);
  commercialValue = Math.min(commercialValue, 10);

  return {
    keyword,
    priority,
    searchVolume,
    competition,
    category: keywordCategory,
    commercialValue
  };
};

// Calculate SEO metrics for title and description
export const calculateSeoMetrics = (
  title: string,
  description: string,
  keywords: string[]
): SeoMetrics => {
  // Title Score (0-100)
  let titleScore = 50;
  
  // Length check (6-12 words ideal)
  const titleWords = title.split(' ').length;
  if (titleWords >= 6 && titleWords <= 12) titleScore += 20;
  else if (titleWords < 6) titleScore -= 10;
  else titleScore -= 5;
  
  // Keywords in title
  const titleKeywordCount = keywords.filter(k => 
    title.toLowerCase().includes(k.toLowerCase())
  ).length;
  titleScore += Math.min(titleKeywordCount * 5, 20);
  
  // Commercial terms in title
  const commercialTerms = ['professional', 'business', 'premium', 'quality', 'modern'];
  if (commercialTerms.some(term => title.toLowerCase().includes(term))) {
    titleScore += 10;
  }

  // Description Score (0-100)
  let descriptionScore = 50;
  
  // Length check (150-200 characters ideal)
  const descLength = description.length;
  if (descLength >= 150 && descLength <= 200) descriptionScore += 25;
  else if (descLength < 150) descriptionScore -= 10;
  else descriptionScore -= 5;
  
  // Keywords in description
  const descKeywordCount = keywords.filter(k => 
    description.toLowerCase().includes(k.toLowerCase())
  ).length;
  descriptionScore += Math.min(descKeywordCount * 3, 15);
  
  // Readability (avoid too complex sentences)
  const sentences = description.split('.').length;
  const avgWordsPerSentence = description.split(' ').length / sentences;
  const readabilityScore = avgWordsPerSentence <= 15 ? 80 : Math.max(50, 80 - (avgWordsPerSentence - 15) * 2);
  
  // Keyword density (2-4% ideal)
  const totalWords = (title + ' ' + description).split(' ').length;
  const keywordMentions = keywords.reduce((count, keyword) => {
    const mentions = (title + ' ' + description).toLowerCase().split(keyword.toLowerCase()).length - 1;
    return count + mentions;
  }, 0);
  const keywordDensity = (keywordMentions / totalWords) * 100;
  
  // Competitive alignment (based on keyword quality)
  const highValueKeywords = keywords.filter(k => {
    const keywordLower = k.toLowerCase();
    return Object.values(HIGH_VALUE_KEYWORDS).flat().some(hv => 
      keywordLower.includes(hv.toLowerCase())
    );
  }).length;
  const competitorAlignment = Math.min((highValueKeywords / keywords.length) * 100, 100);
  
  // Trend relevance
  const trendingKeywords = keywords.filter(k => 
    TRENDING_KEYWORDS.some(t => k.toLowerCase().includes(t.keyword.toLowerCase()))
  ).length;
  const trendRelevance = Math.min((trendingKeywords / keywords.length) * 100, 100);

  return {
    titleScore: Math.max(0, Math.min(100, titleScore)),
    descriptionScore: Math.max(0, Math.min(100, descriptionScore)),
    keywordDensity,
    readabilityScore,
    competitorAlignment,
    trendRelevance
  };
};

// Generate optimization suggestions
export const generateOptimizationSuggestions = (
  title: string,
  description: string,
  keywords: string[],
  metrics: SeoMetrics
): string[] => {
  const suggestions: string[] = [];

  if (metrics.titleScore < 70) {
    if (title.split(' ').length < 6) {
      suggestions.push('Title এ আরো descriptive keywords যোগ করুন (6-12 words ideal)');
    }
    if (title.split(' ').length > 12) {
      suggestions.push('Title সংক্ষিপ্ত করুন (12 words এর মধ্যে রাখুন)');
    }
  }

  if (metrics.descriptionScore < 70) {
    if (description.length < 150) {
      suggestions.push('Description আরো বিস্তারিত করুন (150-200 characters)');
    }
    if (description.length > 200) {
      suggestions.push('Description সংক্ষিপ্ত করুন (200 characters এর মধ্যে)');
    }
  }

  if (metrics.keywordDensity < 2) {
    suggestions.push('Title ও description এ আরো keywords ব্যবহার করুন');
  } else if (metrics.keywordDensity > 4) {
    suggestions.push('Keyword density কমান (2-4% ideal)');
  }

  if (metrics.competitorAlignment < 60) {
    suggestions.push('আরো commercial ও high-value keywords যোগ করুন');
  }

  if (metrics.trendRelevance < 40) {
    suggestions.push('বর্তমান trending keywords যোগ করুন');
  }

  if (metrics.readabilityScore < 70) {
    suggestions.push('Description আরো সহজ ও পড়ার যোগ্য করুন');
  }

  return suggestions;
};