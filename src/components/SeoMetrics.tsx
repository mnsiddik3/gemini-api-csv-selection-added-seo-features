import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Search, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SeoMetrics as SeoMetricsType, SeoKeyword } from '@/types/seo';

interface SeoMetricsProps {
  seoMetrics: SeoMetricsType;
  seoKeywords: SeoKeyword[];
  optimizationSuggestions: string[];
  showDetails?: boolean;
}

export const SeoMetrics = ({ 
  seoMetrics, 
  seoKeywords, 
  optimizationSuggestions,
  showDetails = true 
}: SeoMetricsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const priorityKeywords = seoKeywords
    .filter(k => k.priority >= 8)
    .slice(0, 10);

  const trendingKeywords = seoKeywords
    .filter(k => k.category === 'trend')
    .slice(0, 5);

  const highValueKeywords = seoKeywords
    .filter(k => k.commercialValue >= 8)
    .slice(0, 8);

  return (
    <div className="space-y-4">
      {/* Overall SEO Score */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            SEO Performance
          </h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((seoMetrics.titleScore + seoMetrics.descriptionScore) / 2)}%
            </div>
            <div className="text-sm text-muted-foreground">Overall Score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`text-xl font-bold ${getScoreColor(seoMetrics.titleScore)}`}>
              {Math.round(seoMetrics.titleScore)}%
            </div>
            <div className="text-sm text-muted-foreground">Title SEO</div>
            <Progress value={seoMetrics.titleScore} className="h-2 mt-1" />
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold ${getScoreColor(seoMetrics.descriptionScore)}`}>
              {Math.round(seoMetrics.descriptionScore)}%
            </div>
            <div className="text-sm text-muted-foreground">Description</div>
            <Progress value={seoMetrics.descriptionScore} className="h-2 mt-1" />
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold ${getScoreColor(seoMetrics.competitorAlignment)}`}>
              {Math.round(seoMetrics.competitorAlignment)}%
            </div>
            <div className="text-sm text-muted-foreground">Commercial</div>
            <Progress value={seoMetrics.competitorAlignment} className="h-2 mt-1" />
          </div>

          <div className="text-center">
            <div className={`text-xl font-bold ${getScoreColor(seoMetrics.trendRelevance)}`}>
              {Math.round(seoMetrics.trendRelevance)}%
            </div>
            <div className="text-sm text-muted-foreground">Trends</div>
            <Progress value={seoMetrics.trendRelevance} className="h-2 mt-1" />
          </div>
        </div>
      </Card>

      {showDetails && (
        <>
          {/* Priority Keywords */}
          <Card className="p-4">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-600" />
              High Priority Keywords (Top 10)
            </h4>
            <div className="flex flex-wrap gap-2">
              {priorityKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-green-100 text-green-800 border-green-300"
                >
                  {keyword.keyword}
                  <span className="ml-1 text-xs">({keyword.priority}/10)</span>
                </Badge>
              ))}
            </div>
          </Card>

          {/* Trending Keywords */}
          {trendingKeywords.length > 0 && (
            <Card className="p-4">
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                Trending Keywords 2024-25
              </h4>
              <div className="flex flex-wrap gap-2">
                {trendingKeywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 border-purple-300"
                  >
                    {keyword.keyword}
                    <span className="ml-1 text-xs">🔥</span>
                  </Badge>
                ))}
              </div>
            </Card>
          )}

          {/* Commercial Keywords */}
          <Card className="p-4">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              High Commercial Value
            </h4>
            <div className="flex flex-wrap gap-2">
              {highValueKeywords.map((keyword, index) => (
                <Badge 
                  key={index} 
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 border-blue-300"
                >
                  {keyword.keyword}
                  <span className="ml-1 text-xs">💰</span>
                </Badge>
              ))}
            </div>
          </Card>

          {/* Optimization Suggestions */}
          {optimizationSuggestions.length > 0 && (
            <Card className="p-4 border-orange-200 bg-orange-50">
              <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                SEO Optimization Suggestions
              </h4>
              <ul className="space-y-2">
                {optimizationSuggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Keyword Distribution */}
          <Card className="p-4">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-600" />
              Keyword Analysis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="font-semibold text-lg">
                  {seoKeywords.filter(k => k.category === 'primary').length}
                </div>
                <div className="text-muted-foreground">Primary</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="font-semibold text-lg">
                  {seoKeywords.filter(k => k.category === 'long-tail').length}
                </div>
                <div className="text-muted-foreground">Long-tail</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="font-semibold text-lg">
                  {seoKeywords.filter(k => k.searchVolume === 'high').length}
                </div>
                <div className="text-muted-foreground">High Volume</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="font-semibold text-lg">
                  {Math.round(seoMetrics.keywordDensity * 10) / 10}%
                </div>
                <div className="text-muted-foreground">Density</div>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};