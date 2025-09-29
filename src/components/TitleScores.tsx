import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TitleScoresProps {
  allTitles: string[];
  selectedTitleIndex: number;
  onTitleSelection: (index: number) => void;
  index: number;
}

export const TitleScores: React.FC<TitleScoresProps> = ({ 
  allTitles, 
  selectedTitleIndex, 
  onTitleSelection, 
  index 
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Title copied to clipboard."
    });
  };

  // Calculate SEO scores for each title
  const calculateTitleScore = (title: string) => {
    let score = 0;
    
    // Length optimization (60-80 characters ideal)
    const length = title.length;
    if (length >= 50 && length <= 80) score += 30;
    else if (length >= 40 && length <= 90) score += 20;
    else score += 10;
    
    // Keyword density
    const words = title.toLowerCase().split(' ');
    if (words.length >= 5 && words.length <= 12) score += 25;
    else if (words.length >= 3 && words.length <= 15) score += 15;
    else score += 5;
    
    // Commercial keywords presence
    const commercialKeywords = ['buy', 'sale', 'professional', 'premium', 'quality', 'best', 'top', 'exclusive'];
    const hasCommercial = commercialKeywords.some(keyword => title.toLowerCase().includes(keyword));
    if (hasCommercial) score += 20;
    
    // Descriptive adjectives
    const adjectives = ['beautiful', 'stunning', 'amazing', 'perfect', 'modern', 'elegant', 'creative', 'unique'];
    const hasAdjectives = adjectives.some(adj => title.toLowerCase().includes(adj));
    if (hasAdjectives) score += 15;
    
    // No special characters (except hyphens and spaces)
    const hasSpecialChars = /[^a-zA-Z0-9\s\-]/.test(title);
    if (!hasSpecialChars) score += 10;
    
    return Math.min(score, 100);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    return <AlertCircle className="w-4 h-4 text-red-600" />;
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <Card className="p-4 sm:p-6 bg-gradient-secondary/5 border-brand-secondary/20">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            টাইটেল SEO স্কোর (CSV Export এর জন্য সিলেক্ট করুন)
          </h3>
          <Badge variant="outline" className="text-xs bg-brand-primary/10 border-brand-primary/30 text-brand-primary">
            Required for Export
          </Badge>
        </div>
        
        <div className="space-y-3">
          {allTitles.map((titleOption, titleIndex) => {
            const score = calculateTitleScore(titleOption);
            return (
              <div 
                key={titleIndex} 
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedTitleIndex === titleIndex 
                    ? 'border-brand-primary bg-brand-primary/5 ring-2 ring-brand-primary/20' 
                    : 'border-border bg-background hover:border-brand-primary/50 hover:bg-brand-primary/5'
                }`}
                onClick={() => onTitleSelection(titleIndex)}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name={`title-selection-${index}`}
                    value={titleIndex}
                    checked={selectedTitleIndex === titleIndex}
                    onChange={() => onTitleSelection(titleIndex)}
                    className="mt-1 text-brand-primary focus:ring-brand-primary focus:ring-offset-0"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {titleIndex === 0 ? 'Primary Title' : `Alternative Title ${titleIndex}`}
                        </span>
                        {selectedTitleIndex === titleIndex && (
                          <Badge variant="default" className="text-xs bg-brand-primary text-white">
                            Selected for CSV
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {getScoreIcon(score)}
                          <span className={`text-sm font-bold ${getScoreColor(score)}`}>
                            {score}/100
                          </span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getScoreColor(score)} border-current`}
                        >
                          {getScoreBadge(score)}
                        </Badge>
                      </div>
                    </div>
                    
                    <Progress value={score} className="h-2" />
                    
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {titleOption}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(titleOption);
                    }}
                    className="h-8 w-8 shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};