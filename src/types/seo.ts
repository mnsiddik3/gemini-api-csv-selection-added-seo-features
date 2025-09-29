export interface KeywordMetrics {
  keyword: string;
  priority: number; // 1-10 (10 = highest priority)
  searchVolume: 'high' | 'medium' | 'low';
  trend: 'rising' | 'stable' | 'declining';
  competition: 'high' | 'medium' | 'low';
  commercialValue: number; // 1-10 (10 = highest commercial value)
}

export interface SeoOptimization {
  prioritizedKeywords: KeywordMetrics[];
  trendingKeywords: string[];
  highVolumeKeywords: string[];
  lowCompetitionKeywords: string[];
  commercialKeywords: string[];
  longTailKeywords: string[];
}

export interface CompetitorInsights {
  commonPatterns: string[];
  successfulKeywordCombinations: string[];
  marketGaps: string[];
  recommendedFocus: string;
}

export interface SeoAnalysis {
  optimization: SeoOptimization;
  competitorInsights: CompetitorInsights;
  recommendations: string[];
  seoScore: number; // 0-100
}