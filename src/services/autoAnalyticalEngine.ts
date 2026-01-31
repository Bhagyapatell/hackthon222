/**
 * Auto Analytical Engine Service
 * 
 * This service handles the automatic assignment of analytical accounts
 * to transaction lines based on priority-aware rule matching.
 * 
 * Rules:
 * - Only CONFIRMED models are applied (draft/archived ignored)
 * - More specific rules (more matched fields) override generic rules
 * - All selected fields in the model must match the transaction line
 * - Empty fields in model are ignored (not required for match)
 */

import { supabase } from '@/integrations/supabase/client';
import type { MatchContext, MatchResult, ModelState } from '@/types/autoAnalyticalModel';

interface AutoAnalyticalModel {
  id: string;
  name: string;
  partner_tag_id: string | null;
  partner_id: string | null;
  product_category_id: string | null;
  product_id: string | null;
  analytical_account_id: string;
  is_archived: boolean;
  priority: number;
}

interface Contact {
  id: string;
  tags?: { id: string }[];
}

/**
 * Fetches all confirmed (non-archived) auto analytical models
 */
export async function getActiveModels(): Promise<AutoAnalyticalModel[]> {
  const { data, error } = await supabase
    .from('auto_analytical_models')
    .select('*')
    .eq('is_archived', false)
    .order('priority', { ascending: false });

  if (error) {
    console.error('Error fetching auto analytical models:', error);
    return [];
  }

  return data || [];
}

/**
 * Calculates match score for a model against given context
 * Returns score and list of matched fields
 */
function calculateMatchScore(
  model: AutoAnalyticalModel,
  context: MatchContext
): { score: number; matchedFields: string[] } {
  let score = 0;
  const matchedFields: string[] = [];
  let hasUnmatchedRequiredField = false;

  // Check each field - if set in model, it MUST match
  if (model.partner_tag_id) {
    if (context.partnerTagIds?.includes(model.partner_tag_id)) {
      score++;
      matchedFields.push('partnerTag');
    } else {
      hasUnmatchedRequiredField = true;
    }
  }

  if (model.partner_id) {
    if (model.partner_id === context.partnerId) {
      score++;
      matchedFields.push('partner');
    } else {
      hasUnmatchedRequiredField = true;
    }
  }

  if (model.product_category_id) {
    if (model.product_category_id === context.productCategoryId) {
      score++;
      matchedFields.push('productCategory');
    } else {
      hasUnmatchedRequiredField = true;
    }
  }

  if (model.product_id) {
    if (model.product_id === context.productId) {
      score++;
      matchedFields.push('product');
    } else {
      hasUnmatchedRequiredField = true;
    }
  }

  // If any selected field didn't match, the model doesn't match at all
  if (hasUnmatchedRequiredField) {
    return { score: 0, matchedFields: [] };
  }

  return { score, matchedFields };
}

/**
 * Finds the best matching analytical account for a transaction line
 * 
 * @param context - The matching context containing partner, product, and tag info
 * @returns The analytical account ID to apply, or undefined if no match
 */
export async function findMatchingAnalyticalAccount(
  context: MatchContext
): Promise<string | undefined> {
  const models = await getActiveModels();

  if (models.length === 0) {
    return undefined;
  }

  // Calculate match scores for all models
  const matches: MatchResult[] = models
    .map((model) => {
      const { score, matchedFields } = calculateMatchScore(model, context);
      return {
        model: {
          id: model.id,
          name: model.name,
          partnerTagId: model.partner_tag_id || undefined,
          partnerId: model.partner_id || undefined,
          productCategoryId: model.product_category_id || undefined,
          productId: model.product_id || undefined,
          analyticalAccountId: model.analytical_account_id,
          state: (model.is_archived ? 'archived' : 'confirmed') as ModelState,
          priority: model.priority,
          isArchived: model.is_archived,
          createdAt: new Date(),
        },
        matchScore: score,
        matchedFields,
      };
    })
    .filter((m) => m.matchScore > 0); // Only include actual matches

  if (matches.length === 0) {
    return undefined;
  }

  // Sort by match score (descending), then by priority (descending), then by creation order
  matches.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return b.model.priority - a.model.priority;
  });

  // Return the best match's analytical account
  console.log('[AutoAnalyticalEngine] Best match:', matches[0].model.name, 'with score', matches[0].matchScore);
  return matches[0].model.analyticalAccountId;
}

/**
 * Gets partner tags for a contact
 */
export async function getPartnerTags(contactId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('contact_tags')
    .select('tag_id')
    .eq('contact_id', contactId);

  if (error || !data) {
    return [];
  }

  return data.map((ct) => ct.tag_id);
}

/**
 * Gets product category for a product
 */
export async function getProductCategory(productId: string): Promise<string | undefined> {
  const { data, error } = await supabase
    .from('products')
    .select('category_id')
    .eq('id', productId)
    .single();

  if (error || !data) {
    return undefined;
  }

  return data.category_id || undefined;
}

/**
 * Builds a complete match context for a transaction line
 */
export async function buildMatchContext(
  partnerId?: string,
  productId?: string
): Promise<MatchContext> {
  const context: MatchContext = {
    partnerId,
    productId,
  };

  if (partnerId) {
    context.partnerTagIds = await getPartnerTags(partnerId);
  }

  if (productId) {
    context.productCategoryId = await getProductCategory(productId);
  }

  return context;
}

/**
 * Auto-assigns analytical account to a transaction line
 * This is the main entry point for the engine
 */
export async function autoAssignAnalyticalAccount(
  partnerId?: string,
  productId?: string
): Promise<string | undefined> {
  const context = await buildMatchContext(partnerId, productId);
  return findMatchingAnalyticalAccount(context);
}

/**
 * Recalculates priority based on number of configured fields
 */
export function calculateModelPriority(model: {
  partnerTagId?: string | null;
  partnerId?: string | null;
  productCategoryId?: string | null;
  productId?: string | null;
}): number {
  let priority = 0;
  if (model.partnerTagId) priority++;
  if (model.partnerId) priority++;
  if (model.productCategoryId) priority++;
  if (model.productId) priority++;
  return priority;
}
