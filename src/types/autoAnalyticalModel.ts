// Auto Analytical Model State Types
export type ModelState = 'draft' | 'confirmed' | 'archived';

// Extended interface for the Auto Analytical Model with state
export interface AutoAnalyticalModelExtended {
  id: string;
  name: string;
  partnerTagId?: string;
  partnerId?: string;
  productCategoryId?: string;
  productId?: string;
  analyticalAccountId: string;
  state: ModelState;
  priority: number; // Computed based on number of matching fields
  isArchived: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Rule match context for transaction lines
export interface MatchContext {
  partnerId?: string;
  partnerTagIds?: string[];
  productId?: string;
  productCategoryId?: string;
}

// Match result with score for priority resolution
export interface MatchResult {
  model: AutoAnalyticalModelExtended;
  matchScore: number;
  matchedFields: string[];
}
