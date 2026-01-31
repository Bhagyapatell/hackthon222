import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Contact,
  Product,
  ProductCategory,
  AnalyticalAccount,
  AutoAnalyticalModel,
  Budget,
  Tag,
  PurchaseOrder,
  VendorBill,
  BillPayment,
  SalesOrder,
  CustomerInvoice,
  InvoicePayment,
} from '@/types';

// ==================== TAG STORE ====================
interface TagStore {
  tags: Tag[];
  addTag: (tag: Omit<Tag, 'id'>) => Tag;
  getTag: (id: string) => Tag | undefined;
}

export const useTagStore = create<TagStore>()(
  persist(
    (set, get) => ({
      tags: [
        { id: '1', name: 'Premium', color: 'hsl(var(--chart-1))' },
        { id: '2', name: 'Regular', color: 'hsl(var(--chart-2))' },
        { id: '3', name: 'VIP', color: 'hsl(var(--chart-3))' },
      ],
      addTag: (tagData) => {
        const newTag: Tag = { ...tagData, id: Date.now().toString() };
        set((state) => ({ tags: [...state.tags, newTag] }));
        return newTag;
      },
      getTag: (id) => get().tags.find((t) => t.id === id),
    }),
    { name: 'erp-tags' }
  )
);

// ==================== CONTACT STORE ====================
interface ContactStore {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Contact;
  updateContact: (id: string, data: Partial<Contact>) => void;
  archiveContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
}

export const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      contacts: [
        {
          id: '1',
          name: 'Rajesh Kumar',
          email: 'rajesh@example.com',
          phone: '+91 98765 43210',
          street: '123 MG Road',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pincode: '400001',
          tags: [{ id: '3', name: 'VIP', color: 'hsl(var(--chart-3))' }],
          isArchived: false,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          name: 'Priya Sharma',
          email: 'priya@furnishers.com',
          phone: '+91 87654 32109',
          street: '456 Commercial St',
          city: 'Delhi',
          state: 'Delhi',
          country: 'India',
          pincode: '110001',
          tags: [{ id: '1', name: 'Premium', color: 'hsl(var(--chart-1))' }],
          isArchived: false,
          createdAt: new Date('2024-02-20'),
          updatedAt: new Date('2024-02-20'),
        },
        {
          id: '3',
          name: 'Wood Suppliers Ltd',
          email: 'vendor@woodsupply.com',
          phone: '+91 76543 21098',
          street: '789 Industrial Area',
          city: 'Bangalore',
          state: 'Karnataka',
          country: 'India',
          pincode: '560001',
          tags: [{ id: '2', name: 'Regular', color: 'hsl(var(--chart-2))' }],
          isArchived: false,
          createdAt: new Date('2024-03-10'),
          updatedAt: new Date('2024-03-10'),
        },
      ],
      addContact: (contactData) => {
        const newContact: Contact = {
          ...contactData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ contacts: [...state.contacts, newContact] }));
        return newContact;
      },
      updateContact: (id, data) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, ...data, updatedAt: new Date() } : c
          ),
        }));
      },
      archiveContact: (id) => {
        set((state) => ({
          contacts: state.contacts.map((c) =>
            c.id === id ? { ...c, isArchived: true, updatedAt: new Date() } : c
          ),
        }));
      },
      getContact: (id) => get().contacts.find((c) => c.id === id),
    }),
    { name: 'erp-contacts' }
  )
);

// ==================== PRODUCT CATEGORY STORE ====================
interface CategoryStore {
  categories: ProductCategory[];
  addCategory: (cat: Omit<ProductCategory, 'id'>) => ProductCategory;
  getCategory: (id: string) => ProductCategory | undefined;
}

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [
        { id: '1', name: 'Living Room', description: 'Sofas, couches, tables', isArchived: false },
        { id: '2', name: 'Bedroom', description: 'Beds, wardrobes, dressers', isArchived: false },
        { id: '3', name: 'Office', description: 'Desks, chairs, cabinets', isArchived: false },
        { id: '4', name: 'Dining', description: 'Dining tables, chairs', isArchived: false },
      ],
      addCategory: (catData) => {
        const newCat: ProductCategory = { ...catData, id: Date.now().toString() };
        set((state) => ({ categories: [...state.categories, newCat] }));
        return newCat;
      },
      getCategory: (id) => get().categories.find((c) => c.id === id),
    }),
    { name: 'erp-categories' }
  )
);

// ==================== PRODUCT STORE ====================
interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: [
        {
          id: '1',
          name: 'Royal Sofa Set',
          categoryId: '1',
          salesPrice: 45000,
          purchasePrice: 28000,
          isArchived: false,
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
        },
        {
          id: '2',
          name: 'King Size Bed',
          categoryId: '2',
          salesPrice: 35000,
          purchasePrice: 22000,
          isArchived: false,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '3',
          name: 'Executive Desk',
          categoryId: '3',
          salesPrice: 18000,
          purchasePrice: 11000,
          isArchived: false,
          createdAt: new Date('2024-02-01'),
          updatedAt: new Date('2024-02-01'),
        },
        {
          id: '4',
          name: 'Dining Table 6 Seater',
          categoryId: '4',
          salesPrice: 28000,
          purchasePrice: 17000,
          isArchived: false,
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-02-10'),
        },
      ],
      addProduct: (productData) => {
        const newProduct: Product = {
          ...productData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ products: [...state.products, newProduct] }));
        return newProduct;
      },
      updateProduct: (id, data) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
          ),
        }));
      },
      archiveProduct: (id) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, isArchived: true, updatedAt: new Date() } : p
          ),
        }));
      },
      getProduct: (id) => get().products.find((p) => p.id === id),
    }),
    { name: 'erp-products' }
  )
);

// ==================== ANALYTICAL ACCOUNT STORE ====================
interface AnalyticalAccountStore {
  accounts: AnalyticalAccount[];
  addAccount: (account: Omit<AnalyticalAccount, 'id' | 'createdAt'>) => AnalyticalAccount;
  updateAccount: (id: string, data: Partial<AnalyticalAccount>) => void;
  archiveAccount: (id: string) => void;
  getAccount: (id: string) => AnalyticalAccount | undefined;
}

export const useAnalyticalAccountStore = create<AnalyticalAccountStore>()(
  persist(
    (set, get) => ({
      accounts: [
        {
          id: '1',
          name: 'Deepavali Campaign',
          code: 'CC-001',
          description: 'Deepavali sales and marketing expenses',
          isArchived: false,
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '2',
          name: 'Marriage Season',
          code: 'CC-002',
          description: 'Wedding season promotions and bulk orders',
          isArchived: false,
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '3',
          name: 'Furniture Expo 2026',
          code: 'CC-003',
          description: 'Annual furniture exhibition expenses',
          isArchived: false,
          createdAt: new Date('2024-02-01'),
        },
        {
          id: '4',
          name: 'General Operations',
          code: 'CC-004',
          description: 'Day-to-day operational expenses',
          isArchived: false,
          createdAt: new Date('2024-01-01'),
        },
      ],
      addAccount: (accountData) => {
        const newAccount: AnalyticalAccount = {
          ...accountData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set((state) => ({ accounts: [...state.accounts, newAccount] }));
        return newAccount;
      },
      updateAccount: (id, data) => {
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, ...data } : a)),
        }));
      },
      archiveAccount: (id) => {
        set((state) => ({
          accounts: state.accounts.map((a) =>
            a.id === id ? { ...a, isArchived: true } : a
          ),
        }));
      },
      getAccount: (id) => get().accounts.find((a) => a.id === id),
    }),
    { name: 'erp-analytical-accounts' }
  )
);

// ==================== AUTO ANALYTICAL MODEL STORE ====================
interface AutoAnalyticalModelStore {
  models: AutoAnalyticalModel[];
  addModel: (model: Omit<AutoAnalyticalModel, 'id' | 'createdAt' | 'priority'>) => AutoAnalyticalModel;
  updateModel: (id: string, data: Partial<AutoAnalyticalModel>) => void;
  archiveModel: (id: string) => void;
  getModel: (id: string) => AutoAnalyticalModel | undefined;
  findMatchingAccount: (params: {
    tagIds?: string[];
    partnerId?: string;
    categoryId?: string;
    productId?: string;
  }) => AnalyticalAccount | undefined;
}

export const useAutoAnalyticalModelStore = create<AutoAnalyticalModelStore>()(
  persist(
    (set, get) => ({
      models: [
        {
          id: '1',
          name: 'VIP Customer Deepavali',
          partnerTagId: '3',
          analyticalAccountId: '1',
          analyticalAccount: { id: '1', name: 'Deepavali Campaign', code: 'CC-001', isArchived: false, createdAt: new Date() },
          priority: 3,
          isArchived: false,
          createdAt: new Date('2024-01-05'),
        },
        {
          id: '2',
          name: 'Living Room Expo',
          productCategoryId: '1',
          analyticalAccountId: '3',
          analyticalAccount: { id: '3', name: 'Furniture Expo 2026', code: 'CC-003', isArchived: false, createdAt: new Date() },
          priority: 2,
          isArchived: false,
          createdAt: new Date('2024-02-10'),
        },
      ],
      addModel: (modelData) => {
        // Calculate priority based on number of matching fields
        let priority = 0;
        if (modelData.partnerTagId) priority++;
        if (modelData.partnerId) priority++;
        if (modelData.productCategoryId) priority++;
        if (modelData.productId) priority++;

        const newModel: AutoAnalyticalModel = {
          ...modelData,
          id: Date.now().toString(),
          priority,
          createdAt: new Date(),
        };
        set((state) => ({ models: [...state.models, newModel] }));
        return newModel;
      },
      updateModel: (id, data) => {
        set((state) => ({
          models: state.models.map((m) => (m.id === id ? { ...m, ...data } : m)),
        }));
      },
      archiveModel: (id) => {
        set((state) => ({
          models: state.models.map((m) =>
            m.id === id ? { ...m, isArchived: true } : m
          ),
        }));
      },
      getModel: (id) => get().models.find((m) => m.id === id),
      findMatchingAccount: (params) => {
        const activeModels = get().models.filter((m) => !m.isArchived);
        
        // Find matching models and calculate their match score
        const matches = activeModels
          .map((model) => {
            let matchScore = 0;
            
            if (model.partnerTagId && params.tagIds?.includes(model.partnerTagId)) matchScore++;
            if (model.partnerId && model.partnerId === params.partnerId) matchScore++;
            if (model.productCategoryId && model.productCategoryId === params.categoryId) matchScore++;
            if (model.productId && model.productId === params.productId) matchScore++;
            
            return { model, matchScore };
          })
          .filter((m) => m.matchScore > 0)
          .sort((a, b) => b.matchScore - a.matchScore);

        if (matches.length > 0) {
          const accountId = matches[0].model.analyticalAccountId;
          return useAnalyticalAccountStore.getState().getAccount(accountId);
        }

        return undefined;
      },
    }),
    { name: 'erp-auto-analytical-models' }
  )
);

// ==================== BUDGET STORE ====================
interface BudgetStore {
  budgets: Budget[];
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt' | 'achievedAmount' | 'achievementPercentage' | 'remainingBalance' | 'revisionHistory'>) => Budget;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  confirmBudget: (id: string) => void;
  reviseBudget: (id: string, newAmount: number, reason?: string) => Budget;
  archiveBudget: (id: string) => void;
  getBudget: (id: string) => Budget | undefined;
  recalculateBudget: (id: string, achievedAmount: number) => void;
}

export const useBudgetStore = create<BudgetStore>()(
  persist(
    (set, get) => ({
      budgets: [
        {
          id: '1',
          name: 'Deepavali Income Budget',
          startDate: new Date('2026-10-01'),
          endDate: new Date('2026-11-30'),
          analyticalAccountId: '1',
          type: 'income',
          budgetedAmount: 500000,
          achievedAmount: 320000,
          achievementPercentage: 64,
          remainingBalance: 180000,
          state: 'confirmed',
          revisionHistory: [],
          isArchived: false,
          createdAt: new Date('2024-09-15'),
          updatedAt: new Date('2024-09-15'),
        },
        {
          id: '2',
          name: 'Marriage Season Expenses',
          startDate: new Date('2026-01-01'),
          endDate: new Date('2026-03-31'),
          analyticalAccountId: '2',
          type: 'expense',
          budgetedAmount: 200000,
          achievedAmount: 85000,
          achievementPercentage: 42.5,
          remainingBalance: 115000,
          state: 'confirmed',
          revisionHistory: [],
          isArchived: false,
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-01-01'),
        },
        {
          id: '3',
          name: 'Expo 2026 Budget',
          startDate: new Date('2026-06-01'),
          endDate: new Date('2026-06-30'),
          analyticalAccountId: '3',
          type: 'expense',
          budgetedAmount: 150000,
          achievedAmount: 0,
          achievementPercentage: 0,
          remainingBalance: 150000,
          state: 'draft',
          revisionHistory: [],
          isArchived: false,
          createdAt: new Date('2024-05-01'),
          updatedAt: new Date('2024-05-01'),
        },
      ],
      addBudget: (budgetData) => {
        const newBudget: Budget = {
          ...budgetData,
          id: Date.now().toString(),
          achievedAmount: 0,
          achievementPercentage: 0,
          remainingBalance: budgetData.budgetedAmount,
          revisionHistory: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ budgets: [...state.budgets, newBudget] }));
        return newBudget;
      },
      updateBudget: (id, data) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...data, updatedAt: new Date() } : b
          ),
        }));
      },
      confirmBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, state: 'confirmed', updatedAt: new Date() } : b
          ),
        }));
      },
      reviseBudget: (id, newAmount, reason) => {
        const oldBudget = get().getBudget(id);
        if (!oldBudget) throw new Error('Budget not found');

        const revision = {
          id: Date.now().toString(),
          budgetId: id,
          revisionDate: new Date(),
          previousAmount: oldBudget.budgetedAmount,
          newAmount,
          reason,
        };

        // Update old budget to revised state
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id
              ? {
                  ...b,
                  state: 'revised',
                  revisionHistory: [...b.revisionHistory, revision],
                  updatedAt: new Date(),
                }
              : b
          ),
        }));

        // Create new budget
        const date = new Date();
        const dateStr = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
        const newBudget: Budget = {
          id: Date.now().toString(),
          name: `${oldBudget.name} Rev ${dateStr}`,
          startDate: oldBudget.startDate,
          endDate: oldBudget.endDate,
          analyticalAccountId: oldBudget.analyticalAccountId,
          type: oldBudget.type,
          budgetedAmount: newAmount,
          achievedAmount: oldBudget.achievedAmount,
          achievementPercentage: (oldBudget.achievedAmount / newAmount) * 100,
          remainingBalance: newAmount - oldBudget.achievedAmount,
          state: 'confirmed',
          parentBudgetId: id,
          revisionHistory: [],
          isArchived: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set((state) => ({ budgets: [...state.budgets, newBudget] }));
        return newBudget;
      },
      archiveBudget: (id) => {
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, state: 'archived', isArchived: true, updatedAt: new Date() } : b
          ),
        }));
      },
      getBudget: (id) => get().budgets.find((b) => b.id === id),
      recalculateBudget: (id, achievedAmount) => {
        set((state) => ({
          budgets: state.budgets.map((b) => {
            if (b.id !== id) return b;
            const achievementPercentage = (achievedAmount / b.budgetedAmount) * 100;
            const remainingBalance = b.budgetedAmount - achievedAmount;
            return {
              ...b,
              achievedAmount,
              achievementPercentage,
              remainingBalance,
              updatedAt: new Date(),
            };
          }),
        }));
      },
    }),
    { name: 'erp-budgets' }
  )
);

// ==================== PURCHASE ORDER STORE ====================
interface PurchaseOrderStore {
  orders: PurchaseOrder[];
  addOrder: (order: Omit<PurchaseOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => PurchaseOrder;
  updateOrder: (id: string, data: Partial<PurchaseOrder>) => void;
  confirmOrder: (id: string) => void;
  archiveOrder: (id: string) => void;
  getOrder: (id: string) => PurchaseOrder | undefined;
}

export const usePurchaseOrderStore = create<PurchaseOrderStore>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: '1',
          orderNumber: 'PO-2026-0001',
          vendorId: '3',
          orderDate: new Date('2026-01-10'),
          lines: [
            { id: '1', productId: '1', quantity: 5, unitPrice: 28000, subtotal: 140000 },
            { id: '2', productId: '2', quantity: 3, unitPrice: 22000, subtotal: 66000 },
          ],
          totalAmount: 206000,
          status: 'confirmed',
          analyticalAccountId: '1',
          isArchived: false,
          createdAt: new Date('2026-01-10'),
          updatedAt: new Date('2026-01-10'),
        },
      ],
      addOrder: (orderData) => {
        const orders = get().orders;
        const year = new Date().getFullYear();
        const count = orders.filter((o) => o.orderNumber.includes(String(year))).length + 1;
        const orderNumber = `PO-${year}-${String(count).padStart(4, '0')}`;

        const newOrder: PurchaseOrder = {
          ...orderData,
          id: Date.now().toString(),
          orderNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
        return newOrder;
      },
      updateOrder: (id, data) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...data, updatedAt: new Date() } : o
          ),
        }));
      },
      confirmOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'confirmed', updatedAt: new Date() } : o
          ),
        }));
      },
      archiveOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, isArchived: true, updatedAt: new Date() } : o
          ),
        }));
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'erp-purchase-orders' }
  )
);

// ==================== VENDOR BILL STORE ====================
interface VendorBillStore {
  bills: VendorBill[];
  addBill: (bill: Omit<VendorBill, 'id' | 'billNumber' | 'createdAt' | 'updatedAt' | 'paidAmount'>) => VendorBill;
  updateBill: (id: string, data: Partial<VendorBill>) => void;
  postBill: (id: string) => void;
  archiveBill: (id: string) => void;
  getBill: (id: string) => VendorBill | undefined;
  updatePaymentStatus: (id: string, paidAmount: number) => void;
}

export const useVendorBillStore = create<VendorBillStore>()(
  persist(
    (set, get) => ({
      bills: [
        {
          id: '1',
          billNumber: 'BILL-2026-0001',
          purchaseOrderId: '1',
          vendorId: '3',
          billDate: new Date('2026-01-12'),
          dueDate: new Date('2026-02-12'),
          lines: [
            { id: '1', productId: '1', quantity: 5, unitPrice: 28000, subtotal: 140000 },
            { id: '2', productId: '2', quantity: 3, unitPrice: 22000, subtotal: 66000 },
          ],
          totalAmount: 206000,
          paidAmount: 100000,
          status: 'partially_paid',
          analyticalAccountId: '1',
          isArchived: false,
          createdAt: new Date('2026-01-12'),
          updatedAt: new Date('2026-01-15'),
        },
      ],
      addBill: (billData) => {
        const bills = get().bills;
        const year = new Date().getFullYear();
        const count = bills.filter((b) => b.billNumber.includes(String(year))).length + 1;
        const billNumber = `BILL-${year}-${String(count).padStart(4, '0')}`;

        const newBill: VendorBill = {
          ...billData,
          id: Date.now().toString(),
          billNumber,
          paidAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ bills: [...state.bills, newBill] }));
        return newBill;
      },
      updateBill: (id, data) => {
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id ? { ...b, ...data, updatedAt: new Date() } : b
          ),
        }));
      },
      postBill: (id) => {
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id ? { ...b, status: 'posted', updatedAt: new Date() } : b
          ),
        }));
      },
      archiveBill: (id) => {
        set((state) => ({
          bills: state.bills.map((b) =>
            b.id === id ? { ...b, isArchived: true, updatedAt: new Date() } : b
          ),
        }));
      },
      getBill: (id) => get().bills.find((b) => b.id === id),
      updatePaymentStatus: (id, paidAmount) => {
        set((state) => ({
          bills: state.bills.map((b) => {
            if (b.id !== id) return b;
            let status: VendorBill['status'] = 'posted';
            if (paidAmount >= b.totalAmount) {
              status = 'paid';
            } else if (paidAmount > 0) {
              status = 'partially_paid';
            }
            return { ...b, paidAmount, status, updatedAt: new Date() };
          }),
        }));
      },
    }),
    { name: 'erp-vendor-bills' }
  )
);

// ==================== BILL PAYMENT STORE ====================
interface BillPaymentStore {
  payments: BillPayment[];
  addPayment: (payment: Omit<BillPayment, 'id' | 'paymentNumber' | 'createdAt'>) => BillPayment;
  getPayment: (id: string) => BillPayment | undefined;
  getPaymentsForBill: (billId: string) => BillPayment[];
}

export const useBillPaymentStore = create<BillPaymentStore>()(
  persist(
    (set, get) => ({
      payments: [
        {
          id: '1',
          paymentNumber: 'PAY-2026-0001',
          vendorBillId: '1',
          paymentDate: new Date('2026-01-15'),
          amount: 100000,
          mode: 'bank_transfer',
          status: 'completed',
          createdAt: new Date('2026-01-15'),
        },
      ],
      addPayment: (paymentData) => {
        const payments = get().payments;
        const year = new Date().getFullYear();
        const count = payments.filter((p) => p.paymentNumber.includes(String(year))).length + 1;
        const paymentNumber = `PAY-${year}-${String(count).padStart(4, '0')}`;

        const newPayment: BillPayment = {
          ...paymentData,
          id: Date.now().toString(),
          paymentNumber,
          createdAt: new Date(),
        };
        set((state) => ({ payments: [...state.payments, newPayment] }));

        // Update bill payment status
        const bill = useVendorBillStore.getState().getBill(paymentData.vendorBillId);
        if (bill) {
          const allPayments = get().getPaymentsForBill(paymentData.vendorBillId);
          const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0) + paymentData.amount;
          useVendorBillStore.getState().updatePaymentStatus(paymentData.vendorBillId, totalPaid);
        }

        return newPayment;
      },
      getPayment: (id) => get().payments.find((p) => p.id === id),
      getPaymentsForBill: (billId) =>
        get().payments.filter((p) => p.vendorBillId === billId),
    }),
    { name: 'erp-bill-payments' }
  )
);

// ==================== SALES ORDER STORE ====================
interface SalesOrderStore {
  orders: SalesOrder[];
  addOrder: (order: Omit<SalesOrder, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => SalesOrder;
  updateOrder: (id: string, data: Partial<SalesOrder>) => void;
  confirmOrder: (id: string) => void;
  archiveOrder: (id: string) => void;
  getOrder: (id: string) => SalesOrder | undefined;
}

export const useSalesOrderStore = create<SalesOrderStore>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: '1',
          orderNumber: 'SO-2026-0001',
          customerId: '1',
          orderDate: new Date('2026-01-15'),
          lines: [
            { id: '1', productId: '1', quantity: 2, unitPrice: 45000, subtotal: 90000 },
            { id: '2', productId: '4', quantity: 1, unitPrice: 28000, subtotal: 28000 },
          ],
          totalAmount: 118000,
          status: 'confirmed',
          analyticalAccountId: '1',
          isArchived: false,
          createdAt: new Date('2026-01-15'),
          updatedAt: new Date('2026-01-15'),
        },
        {
          id: '2',
          orderNumber: 'SO-2026-0002',
          customerId: '2',
          orderDate: new Date('2026-01-20'),
          lines: [
            { id: '1', productId: '3', quantity: 5, unitPrice: 18000, subtotal: 90000 },
          ],
          totalAmount: 90000,
          status: 'draft',
          analyticalAccountId: '2',
          isArchived: false,
          createdAt: new Date('2026-01-20'),
          updatedAt: new Date('2026-01-20'),
        },
      ],
      addOrder: (orderData) => {
        const orders = get().orders;
        const year = new Date().getFullYear();
        const count = orders.filter((o) => o.orderNumber.includes(String(year))).length + 1;
        const orderNumber = `SO-${year}-${String(count).padStart(4, '0')}`;

        const newOrder: SalesOrder = {
          ...orderData,
          id: Date.now().toString(),
          orderNumber,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ orders: [...state.orders, newOrder] }));
        return newOrder;
      },
      updateOrder: (id, data) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, ...data, updatedAt: new Date() } : o
          ),
        }));
      },
      confirmOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, status: 'confirmed', updatedAt: new Date() } : o
          ),
        }));
      },
      archiveOrder: (id) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === id ? { ...o, isArchived: true, updatedAt: new Date() } : o
          ),
        }));
      },
      getOrder: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: 'erp-sales-orders' }
  )
);

// ==================== CUSTOMER INVOICE STORE ====================
interface CustomerInvoiceStore {
  invoices: CustomerInvoice[];
  addInvoice: (invoice: Omit<CustomerInvoice, 'id' | 'invoiceNumber' | 'createdAt' | 'updatedAt' | 'paidAmount'>) => CustomerInvoice;
  updateInvoice: (id: string, data: Partial<CustomerInvoice>) => void;
  postInvoice: (id: string) => void;
  archiveInvoice: (id: string) => void;
  getInvoice: (id: string) => CustomerInvoice | undefined;
  updatePaymentStatus: (id: string, paidAmount: number) => void;
}

export const useCustomerInvoiceStore = create<CustomerInvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: [
        {
          id: '1',
          invoiceNumber: 'INV-2026-0001',
          salesOrderId: '1',
          customerId: '1',
          invoiceDate: new Date('2026-01-16'),
          dueDate: new Date('2026-02-16'),
          lines: [
            { id: '1', productId: '1', quantity: 2, unitPrice: 45000, subtotal: 90000 },
            { id: '2', productId: '4', quantity: 1, unitPrice: 28000, subtotal: 28000 },
          ],
          totalAmount: 118000,
          paidAmount: 118000,
          status: 'paid',
          analyticalAccountId: '1',
          isArchived: false,
          createdAt: new Date('2026-01-16'),
          updatedAt: new Date('2026-01-20'),
        },
      ],
      addInvoice: (invoiceData) => {
        const invoices = get().invoices;
        const year = new Date().getFullYear();
        const count = invoices.filter((i) => i.invoiceNumber.includes(String(year))).length + 1;
        const invoiceNumber = `INV-${year}-${String(count).padStart(4, '0')}`;

        const newInvoice: CustomerInvoice = {
          ...invoiceData,
          id: Date.now().toString(),
          invoiceNumber,
          paidAmount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        set((state) => ({ invoices: [...state.invoices, newInvoice] }));
        return newInvoice;
      },
      updateInvoice: (id, data) => {
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id ? { ...i, ...data, updatedAt: new Date() } : i
          ),
        }));
      },
      postInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id ? { ...i, status: 'posted', updatedAt: new Date() } : i
          ),
        }));
      },
      archiveInvoice: (id) => {
        set((state) => ({
          invoices: state.invoices.map((i) =>
            i.id === id ? { ...i, isArchived: true, updatedAt: new Date() } : i
          ),
        }));
      },
      getInvoice: (id) => get().invoices.find((i) => i.id === id),
      updatePaymentStatus: (id, paidAmount) => {
        set((state) => ({
          invoices: state.invoices.map((i) => {
            if (i.id !== id) return i;
            let status: CustomerInvoice['status'] = 'posted';
            if (paidAmount >= i.totalAmount) {
              status = 'paid';
            } else if (paidAmount > 0) {
              status = 'partially_paid';
            }
            return { ...i, paidAmount, status, updatedAt: new Date() };
          }),
        }));
      },
    }),
    { name: 'erp-customer-invoices' }
  )
);

// ==================== INVOICE PAYMENT STORE ====================
interface InvoicePaymentStore {
  payments: InvoicePayment[];
  addPayment: (payment: Omit<InvoicePayment, 'id' | 'paymentNumber' | 'createdAt'>) => InvoicePayment;
  getPayment: (id: string) => InvoicePayment | undefined;
  getPaymentsForInvoice: (invoiceId: string) => InvoicePayment[];
}

export const useInvoicePaymentStore = create<InvoicePaymentStore>()(
  persist(
    (set, get) => ({
      payments: [
        {
          id: '1',
          paymentNumber: 'REC-2026-0001',
          customerInvoiceId: '1',
          paymentDate: new Date('2026-01-20'),
          amount: 118000,
          mode: 'online',
          status: 'completed',
          createdAt: new Date('2026-01-20'),
        },
      ],
      addPayment: (paymentData) => {
        const payments = get().payments;
        const year = new Date().getFullYear();
        const count = payments.filter((p) => p.paymentNumber.includes(String(year))).length + 1;
        const paymentNumber = `REC-${year}-${String(count).padStart(4, '0')}`;

        const newPayment: InvoicePayment = {
          ...paymentData,
          id: Date.now().toString(),
          paymentNumber,
          createdAt: new Date(),
        };
        set((state) => ({ payments: [...state.payments, newPayment] }));

        // Update invoice payment status
        const invoice = useCustomerInvoiceStore.getState().getInvoice(paymentData.customerInvoiceId);
        if (invoice) {
          const allPayments = get().getPaymentsForInvoice(paymentData.customerInvoiceId);
          const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0) + paymentData.amount;
          useCustomerInvoiceStore.getState().updatePaymentStatus(paymentData.customerInvoiceId, totalPaid);
        }

        return newPayment;
      },
      getPayment: (id) => get().payments.find((p) => p.id === id),
      getPaymentsForInvoice: (invoiceId) =>
        get().payments.filter((p) => p.customerInvoiceId === invoiceId),
    }),
    { name: 'erp-invoice-payments' }
  )
);
