import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { FormActions } from '@/components/common/FormActions';
import { StatusBadge } from '@/components/common/StatusBadge';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { calculateModelPriority } from '@/services/autoAnalyticalEngine';
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FormData {
  name: string;
  partnerTagId: string;
  partnerId: string;
  productCategoryId: string;
  productId: string;
  analyticalAccountId: string;
  isArchived: boolean;
}

interface SelectOption {
  id: string;
  name: string;
  code?: string;
  color?: string;
}

export default function AutoAnalyticalModelForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    partnerTagId: '',
    partnerId: '',
    productCategoryId: '',
    productId: '',
    analyticalAccountId: '',
    isArchived: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!isNew);

  // Options for select dropdowns
  const [tags, setTags] = useState<SelectOption[]>([]);
  const [partners, setPartners] = useState<SelectOption[]>([]);
  const [categories, setCategories] = useState<SelectOption[]>([]);
  const [products, setProducts] = useState<SelectOption[]>([]);
  const [analyticalAccounts, setAnalyticalAccounts] = useState<SelectOption[]>([]);

  // Fetch all lookup data
  useEffect(() => {
    const fetchLookups = async () => {
      const [tagsRes, partnersRes, categoriesRes, productsRes, accountsRes] = await Promise.all([
        supabase.from('tags').select('id, name, color'),
        supabase.from('contacts').select('id, name').eq('is_archived', false),
        supabase.from('product_categories').select('id, name').eq('is_archived', false),
        supabase.from('products').select('id, name').eq('is_archived', false),
        supabase.from('analytical_accounts').select('id, name, code').eq('is_archived', false),
      ]);

      setTags(tagsRes.data || []);
      setPartners(partnersRes.data || []);
      setCategories(categoriesRes.data || []);
      setProducts(productsRes.data || []);
      setAnalyticalAccounts(accountsRes.data || []);
    };

    fetchLookups();
  }, []);

  // Fetch existing model if editing
  useEffect(() => {
    if (!isNew && id) {
      const fetchModel = async () => {
        setIsFetching(true);
        const { data, error } = await supabase
          .from('auto_analytical_models')
          .select('*')
          .eq('id', id)
          .single();

        if (error || !data) {
          toast.error('Model not found');
          navigate('/account/auto-analytical-models');
        } else {
          setFormData({
            name: data.name,
            partnerTagId: data.partner_tag_id || '',
            partnerId: data.partner_id || '',
            productCategoryId: data.product_category_id || '',
            productId: data.product_id || '',
            analyticalAccountId: data.analytical_account_id,
            isArchived: data.is_archived,
          });
        }
        setIsFetching(false);
      };

      fetchModel();
    }
  }, [id, isNew, navigate]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate specificity for display
  const priority = calculateModelPriority({
    partnerTagId: formData.partnerTagId || null,
    partnerId: formData.partnerId || null,
    productCategoryId: formData.productCategoryId || null,
    productId: formData.productId || null,
  });

  const getSpecificityLabel = () => {
    if (priority >= 3) return { label: 'Very Specific', variant: 'default' as const };
    if (priority === 2) return { label: 'Specific', variant: 'secondary' as const };
    if (priority === 1) return { label: 'Generic', variant: 'outline' as const };
    return { label: 'No Rules', variant: 'destructive' as const };
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Model name is required');
      return false;
    }
    if (!formData.analyticalAccountId) {
      toast.error('Analytics to Apply is required');
      return false;
    }
    if (priority === 0) {
      toast.error('At least one rule condition must be selected');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const modelData = {
        name: formData.name,
        partner_tag_id: formData.partnerTagId || null,
        partner_id: formData.partnerId || null,
        product_category_id: formData.productCategoryId || null,
        product_id: formData.productId || null,
        analytical_account_id: formData.analyticalAccountId,
        priority,
        is_archived: false,
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('auto_analytical_models')
          .insert(modelData)
          .select()
          .single();

        if (error) throw error;
        toast.success('Auto analytical model created successfully');
        navigate(`/account/auto-analytical-models/${data.id}`);
      } else if (id) {
        const { error } = await supabase
          .from('auto_analytical_models')
          .update(modelData)
          .eq('id', id);

        if (error) throw error;
        toast.success('Auto analytical model updated successfully');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save auto analytical model');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('auto_analytical_models')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;
      toast.success('Model archived successfully');
      navigate('/account/auto-analytical-models');
    } catch (error) {
      console.error(error);
      toast.error('Failed to archive model');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </MainLayout>
    );
  }

  const { label: specificityLabel, variant: specificityVariant } = getSpecificityLabel();

  return (
    <MainLayout>
      <PageHeader
        title={isNew ? 'New Auto Analytical Model' : formData.name || 'Auto Analytical Model'}
        subtitle={isNew ? 'Create automatic analytical distribution rule' : 'View and edit rule configuration'}
      />

      {formData.isArchived && (
        <Alert variant="destructive" className="mb-4 max-w-4xl">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This model is archived and will not be applied to transactions.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 max-w-4xl">
        {/* Model Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Model Details</CardTitle>
            <CardDescription>
              Define the rule name and the analytical account to apply
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Model Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={formData.isArchived}
                  placeholder="e.g., VIP Customer Deepavali"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="analyticalAccountId">Analytics to Apply *</Label>
                <Select
                  value={formData.analyticalAccountId}
                  onValueChange={(value) => handleChange('analyticalAccountId', value)}
                  disabled={formData.isArchived}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select analytical account" />
                  </SelectTrigger>
                  <SelectContent>
                    {analyticalAccounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.code} - {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Specificity Indicator */}
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-muted-foreground">Rule Specificity:</span>
              <Badge variant={specificityVariant}>{specificityLabel}</Badge>
              <span className="text-sm text-muted-foreground">({priority} field{priority !== 1 ? 's' : ''} configured)</span>
            </div>
          </CardContent>
        </Card>

        {/* Rule Conditions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Rule Conditions</CardTitle>
            <CardDescription>
              Configure optional matching criteria. At least one field must be selected.
              More specific rules (more fields) take priority over generic rules.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                All selected fields must match for this rule to apply. Empty fields are ignored.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Partner Tag */}
              <div className="space-y-2">
                <Label htmlFor="partnerTagId">Partner Tag</Label>
                <Select
                  value={formData.partnerTagId}
                  onValueChange={(value) => handleChange('partnerTagId', value === 'none' ? '' : value)}
                  disabled={formData.isArchived}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any tag" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any tag</SelectItem>
                    {tags.map((tag) => (
                      <SelectItem key={tag.id} value={tag.id}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: tag.color }}
                          />
                          {tag.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Partner */}
              <div className="space-y-2">
                <Label htmlFor="partnerId">Partner</Label>
                <Select
                  value={formData.partnerId}
                  onValueChange={(value) => handleChange('partnerId', value === 'none' ? '' : value)}
                  disabled={formData.isArchived}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any partner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any partner</SelectItem>
                    {partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Category */}
              <div className="space-y-2">
                <Label htmlFor="productCategoryId">Product Category</Label>
                <Select
                  value={formData.productCategoryId}
                  onValueChange={(value) => handleChange('productCategoryId', value === 'none' ? '' : value)}
                  disabled={formData.isArchived}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any category</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product */}
              <div className="space-y-2">
                <Label htmlFor="productId">Product</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => handleChange('productId', value === 'none' ? '' : value)}
                  disabled={formData.isArchived}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Any product</SelectItem>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Card (only for existing models) */}
        {!isNew && (
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Current Status:</span>
                {formData.isArchived ? (
                  <StatusBadge status="archived" />
                ) : (
                  <StatusBadge status="confirmed" />
                )}
              </div>
              {!formData.isArchived && (
                <p className="text-sm text-muted-foreground mt-2">
                  This rule is active and will be applied to matching transaction lines.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        {!formData.isArchived && (
          <FormActions
            mode={isNew ? 'create' : 'edit'}
            onSave={handleSave}
            onArchive={!isNew ? handleArchive : undefined}
            isLoading={isLoading}
            canConfirm={false}
            canRevise={false}
          />
        )}
      </div>
    </MainLayout>
  );
}
