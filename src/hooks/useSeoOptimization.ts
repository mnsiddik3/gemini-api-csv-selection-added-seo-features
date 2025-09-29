import { useState, useCallback } from 'react';
import { 
  analyzeKeywordMetrics, 
  generateSeoOptimization, 
  generateCompetitorInsights, 
  calculateSeoScore, 
  generateSeoRecommendations 
} from '@/utils/seoHelpers';
import { SeoAnalysis } from '@/types/seo';

export const useSeoOptimization = () => {
  const [seoAnalysis, setSeoAnalysis] = useState<SeoAnalysis | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSeo = useCallback(async (
    keywords: string[], 
    title: string, 
    description: string, 
    category: string
  ): Promise<SeoAnalysis> => {
    setLoading(true);
    
    try {
      // Simulate some processing time for realism
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Analyze keyword metrics
      const keywordMetrics = analyzeKeywordMetrics(keywords);
      
      // Generate SEO optimization suggestions
      const optimization = generateSeoOptimization(keywordMetrics);
      
      // Generate competitor insights
      const competitorInsights = generateCompetitorInsights(category, keywords);
      
      // Calculate SEO score
      const seoScore = calculateSeoScore(keywordMetrics, title, description);
      
      // Generate recommendations
      const recommendations = generateSeoRecommendations(optimization, competitorInsights, seoScore);
      
      const analysis: SeoAnalysis = {
        optimization,
        competitorInsights,
        recommendations,
        seoScore
      };
      
      setSeoAnalysis(analysis);
      return analysis;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    seoAnalysis,
    analyzeSeo,
    loading
  };
};