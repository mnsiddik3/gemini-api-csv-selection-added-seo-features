import { KeywordMetrics, SeoOptimization, CompetitorInsights, SeoAnalysis } from '@/types/seo';

// Simulated keyword ranking data (in a real app, this would come from APIs like Google Keyword Planner, Ahrefs, etc.)
const keywordRankingData = {
  // Business related keywords (higher commercial value)
  business: { priority: 8, searchVolume: 'high' as const, trend: 'stable' as const, competition: 'high' as const, commercialValue: 9 },
  corporate: { priority: 7, searchVolume: 'high' as const, trend: 'stable' as const, competition: 'high' as const, commercialValue: 8 },
  professional: { priority: 8, searchVolume: 'high' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 8 },
  office: { priority: 6, searchVolume: 'medium' as const, trend: 'stable' as const, competition: 'medium' as const, commercialValue: 7 },
  teamwork: { priority: 7, searchVolume: 'medium' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 7 },
  meeting: { priority: 6, searchVolume: 'medium' as const, trend: 'stable' as const, competition: 'medium' as const, commercialValue: 6 },
  
  // Technology keywords (high demand)
  technology: { priority: 9, searchVolume: 'high' as const, trend: 'rising' as const, competition: 'high' as const, commercialValue: 9 },
  innovation: { priority: 8, searchVolume: 'medium' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 8 },
  digital: { priority: 9, searchVolume: 'high' as const, trend: 'rising' as const, competition: 'high' as const, commercialValue: 8 },
  artificial: { priority: 9, searchVolume: 'high' as const, trend: 'rising' as const, competition: 'high' as const, commercialValue: 9 },
  intelligence: { priority: 9, searchVolume: 'high' as const, trend: 'rising' as const, competition: 'high' as const, commercialValue: 9 },
  
  // Nature and lifestyle (trending up)
  nature: { priority: 7, searchVolume: 'high' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 6 },
  sustainability: { priority: 8, searchVolume: 'medium' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 7 },
  eco: { priority: 7, searchVolume: 'medium' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 7 },
  wellness: { priority: 7, searchVolume: 'medium' as const, trend: 'rising' as const, competition: 'medium' as const, commercialValue: 8 },
  
  // Visual and design keywords
  minimalist: { priority: 6, searchVolume: 'medium' as const, trend: 'stable' as const, competition: 'medium' as const, commercialValue: 6 },
  modern: { priority: 6, searchVolume: 'high' as const, trend: 'stable' as const, competition: 'high' as const, commercialValue: 6 },
  abstract: { priority: 5, searchVolume: 'medium' as const, trend: 'stable' as const, competition: 'medium' as const, commercialValue: 5 },
  creative: { priority: 6, searchVolume: 'medium' as const, trend: 'stable' as const, competition: 'high' as const, commercialValue: 6 },
  
  // Default for unmatched keywords
  default: { priority: 5, searchVolume: 'medium' as const, trend: 'stable' as const, competition: 'medium' as const, commercialValue: 5 }
};

export const analyzeKeywordMetrics = (keywords: string[]): KeywordMetrics[] => {
  return keywords.map(keyword => {
    const keywordLower = keyword.toLowerCase();
    
    // Find matching keyword data or use default
    const matchedKey = Object.keys(keywordRankingData).find(key => 
      keywordLower.includes(key) || key.includes(keywordLower)
    );
    
    const data = matchedKey ? keywordRankingData[matchedKey as keyof typeof keywordRankingData] : keywordRankingData.default;
    
    // Add some variation to avoid all keywords having the same metrics
    const priorityVariation = Math.floor(Math.random() * 2) - 1; // -1, 0, or 1
    const commercialVariation = Math.floor(Math.random() * 2) - 1;
    
    return {
      keyword,
      priority: Math.max(1, Math.min(10, data.priority + priorityVariation)),
      searchVolume: data.searchVolume,
      trend: data.trend,
      competition: data.competition,
      commercialValue: Math.max(1, Math.min(10, data.commercialValue + commercialVariation))
    };
  });
};

export const generateSeoOptimization = (keywordMetrics: KeywordMetrics[]): SeoOptimization => {
  const prioritizedKeywords = [...keywordMetrics].sort((a, b) => b.priority - a.priority);
  
  const trendingKeywords = keywordMetrics
    .filter(k => k.trend === 'rising')
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10)
    .map(k => k.keyword);
  
  const highVolumeKeywords = keywordMetrics
    .filter(k => k.searchVolume === 'high')
    .sort((a, b) => b.commercialValue - a.commercialValue)
    .slice(0, 15)
    .map(k => k.keyword);
  
  const lowCompetitionKeywords = keywordMetrics
    .filter(k => k.competition === 'low' || k.competition === 'medium')
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 12)
    .map(k => k.keyword);
  
  const commercialKeywords = keywordMetrics
    .filter(k => k.commercialValue >= 7)
    .sort((a, b) => b.commercialValue - a.commercialValue)
    .slice(0, 12)
    .map(k => k.keyword);
  
  // Generate long-tail keyword suggestions
  const longTailKeywords = keywordMetrics
    .filter(k => k.keyword.split(' ').length >= 2)
    .sort((a, b) => b.commercialValue - a.commercialValue)
    .slice(0, 8)
    .map(k => k.keyword);
  
  return {
    prioritizedKeywords,
    trendingKeywords,
    highVolumeKeywords,
    lowCompetitionKeywords,
    commercialKeywords,
    longTailKeywords
  };
};

export const generateCompetitorInsights = (category: string, keywords: string[]): CompetitorInsights => {
  // Simulated competitor analysis based on category
  const insights: Record<string, CompetitorInsights> = {
    business: {
      commonPatterns: ['corporate team', 'professional meeting', 'office workspace', 'business strategy'],
      successfulKeywordCombinations: ['corporate + professional', 'team + collaboration', 'office + modern'],
      marketGaps: ['remote work wellness', 'hybrid office design', 'sustainable business practices'],
      recommendedFocus: 'Focus on modern workplace trends and remote collaboration themes'
    },
    technology: {
      commonPatterns: ['artificial intelligence', 'digital innovation', 'tech startup', 'data visualization'],
      successfulKeywordCombinations: ['AI + innovation', 'digital + transformation', 'tech + modern'],
      marketGaps: ['quantum computing visuals', 'blockchain illustrations', 'metaverse concepts'],
      recommendedFocus: 'Emphasize cutting-edge tech concepts and futuristic designs'
    },
    nature: {
      commonPatterns: ['natural landscape', 'eco-friendly', 'sustainability', 'green energy'],
      successfulKeywordCombinations: ['eco + sustainable', 'nature + conservation', 'green + renewable'],
      marketGaps: ['urban nature integration', 'climate change solutions', 'biodiversity protection'],
      recommendedFocus: 'Highlight environmental consciousness and climate action themes'
    },
    default: {
      commonPatterns: ['modern design', 'creative concept', 'professional quality', 'high resolution'],
      successfulKeywordCombinations: ['modern + creative', 'professional + quality', 'design + concept'],
      marketGaps: ['personalized content', 'accessibility focused', 'multi-cultural perspectives'],
      recommendedFocus: 'Focus on unique perspectives and underserved market segments'
    }
  };
  
  const categoryLower = category.toLowerCase();
  const matchedCategory = Object.keys(insights).find(key => 
    categoryLower.includes(key) || key === 'default'
  );
  
  return insights[matchedCategory || 'default'];
};

export const calculateSeoScore = (
  keywordMetrics: KeywordMetrics[], 
  title: string, 
  description: string
): number => {
  let score = 0;
  
  // Keyword diversity score (0-25)
  const highPriorityCount = keywordMetrics.filter(k => k.priority >= 7).length;
  const trendingCount = keywordMetrics.filter(k => k.trend === 'rising').length;
  const commercialCount = keywordMetrics.filter(k => k.commercialValue >= 7).length;
  
  score += Math.min(25, (highPriorityCount * 2) + (trendingCount * 1.5) + (commercialCount * 1.5));
  
  // Title optimization (0-25)
  const titleWords = title.toLowerCase().split(' ');
  const titleKeywordMatch = keywordMetrics.filter(k => 
    titleWords.some(word => k.keyword.toLowerCase().includes(word))
  ).length;
  score += Math.min(25, titleKeywordMatch * 5);
  
  // Description optimization (0-20)
  const descWords = description.toLowerCase().split(' ');
  const descKeywordMatch = keywordMetrics.filter(k => 
    descWords.some(word => k.keyword.toLowerCase().includes(word))
  ).length;
  score += Math.min(20, descKeywordMatch * 3);
  
  // Competition balance (0-15)
  const lowCompetitionCount = keywordMetrics.filter(k => k.competition === 'low').length;
  const mediumCompetitionCount = keywordMetrics.filter(k => k.competition === 'medium').length;
  score += Math.min(15, (lowCompetitionCount * 2) + (mediumCompetitionCount * 1));
  
  // Search volume optimization (0-15)
  const highVolumeCount = keywordMetrics.filter(k => k.searchVolume === 'high').length;
  const mediumVolumeCount = keywordMetrics.filter(k => k.searchVolume === 'medium').length;
  score += Math.min(15, (highVolumeCount * 2) + (mediumVolumeCount * 1));
  
  return Math.round(Math.min(100, score));
};

export const generateSeoRecommendations = (
  seoOptimization: SeoOptimization,
  competitorInsights: CompetitorInsights,
  seoScore: number
): string[] => {
  const recommendations: string[] = [];
  
  if (seoScore < 50) {
    recommendations.push('Consider using more high-priority keywords in your title and description');
  }
  
  if (seoOptimization.trendingKeywords.length > 0) {
    recommendations.push(`Include trending keywords: ${seoOptimization.trendingKeywords.slice(0, 3).join(', ')}`);
  }
  
  if (seoOptimization.lowCompetitionKeywords.length > 0) {
    recommendations.push(`Target low-competition keywords for better ranking: ${seoOptimization.lowCompetitionKeywords.slice(0, 3).join(', ')}`);
  }
  
  if (seoOptimization.longTailKeywords.length > 0) {
    recommendations.push(`Use long-tail keywords for specific searches: ${seoOptimization.longTailKeywords.slice(0, 2).join(', ')}`);
  }
  
  recommendations.push(competitorInsights.recommendedFocus);
  
  if (competitorInsights.marketGaps.length > 0) {
    recommendations.push(`Explore market gaps: ${competitorInsights.marketGaps.slice(0, 2).join(', ')}`);
  }
  
  return recommendations;
};