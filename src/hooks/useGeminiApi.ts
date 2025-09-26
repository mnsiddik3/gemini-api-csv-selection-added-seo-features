import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { optimizeImageForGemini } from '@/lib/imageUtils';

interface MetadataResult {
  title: string;
  alternativeTitles?: string[];
  description: string;
  keywords: string[];
  category: string;
}

// Function to clean symbols and punctuation from keywords
const cleanKeywords = (keywords: string[]): string[] => {
  return keywords.map(keyword => {
    // Remove all symbols and punctuation marks, keep only letters, numbers and spaces
    return keyword.replace(/[^\w\s]/g, '').trim();
  }).filter(keyword => keyword.length > 0);
};

// Function to clean symbols and punctuation from titles (keep only commas)
const cleanTitle = (title: string): string => {
  // Remove all punctuation marks except commas, keep only letters, numbers, spaces and commas
  return title.replace(/[^\w\s,]/g, '').trim();
};

// Function to clean symbols and punctuation from descriptions
const cleanDescription = (description: string): string => {
  // Remove quotes, @, #, *, %, ^, =, +, <, > and other problematic symbols
  return description.replace(/["'@#*%^=+<>]/g, '').trim();
};

// Optimized filter for better keyword diversity
const filterUniqueKeywords = (keywords: string[]): string[] => {
  // Filter out generic, color, shape and technical words
  const genericWords = [
    'image', 'photo', 'picture', 'design', 'creative', 'beautiful', 'modern', 
    'awesome', 'amazing', 'perfect', 'great', 'nice', 'good', 'best', 'new',
    'cool', 'fresh', 'clean', 'simple', 'elegant', 'stylish', 'trendy'
  ];
  
  const colorWords = [
    'white', 'black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple',
    'pink', 'brown', 'gray', 'grey', 'silver', 'gold', 'colorful', 'bright',
    'dark', 'light', 'color', 'colors', 'colour', 'colours'
  ];
  
  const shapeWords = [
    'round', 'square', 'circle', 'triangle', 'rectangle', 'oval', 'diamond',
    'star', 'heart', 'arrow', 'line', 'curve', 'straight', 'shape', 'shapes'
  ];
  
  const technicalWords = [
    'vector', 'digital', 'file', 'quality', 'resolution', 'pixel', 'format',
    'jpg', 'png', 'svg', 'ai', 'eps', 'pdf', 'download', 'upload', 'size',
    'dimension', 'layer', 'transparent', 'background'
  ];
  
  const allFilteredWords = [...genericWords, ...colorWords, ...shapeWords, ...technicalWords];
  
  // Reduced synonym groups - only core duplicates
  const synonymGroups = [
    ['graphic', 'graphics'],
    ['element', 'elements'],
    ['icon', 'icons'],
    ['template', 'templates'],
    ['business', 'corporate'],
    ['app', 'application']
  ];

  const filtered: string[] = [];
  const usedGroups = new Set<number>();

  for (const keyword of keywords) {
    const keywordLower = keyword.toLowerCase();
    
    // Skip filtered words
    if (allFilteredWords.includes(keywordLower)) {
      continue;
    }
    
    let isUnique = true;
    
    // Check against minimal synonym groups
    for (let i = 0; i < synonymGroups.length; i++) {
      if (synonymGroups[i].some(syn => keywordLower === syn)) {
        if (usedGroups.has(i)) {
          isUnique = false;
          break;
        } else {
          usedGroups.add(i);
        }
      }
    }
    
    // Simple duplicate check
    if (isUnique) {
      const existsAlready = filtered.some(existing => {
        const existingLower = existing.toLowerCase();
        return existingLower === keywordLower || 
               (existingLower + 's' === keywordLower) ||
               (keywordLower + 's' === existingLower);
      });
      
      if (!existsAlready) {
        filtered.push(keyword);
      }
    }
  }

  return filtered.slice(0, 50);
};

export const useGeminiApi = () => {
  const [loading, setLoading] = useState(false);
  const [processingQueue, setProcessingQueue] = useState(false);
  const { toast } = useToast();

  // Smart delay calculation based on API load
  const getAdaptiveDelay = (retryCount: number, isOverloaded: boolean = false) => {
    if (isOverloaded) {
      return Math.min(Math.pow(3, retryCount) * 2000, 30000); // 6s, 18s, 54s, max 30s
    }
    return Math.min(Math.pow(2, retryCount) * 1000, 10000); // 2s, 4s, 8s, max 10s
  };

  // Queue delay for bulk processing
  const getBulkDelay = (index: number, hasErrors: boolean = false) => {
    const baseDelay = hasErrors ? 8000 : 3000; // Longer delay if previous errors
    return baseDelay + (index * 2000); // Progressive delay
  };

  const generateMetadata = async (imageFile: File, apiKey: string): Promise<MetadataResult | null> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API Key.",
        variant: "destructive",
      });
      return null;
    }

    const makeApiCall = async (retryCount = 0, alternateOrder = false): Promise<any> => {
      try {
        // Convert image to base64
        const { base64Data: base64Image, mimeType } = await optimizeImageForGemini(imageFile);

        const prompt = `
Analyze this image and create Adobe Stock metadata:

FOCUS ON IMAGE CONTENT: Describe exactly what you see, not generic terms.

TITLES (6-12 words):
- Primary title describing main subject + style + purpose
- CRITICAL: Include numbers ONLY if they are clearly visible and readable in the image itself
- DO NOT add random numbers or quantities unless they appear in the image
- If numbers are visible: include them in ALL THREE titles with proper formatting
- Examples with numbers: "Anniversary Badges 1, 5, 10, 15, 20, 25 - Gold Design Set"
- Examples without numbers: "Corporate Business Team Meeting - Professional Workplace"
- Use ONE hyphen only: "Main Subject - Style/Purpose"
- No symbols except hyphen and comma (for visible numbers only)
- Two alternative titles with different keyword angles

DESCRIPTION (150-200 characters):
- Commercial description focusing on the image content
- If numbers are visible, list them individually without explanatory text (e.g., "1, 5, 10" not "Number 01 is visible")

CATEGORY:
Choose main theme: Business, Technology, Nature, People, Food, Travel, Art, etc.

KEYWORDS (exactly 50):
Create balanced keywords across these categories:
- IMAGE CONTENT (10 keywords): What you actually see in the image
- BUSINESS (8 keywords): Commercial terms, industries
- VISUAL STYLE (8 keywords): Colors, composition, design style  
- PURPOSE (8 keywords): Usage, application, context
- INDUSTRY (8 keywords): Relevant sectors, markets
- MATERIALS/OBJECTS (8 keywords): Physical elements, textures

KEYWORD RULES:
- Each must be completely unique (no synonyms)
- Focus on buyer search behavior
- Single words preferred
- No generic terms like "image", "photo"
- Ensure commercial value

Response format:
TITLE- [title here]
ALT_TITLE_1- [alternative 1]
ALT_TITLE_2- [alternative 2]
DESCRIPTION- [description]
CATEGORY- [category]
KEYWORDS- word1, word2, word3, [continue to 50 words]
        `;

        // Use latest stable Gemini models
        const model = retryCount >= 2 ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        const parts = alternateOrder
          ? [
              { text: prompt },
              { inlineData: { mimeType, data: base64Image } }
            ]
          : [
              { inlineData: { mimeType, data: base64Image } },
              { text: prompt }
            ];

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);

          // Handle overloaded 503 with smart retry/backoff
          if (response.status === 503 && retryCount < 8) {
            const delay = getAdaptiveDelay(retryCount, true);
            toast({
              title: "API Overloaded - Smart Retry",
              description: `Switching to ${retryCount >= 2 ? 'Pro model' : 'Flash model'}. Waiting ${delay/1000}s... (${retryCount + 1}/8)`,
              variant: "default",
            });
            await new Promise(resolve => setTimeout(resolve, delay));
            return makeApiCall(retryCount + 1, alternateOrder);
          }

          // Retry once with alternate parts order for potential argument validation quirks
          if (response.status === 400 && !alternateOrder) {
            toast({
              title: "Retrying Request",
              description: "Trying an alternate request format to avoid INVALID_ARGUMENT...",
              variant: "default",
            });
            return makeApiCall(retryCount, true);
          }

          if (response.status === 503) {
            toast({
              title: "API Overloaded",
              description: "Please wait a few minutes and try again.",
              variant: "destructive",
            });
          }

          throw new Error(`API Error: ${response.status} ${response.statusText}${errorData?.error?.message ? ` - ${errorData.error.message}` : ''}`);
        }

        return response.json();
      } catch (error) {
        if (retryCount < 5 && (error instanceof Error && error.message.includes('503'))) {
          const delay = Math.min(Math.pow(2, retryCount) * 1000, 10000);
          toast({
            title: "Network Issue - Retrying",
            description: `Attempting retry ${retryCount + 1}/5 in ${delay/1000}s`,
            variant: "default",
          });
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return makeApiCall(retryCount + 1);
        }
        throw error;
      }
    };

    try {
      const data = await makeApiCall();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('No response from API');
      }

      // Parse the response
      const lines = text.split('\n');
      let title = '';
      let alternativeTitles: string[] = [];
      let description = '';
      let keywords: string[] = [];

      let category = '';

      lines.forEach((line: string) => {
        if (line.startsWith('TITLE-') || line.startsWith('TITLE:')) {
          title = cleanTitle(line.replace(/TITLE[-:]\s*/, '').trim());
        } else if (line.startsWith('ALT_TITLE_1-') || line.startsWith('ALT_TITLE_1:')) {
          alternativeTitles[0] = cleanTitle(line.replace(/ALT_TITLE_1[-:]\s*/, '').trim());
        } else if (line.startsWith('ALT_TITLE_2-') || line.startsWith('ALT_TITLE_2:')) {
          alternativeTitles[1] = cleanTitle(line.replace(/ALT_TITLE_2[-:]\s*/, '').trim());
        } else if (line.startsWith('DESCRIPTION-') || line.startsWith('DESCRIPTION:')) {
          description = cleanDescription(line.replace(/DESCRIPTION[-:]\s*/, '').trim());
        } else if (line.startsWith('CATEGORY-') || line.startsWith('CATEGORY:')) {
          category = line.replace(/CATEGORY[-:]\s*/, '').trim();
        } else if (line.startsWith('KEYWORDS-') || line.startsWith('KEYWORDS:')) {
          const keywordText = line.replace(/KEYWORDS[-:]\s*/, '').trim();
          const rawKeywords = keywordText.split(',').map(k => k.trim()).filter(k => k.length > 0);
          
          // Clean symbols and punctuation from keywords
          const cleanedKeywords = cleanKeywords(rawKeywords);
          
          // Filter out duplicates and synonyms
          keywords = filterUniqueKeywords(cleanedKeywords);
        }
      });

      return { 
        title: title || 'Generated Title', 
        alternativeTitles: alternativeTitles.filter(t => t), 
        description: description || 'Generated description', 
        keywords: keywords.length > 0 ? keywords : ['generated', 'metadata'], 
        category: category || 'General' 
      };

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error Occurred",
        description: error instanceof Error ? error.message : "API call failed",
        variant: "destructive",
      });
      return null;
    }
  };

  const generateBulkMetadata = async (imageFiles: File[], apiKey: string): Promise<MetadataResult[]> => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Google Gemini API Key.",
        variant: "destructive",
      });
      return [];
    }

    setLoading(true);
    setProcessingQueue(true);
    const results: MetadataResult[] = [];
    let hasErrors = false;

    // Show bulk processing guidance
    toast({
      title: "Smart Bulk Processing Started",
      description: `Processing ${imageFiles.length} images with intelligent delays to avoid API overload`,
      variant: "default",
    });

    try {
      for (let i = 0; i < imageFiles.length; i++) {
        const imageFile = imageFiles[i];
        
        // Progressive delay to prevent API overload
        if (i > 0) {
          const delay = getBulkDelay(i, hasErrors);
          toast({
            title: "Queue Delay",
            description: `Waiting ${delay/1000}s before processing next image to prevent API overload...`,
            variant: "default",
          });
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        toast({
          title: "Processing...",
          description: `Image ${i + 1}/${imageFiles.length}: ${imageFile.name}`,
        });

        const startTime = Date.now();
        const result = await generateMetadata(imageFile, apiKey);
        const processingTime = Date.now() - startTime;
        
        if (result) {
          results.push(result);
          toast({
            title: "✅ Success",
            description: `Image ${i + 1} processed in ${(processingTime/1000).toFixed(1)}s`,
            variant: "default",
          });
        } else {
          hasErrors = true;
          toast({
            title: "⚠️ Failed",
            description: `Image ${i + 1} failed - continuing with increased delays`,
            variant: "destructive",
          });
        }
      }

      toast({
        title: "Bulk Processing Complete!",
        description: `Successfully processed ${results.length}/${imageFiles.length} images`,
        variant: results.length === imageFiles.length ? "default" : "destructive",
      });

      return results;

    } catch (error) {
      console.error('Bulk processing error:', error);
      toast({
        title: "Bulk Processing Error",
        description: `Processed ${results.length}/${imageFiles.length} before error: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
      return results; // Return partial results
    } finally {
      setLoading(false);
      setProcessingQueue(false);
    }
  };

  return { generateMetadata, generateBulkMetadata, loading, processingQueue };
};