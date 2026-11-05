export type ExpenseCategory =
  | 'Ăn uống'
  | 'Mua sắm'
  | 'Di chuyển'
  | 'Hóa đơn & Tiện ích'
  | 'Sức khỏe'
  | 'Giải trí'
  | 'Khác';

export interface ReceiptItem {
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface ParsedReceiptData {
  merchant: string;
  address?: string;
  phone?: string;
  date: string;
  time?: string;
  invoice_no?: string;
  items: ReceiptItem[];
  subtotal?: number;
  discount?: number;
  vat?: number;
  total_amount: number;
  payment_method?: string;
  category: ExpenseCategory;
  suggested_wallet?: 'cash' | 'bank' | 'e-wallet';
  diacritic_corrections?: string[];
  raw_ocr_text?: string;
  summary?: string;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  time?: string;
  merchant: string;
  category: ExpenseCategory;
  amount: number;
  walletId: string;
  items?: ReceiptItem[];
  receiptImageUrl?: string;
  ocrRawText?: string;
  taxAmount?: number;
  notes?: string;
  diacriticCorrections?: string[];
  createdAt: string;
}

export interface Wallet {
  id: string;
  name: string;
  type: 'cash' | 'bank' | 'e-wallet' | 'savings';
  balance: number;
  color: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
}

export interface CategoryBudget {
  category: ExpenseCategory;
  monthlyLimit: number;
  spent: number;
}

export interface OcrModelConfig {
  id: string;
  name: string;
  task?: 'detection' | 'recognition' | 'end-to-end';
  architecture:
    | 'PaddleOCR-PP-OCRv4-DBNet'
    | 'PaddleOCR-PP-OCRv4-Detection'
    | 'PaddleOCR-PP-OCRv4-SVTR'
    | 'PaddleOCR-PP-OCRv4'
    | 'PaddleOCR-PPv4'
    | 'TrOCR-ViT-Transformer'
    | 'TrOCR-Base'
    | 'VggTransformer';
  dataset: string;
  cerScore: number; // e.g. 0.0125 (1.25%)
  accuracy: number; // e.g. 98.75%
  hmeanF1?: number; // e.g. 0.9482 (94.82% F1-score for detection)
  precision?: number; // e.g. 0.9621 (96.21%)
  recall?: number; // e.g. 0.9348 (93.48%)
  checkpointFileName: string;
  weightsSizeMb: number;
  trainedAt: string;
  isFineTuned: boolean;
  isActive: boolean;
  notes: string;
}

export interface SampleReceipt {
  id: string;
  title: string;
  merchant: string;
  category: ExpenseCategory;
  totalEstimated: number;
  date: string;
  imageUrl: string;
  rawOcrLines: string[];
}
