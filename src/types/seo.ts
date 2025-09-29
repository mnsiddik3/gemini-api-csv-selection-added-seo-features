export interface SeoKeyword {
  keyword: string;
  priority: number; // 1-10 (10 = highest)
  searchVolume: 'high' | 'medium' | 'low';
  competition: 'high' | 'medium' | 'low';
  category: 'primary' | 'secondary' | 'long-tail' | 'trend';
  commercialValue: number; // 1-10
}

export interface SeoMetrics {
  titleScore: number; // 1-100
  descriptionScore: number; // 1-100
  keywordDensity: number;
  readabilityScore: number;
  competitorAlignment: number;
  trendRelevance: number;
}

export interface SeoOptimizedResult {
  title: string;
  alternativeTitles?: string[];
  description: string;
  keywords: string[];
  seoKeywords: SeoKeyword[];
  category: string;
  seoMetrics: SeoMetrics;
  optimizationSuggestions: string[];
}

export interface TrendKeyword {
  keyword: string;
  trend: 'rising' | 'stable' | 'declining';
  volume: number;
  relevance: number;
}

export interface CompetitorData {
  popularKeywords: string[];
  winningTitles: string[];
  commonDescriptions: string[];
  categoryTrends: string[];
}