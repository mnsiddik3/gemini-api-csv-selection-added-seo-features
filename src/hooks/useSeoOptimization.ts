import { useState } from 'react';
import { SeoOptimizedResult, SeoKeyword, TrendKeyword } from '@/types/seo';
import { 
  calculateKeywordPriority, 
  calculateSeoMetrics, 
  generateOptimizationSuggestions,
  TRENDING_KEYWORDS 
} from '@/utils/seoHelpers';

interface MetadataResult {
  title: string;
  alternativeTitles?: string[];
  description: string;
  keywords: string[];
  category: string;
}

export const useSeoOptimization = () => {
  const [optimizing, setOptimizing] = useState(false);

  // Optimize metadata with SEO enhancements
  const optimizeMetadata = async (
    metadata: MetadataResult,
    imageContent?: string[]
  ): Promise<SeoOptimizedResult> => {
    setOptimizing(true);

    try {
      // Analyze keywords and assign SEO properties
      const seoKeywords: SeoKeyword[] = metadata.keywords.map(keyword => {
        const isVisible = imageContent?.some(content => 
          content.toLowerCase().includes(keyword.toLowerCase())
        ) || false;
        
        return calculateKeywordPriority(keyword, metadata.category, isVisible);
      });

      // Sort keywords by priority (highest first)
      seoKeywords.sort((a, b) => b.priority - a.priority);

      // Reorder original keywords array based on SEO priority
      const optimizedKeywords = seoKeywords.map(sk => sk.keyword);

      // Add trending keywords if relevant to category
      const categoryRelevantTrends = TRENDING_KEYWORDS.filter(trend => {
        const categoryLower = metadata.category.toLowerCase();
        const keywordLower = trend.keyword.toLowerCase();
        
        // Check if trending keyword is relevant to the image category
        if (categoryLower.includes('business') || categoryLower.includes('corporate')) {
          return ['ai technology', 'digital transformation', 'remote work', 'sustainability'].includes(trend.keyword);
        }
        if (categoryLower.includes('technology')) {
          return ['ai technology', 'virtual reality', 'cryptocurrency', 'digital transformation'].includes(trend.keyword);
        }
        if (categoryLower.includes('lifestyle') || categoryLower.includes('health')) {
          return ['mental health', 'sustainability', 'eco friendly'].includes(trend.keyword);
        }
        if (categoryLower.includes('transport') || categoryLower.includes('vehicle')) {
          return ['electric vehicle', 'renewable energy', 'sustainability'].includes(trend.keyword);
        }
        
        return false;
      });

      // Add top 2 relevant trending keywords if space allows
      const trendKeywordsToAdd = categoryRelevantTrends
        .slice(0, 2)
        .map(trend => trend.keyword)
        .filter(keyword => !optimizedKeywords.includes(keyword));

      const finalKeywords = [...optimizedKeywords.slice(0, 48), ...trendKeywordsToAdd].slice(0, 50);

      // Recalculate SEO keywords for final list
      const finalSeoKeywords: SeoKeyword[] = finalKeywords.map(keyword => {
        const isVisible = imageContent?.some(content => 
          content.toLowerCase().includes(keyword.toLowerCase())
        ) || false;
        
        return calculateKeywordPriority(keyword, metadata.category, isVisible);
      });

      // Optimize title for SEO
      const optimizedTitle = optimizeTitle(metadata.title, finalSeoKeywords.slice(0, 5));

      // Optimize description for SEO  
      const optimizedDescription = optimizeDescription(metadata.description, finalSeoKeywords.slice(0, 8));

      // Calculate SEO metrics
      const seoMetrics = calculateSeoMetrics(optimizedTitle, optimizedDescription, finalKeywords);

      // Generate optimization suggestions
      const optimizationSuggestions = generateOptimizationSuggestions(
        optimizedTitle,
        optimizedDescription,
        finalKeywords,
        seoMetrics
      );

      return {
        title: optimizedTitle,
        alternativeTitles: metadata.alternativeTitles?.map(altTitle => 
          optimizeTitle(altTitle, finalSeoKeywords.slice(5, 10))
        ),
        description: optimizedDescription,
        keywords: finalKeywords,
        seoKeywords: finalSeoKeywords,
        category: metadata.category,
        seoMetrics,
        optimizationSuggestions
      };

    } finally {
      setOptimizing(false);
    }
  };

  // Optimize title for better SEO
  const optimizeTitle = (title: string, topKeywords: SeoKeyword[]): string => {
    let optimized = title;
    
    // Ensure title length is optimal (6-12 words)
    const words = title.split(' ');
    if (words.length < 6) {
      // Add high-priority keywords to extend title
      const missingKeywords = topKeywords
        .filter(sk => !title.toLowerCase().includes(sk.keyword.toLowerCase()))
        .slice(0, 2);
      
      if (missingKeywords.length > 0) {
        optimized = `${title} - ${missingKeywords.map(k => k.keyword).join(', ')}`;
      }
    } else if (words.length > 12) {
      // Truncate while keeping important keywords
      optimized = words.slice(0, 12).join(' ');
    }

    return optimized;
  };

  // Optimize description for better SEO
  const optimizeDescription = (description: string, keywords: SeoKeyword[]): string => {
    let optimized = description;
    
    // Ensure optimal length (150-200 characters)
    if (description.length < 150) {
      // Add relevant keywords to extend description
      const missingKeywords = keywords
        .filter(sk => !description.toLowerCase().includes(sk.keyword.toLowerCase()))
        .slice(0, 3)
        .map(k => k.keyword);
      
      if (missingKeywords.length > 0) {
        optimized = `${description} Features ${missingKeywords.join(', ')}.`;
      }
    } else if (description.length > 200) {
      // Truncate to optimal length
      optimized = description.substring(0, 197) + '...';
    }

    return optimized;
  };

  // Get keyword suggestions based on category and trends
  const getKeywordSuggestions = (category: string, existingKeywords: string[]): string[] => {
    const suggestions: string[] = [];
    
    // Add trending keywords relevant to category
    const relevantTrends = TRENDING_KEYWORDS
      .filter(trend => {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('business')) {
          return ['ai technology', 'digital transformation', 'remote work', 'sustainability'].includes(trend.keyword);
        }
        if (categoryLower.includes('technology')) {
          return ['ai technology', 'virtual reality', 'cryptocurrency'].includes(trend.keyword);
        }
        return trend.relevance >= 8;
      })
      .map(trend => trend.keyword)
      .filter(keyword => !existingKeywords.includes(keyword));
    
    suggestions.push(...relevantTrends.slice(0, 5));
    
    return suggestions;
  };

  return {
    optimizeMetadata,
    getKeywordSuggestions,
    optimizing
  };
};
