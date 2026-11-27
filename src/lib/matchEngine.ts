import { Item, MatchRecommendation } from './types';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'with', 'for', 'of',
  'to', 'is', 'it', 'my', 'has', 'near', 'found', 'lost', 'room', 'floor',
  'desk', 'table', 'inside', 'black', 'white', 'blue', 'red', 'from', 'by'
]);

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word))
  );
}

export function calculateMatchScore(lost: Item, found: Item): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Category Matching (Weight: 40%)
  if (lost.category === found.category) {
    score += 40;
    reasons.push(`Matching category: ${lost.category.replace('_', ' ')}`);
  } else {
    // If categories completely differ, unlikely to be a match
    return { score: 0, reasons: [] };
  }

  // 2. Keyword Overlap in Title and Description (Weight: Up to 35%)
  const lostTokens = tokenize(`${lost.title} ${lost.description}`);
  const foundTokens = tokenize(`${found.title} ${found.description}`);
  
  const commonTokens: string[] = [];
  lostTokens.forEach((token) => {
    if (foundTokens.has(token)) {
      commonTokens.push(token);
    }
  });

  if (commonTokens.length > 0) {
    const keywordScore = Math.min(35, commonTokens.length * 12);
    score += keywordScore;
    reasons.push(`Key terms match: "${commonTokens.slice(0, 4).join('", "')}"`);
  }

  // 3. Location / Campus Zone Proximity (Weight: 15%)
  if (lost.campusZoneId && found.campusZoneId && lost.campusZoneId === found.campusZoneId) {
    score += 15;
    reasons.push('Occurred within the same campus facility / zone');
  }

  // 4. Date Proximity (Weight: 10%)
  const lostDate = new Date(lost.date).getTime();
  const foundDate = new Date(found.date).getTime();
  const diffDays = Math.abs((foundDate - lostDate) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    score += 10;
    reasons.push('Dates align within 24-48 hours');
  } else if (diffDays <= 3) {
    score += 5;
    reasons.push('Reported within 3 days window');
  }

  return {
    score: Math.min(99, score),
    reasons,
  };
}

export function findMatchesForItem(targetItem: Item, allItems: Item[]): MatchRecommendation[] {
  const recommendations: MatchRecommendation[] = [];
  const oppositeType = targetItem.type === 'LOST' ? 'FOUND' : 'LOST';

  const candidates = allItems.filter(
    (item) => item.type === oppositeType && item.status !== 'RETURNED'
  );

  for (const candidate of candidates) {
    const lostItem = targetItem.type === 'LOST' ? targetItem : candidate;
    const foundItem = targetItem.type === 'FOUND' ? targetItem : candidate;

    const { score, reasons } = calculateMatchScore(lostItem, foundItem);

    if (score >= 45) {
      recommendations.push({
        lostItem,
        foundItem,
        confidenceScore: score,
        matchReasons: reasons,
      });
    }
  }

  return recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);
}
