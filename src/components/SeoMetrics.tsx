import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Star, 
  BarChart3, 
  Lightbulb, 
  Copy,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { SeoAnalysis } from '@/types/seo';
import { useToast } from '@/hooks/use-toast';

interface SeoMetricsProps {
  seoAnalysis: SeoAnalysis;
  onCopyKeywords?: (keywords: string[]) => void;
}

export const SeoMetrics: React.FC<SeoMetricsProps> = ({ seoAnalysis, onCopyKeywords }) => {
  const { toast } = useToast();
  const { optimization, competitorInsights, recommendations, seoScore } = seoAnalysis;

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${description} copied to clipboard.`,
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card className="p-6 bg-gradient-subtle border-brand-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-brand-primary" />
            <h3 className="text-lg font-semibold text-foreground">SEO Optimization Score</h3>
          </div>
          {getScoreIcon(seoScore)}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">{seoScore}/100</span>
            <Badge 
              variant="outline" 
              className={`${getScoreColor(seoScore)} border-current`}
            >
              {seoScore >= 80 ? 'Excellent' : seoScore >= 60 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          
          <Progress value={seoScore} className="h-3" />
          
          <p className="text-sm text-muted-foreground">
            {seoScore >= 80 
              ? 'Your keywords are well-optimized for search and sales!' 
              : seoScore >= 60 
              ? 'Good optimization with room for improvement.'
              : 'Consider implementing the recommendations below to boost your SEO score.'
            }
          </p>
        </div>
      </Card>

      {/* Priority Keywords */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-brand-accent" />
            <h3 className="text-lg font-semibold text-foreground">
              Priority Keywords (গুরুত্ব অনুযায়ী সাজানো)
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              variant="brandOutline"
              size="sm"
              onClick={() => {
                const keywords = optimization.prioritizedKeywords.slice(0, 15).map(k => k.keyword);
                copyToClipboard(keywords.join(', '), 'Priority keywords');
                onCopyKeywords?.(keywords);
              }}
            >
              Copy Top 15
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={() => {
                const keywords = optimization.prioritizedKeywords.slice(0, 15).map(k => k.keyword);
                onCopyKeywords?.(keywords);
                toast({
                  title: "Added to Top Keywords!",
                  description: `${keywords.length} priority keywords added to Top Keywords section.`,
                });
              }}
            >
              Add to Top Keywords
            </Button>
          </div>
        </div>
        
        <div className="grid gap-2">
          {optimization.prioritizedKeywords.slice(0, 15).map((keywordData, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">
                  #{index + 1}
                </Badge>
                <span className="font-medium text-foreground">{keywordData.keyword}</span>
                <Badge variant="outline" className="text-xs">
                  Priority: {keywordData.priority}/10
                </Badge>
                {keywordData.trend === 'rising' && (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </Badge>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => copyToClipboard(keywordData.keyword, 'Keyword')}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* SEO Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trending Keywords */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-foreground">Trending Keywords</h4>
            <Badge variant="outline" className="text-xs">
              {optimization.trendingKeywords.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {optimization.trendingKeywords.slice(0, 8).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{keyword}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(keyword, 'Trending keyword')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          {optimization.trendingKeywords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                copyToClipboard(optimization.trendingKeywords.join(', '), 'All trending keywords');
                onCopyKeywords?.(optimization.trendingKeywords);
              }}
            >
              Copy All Trending
            </Button>
          )}
        </Card>

        {/* High Volume Keywords */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-foreground">High Search Volume</h4>
            <Badge variant="outline" className="text-xs">
              {optimization.highVolumeKeywords.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {optimization.highVolumeKeywords.slice(0, 8).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{keyword}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(keyword, 'High volume keyword')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          {optimization.highVolumeKeywords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                copyToClipboard(optimization.highVolumeKeywords.join(', '), 'All high volume keywords');
                onCopyKeywords?.(optimization.highVolumeKeywords);
              }}
            >
              Copy All High Volume
            </Button>
          )}
        </Card>

        {/* Low Competition Keywords */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-foreground">Low Competition</h4>
            <Badge variant="outline" className="text-xs">
              {optimization.lowCompetitionKeywords.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {optimization.lowCompetitionKeywords.slice(0, 8).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{keyword}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(keyword, 'Low competition keyword')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          {optimization.lowCompetitionKeywords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                copyToClipboard(optimization.lowCompetitionKeywords.join(', '), 'All low competition keywords');
                onCopyKeywords?.(optimization.lowCompetitionKeywords);
              }}
            >
              Copy All Low Competition
            </Button>
          )}
        </Card>

        {/* Commercial Keywords */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-foreground">Commercial Value</h4>
            <Badge variant="outline" className="text-xs">
              {optimization.commercialKeywords.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {optimization.commercialKeywords.slice(0, 8).map((keyword, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{keyword}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => copyToClipboard(keyword, 'Commercial keyword')}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
          {optimization.commercialKeywords.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => {
                copyToClipboard(optimization.commercialKeywords.join(', '), 'All commercial keywords');
                onCopyKeywords?.(optimization.commercialKeywords);
              }}
            >
              Copy All Commercial
            </Button>
          )}
        </Card>
      </div>

      {/* Competitor Insights */}
      <Card className="p-6 bg-gradient-secondary/5 border-brand-secondary/20">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-semibold text-foreground">
            Competitor Analysis (সফল images এর pattern)
          </h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-foreground mb-2">Common Successful Patterns:</h4>
            <div className="flex flex-wrap gap-2">
              {competitorInsights.commonPatterns.map((pattern, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-brand-secondary/30 text-brand-secondary cursor-pointer"
                  onClick={() => copyToClipboard(pattern, 'Pattern')}
                >
                  {pattern}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Successful Keyword Combinations:</h4>
            <div className="flex flex-wrap gap-2">
              {competitorInsights.successfulKeywordCombinations.map((combo, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-green-500/30 text-green-600 cursor-pointer"
                  onClick={() => copyToClipboard(combo, 'Keyword combination')}
                >
                  {combo}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-foreground mb-2">Market Gaps & Opportunities:</h4>
            <div className="flex flex-wrap gap-2">
              {competitorInsights.marketGaps.map((gap, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs border-orange-500/30 text-orange-600 cursor-pointer"
                  onClick={() => copyToClipboard(gap, 'Market gap')}
                >
                  {gap}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-brand-secondary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-foreground">
                <strong>Recommendation:</strong> {competitorInsights.recommendedFocus}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* SEO Recommendations */}
      <Card className="p-6 bg-gradient-accent/5 border-brand-accent/20">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-brand-accent" />
          <h3 className="text-lg font-semibold text-foreground">SEO Recommendations</h3>
        </div>
        
        <div className="space-y-3">
          {recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
              <div className="w-6 h-6 bg-brand-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-brand-accent">{index + 1}</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};