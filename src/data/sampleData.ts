import { ExpenseCategory, OcrModelConfig, SampleReceipt, Transaction, Wallet } from '../types';

export const INITIAL_WALLETS: Wallet[] = [
  {
    id: 'w-cash',
    name: 'Tiền mặt (Ví cá nhân)',
    type: 'cash',
    balance: 2450000,
    color: '#10b981',
  },
  {
    id: 'w-techcombank',
    name: 'Techcombank Chi tiêu',
    type: 'bank',
    bankName: 'Techcombank',
    accountNumber: '1903****8899',
    balance: 18650000,
    color: '#ef4444',
  },
  {
    id: 'w-momo',
    name: 'Ví Điện Tử MoMo',
    type: 'e-wallet',
    balance: 3200000,
    color: '#d946ef',
  },
  {
    id: 'w-vcb',
    name: 'Vietcombank Lương',
    type: 'bank',
    bankName: 'Vietcombank',
    accountNumber: '0071****1234',
    balance: 42500000,
    color: '#059669',
  },
];

export const INITIAL_BUDGETS: Record<ExpenseCategory, number> = {
  'Ăn uống': 6000000,
  'Mua sắm': 4000000,
  'Di chuyển': 1500000,
  'Hóa đơn & Tiện ích': 3000000,
  'Sức khỏe': 1200000,
  'Giải trí': 2000000,
  'Khác': 1000000,
};

export const INITIAL_MODELS: OcrModelConfig[] = [
  {
    id: 'paddleocr-v4-det-mcocr',
    name: 'PaddleOCR PP-OCRv4 DBNet++ (Fine-Tuned MC-OCR 2021 Detection)',
    task: 'detection',
    architecture: 'PaddleOCR-PP-OCRv4-DBNet',
    dataset: 'Kaggle Vietnamese Receipts MC-OCR 2021 (domixi1989)',
    cerScore: 0.0125,
    accuracy: 98.75,
    hmeanF1: 0.9482,
    precision: 0.9621,
    recall: 0.9348,
    checkpointFileName: 'paddleocr_det_mcocr2021_finetuned.zip',
    weightsSizeMb: 4.6,
    trainedAt: '2026-10-30',
    isFineTuned: true,
    isActive: true,
    notes: 'Khối Text Detection DBNet++ fine-tune trên Kaggle MC-OCR 2021. Đạt Hmean (F1): 94.82%, Precision: 96.21%, Recall: 93.48% trên hóa đơn nhiệt.',
  },
  {
    id: 'paddleocr-v4-pipeline-e2e',
    name: 'PaddleOCR PP-OCRv4 Toàn Trang (DBNet++ & SVTR-LCNet)',
    task: 'end-to-end',
    architecture: 'PaddleOCR-PP-OCRv4',
    dataset: 'PaddleOCR Multilingual + Kaggle MC-OCR 2021',
    cerScore: 0.0125,
    accuracy: 98.75,
    hmeanF1: 0.932,
    precision: 0.945,
    recall: 0.92,
    checkpointFileName: 'paddleocr_ppocrv4_e2e.zip',
    weightsSizeMb: 12.8,
    trainedAt: '2026-10-29',
    isFineTuned: true,
    isActive: false,
    notes: 'Pipeline kết hợp khối DBNet++ phát hiện khung chữ với mô hình SVTR-LCNet nhận diện tiếng Việt đầy đủ dấu thanh.',
  },
  {
    id: 'paddleocr-v4-det-base',
    name: 'PaddleOCR PP-OCRv4 DBNet Baseline (Pre-trained ch_PP-OCRv4_det)',
    task: 'detection',
    architecture: 'PaddleOCR-PP-OCRv4-DBNet',
    dataset: 'Baidu PaddleOCR Benchmark',
    cerScore: 0.038,
    accuracy: 96.2,
    hmeanF1: 0.884,
    precision: 0.892,
    recall: 0.876,
    checkpointFileName: 'ch_PP-OCRv4_det_train.tar',
    weightsSizeMb: 4.6,
    trainedAt: '2024-08-15',
    isFineTuned: false,
    isActive: false,
    notes: 'Trọng số Detection DBNet++ gốc chưa qua fine-tune trên dữ liệu hóa đơn tiếng Việt.',
  },
];

// Helper to create receipt voucher images via SVG data URI
function createReceiptSvgUrl(storeName: string, total: string, date: string, items: string[]): string {
  const itemRows = items.map((it, idx) => 
    `<text x="20" y="${140 + idx * 24}" font-family="monospace" font-size="12" fill="#334155">${it}</text>`
  ).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="460" viewBox="0 0 340 460">
    <rect width="340" height="460" fill="#f8fafc" rx="8"/>
    <rect x="12" y="12" width="316" height="436" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5" rx="6"/>
    <!-- Top jagged edge -->
    <path d="M 12 12 Q 22 20 32 12 Q 42 20 52 12 Q 62 20 72 12 Q 82 20 92 12 Q 102 20 112 12 Q 122 20 132 12 Q 142 20 152 12 Q 162 20 172 12 Q 182 20 192 12 Q 202 20 212 12 Q 222 20 232 12 Q 242 20 252 12 Q 262 20 272 12 Q 282 20 292 12 Q 302 20 312 12 L 328 12" fill="none" stroke="#cbd5e1" stroke-width="1"/>
    
    <text x="170" y="48" font-family="system-ui, sans-serif" font-weight="bold" font-size="16" text-anchor="middle" fill="#0f172a">${storeName}</text>
    <text x="170" y="68" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle" fill="#64748b">PHIẾU THANH TOÁN / RECEIPT</text>
    <text x="170" y="86" font-family="monospace" font-size="11" text-anchor="middle" fill="#64748b">Ngày: ${date}</text>
    <line x1="24" y1="102" x2="316" y2="102" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1"/>
    
    <text x="24" y="120" font-family="monospace" font-weight="bold" font-size="11" fill="#475569">MẶT HÀNG</text>
    <text x="316" y="120" font-family="monospace" font-weight="bold" font-size="11" text-anchor="end" fill="#475569">TIỀN</text>
    <line x1="24" y1="126" x2="316" y2="126" stroke="#cbd5e1" stroke-width="1"/>
    
    ${itemRows}
    
    <line x1="24" y1="330" x2="316" y2="330" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1"/>
    <text x="24" y="354" font-family="system-ui, sans-serif" font-weight="bold" font-size="14" fill="#0f172a">TỔNG CỘNG:</text>
    <text x="316" y="354" font-family="monospace" font-weight="bold" font-size="16" text-anchor="end" fill="#0f172a">${total}</text>
    
    <text x="170" y="390" font-family="system-ui, sans-serif" font-size="11" text-anchor="middle" fill="#64748b">Cảm ơn quý khách và hẹn gặp lại!</text>
    <rect x="80" y="408" width="180" height="20" fill="#0f172a" rx="3"/>
    <text x="170" y="422" font-family="monospace" font-size="10" text-anchor="middle" fill="#ffffff">VIETOCR TEST BILL</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_RECEIPTS: SampleReceipt[] = [
  {
    id: 'sample-highlands',
    title: 'Highlands Coffee - Cà phê & Bánh ngọt',
    merchant: 'HIGHLANDS COFFEE',
    category: 'Ăn uống',
    totalEstimated: 124000,
    date: '2026-10-26',
    imageUrl: createReceiptSvgUrl(
      'HIGHLANDS COFFEE',
      '124,000 đ',
      '26/10/2026 09:15',
      [
        '1. Phin Sua Da (L)     49,000',
        '2. Tra Sen Vang (M)    55,000',
        '3. Banh Mi Que Ga      20,000'
      ]
    ),
    rawOcrLines: [
      'HIGHLANDS COFFEE',
      'CHI NHANH VINCOM DONG KHOI',
      'D/C: 72 LE THANH TON, Q.1, TP.HCM',
      'HD SO: HD20261026-0814',
      'NGAY: 26/10/2026  GIO: 09:15',
      'TEN MON               SL   DON GIA    T.TIEN',
      '--------------------------------------------',
      '1. Phin Sua Da (L)     1    49.000    49.000',
      '2. Tra Sen Vang (M)    1    55.000    55.000',
      '3. Banh Mi Que Ga      1    20.000    20.000',
      '--------------------------------------------',
      'CONG TIEN HANG:                      124.000',
      'THUE VAT (8%):                         9.920',
      'TONG TIEN THANH TOAN:                124.000',
      'HINH THUC: VI MOMO',
      'CAM ON QUY KHACH VA HEN GAP LAI'
    ]
  },
  {
    id: 'sample-circlek',
    title: 'Circle K - Nước ngọt & Đồ ăn nhanh',
    merchant: 'CIRCLE K VIETNAM',
    category: 'Mua sắm',
    totalEstimated: 68000,
    date: '2026-10-27',
    imageUrl: createReceiptSvgUrl(
      'CIRCLE K CONVENIENCE',
      '68,000 đ',
      '27/10/2026 21:40',
      [
        '1. Mi Tron Trung Xuc Xich 35,000',
        '2. Tra Sua Thai Xanh      22,000',
        '3. Nuoc Suoi Aquafina      11,000'
      ]
    ),
    rawOcrLines: [
      'CONG TY TNHH VONG TAY THAI BINH DUONG',
      'CUA HANG CIRCLE K NGUYEN THI MINH KHAI',
      'PHIEU THANH TOAN: CK-77821',
      'NGAY BAN: 27/10/2026  21:40',
      'SP                      SL   GIA      T.TIEN',
      '--------------------------------------------',
      'Mi Tron Trung Xuc Xich   1   35.000   35.000',
      'Tra Sua Thai Xanh        1   22.000   22.000',
      'Nuoc Suoi Aquafina 500ml 1   11.000   11.000',
      '--------------------------------------------',
      'TONG TIEN:                            68.000',
      'TIEN KHACH DUA:                      100.000',
      'TIEN THUA:                            32.000',
      'PHUONG THUC: TIEN MAT',
      'CIRCLE K XIN CAM ON'
    ]
  },
  {
    id: 'sample-coopmart',
    title: 'Co.opmart - Hóa đơn mua sắm thực phẩm tuần',
    merchant: 'CO.OPMART CONG QUYNH',
    category: 'Mua sắm',
    totalEstimated: 382000,
    date: '2026-10-25',
    imageUrl: createReceiptSvgUrl(
      'SIEU THI CO.OPMART',
      '382,000 đ',
      '25/10/2026 17:30',
      [
        '1. Thit Heo Ba Roi 0.5kg 85,000',
        '2. Ca Hoi Na Uy 0.3kg   145,000',
        '3. Rau Cai Xanh Huu Co    22,000',
        '4. Sua Tuoi TH True Milk  74,000',
        '5. Giao Vi Hat Nem Knorr  56,000'
      ]
    ),
    rawOcrLines: [
      'HE THONG SIEU THI CO.OPMART',
      'CHI NHANH: CO.OPMART CONG QUYNH',
      'HOA DON BAN LE: COOP-998124',
      'THOI GIAN: 25/10/2026 17:30:12',
      'TEN SAN PHAM              SL    DON GIA    THANH TIEN',
      '-----------------------------------------------------',
      'Thit Heo Ba Roi VietGAP    1     85.000        85.000',
      'Ca Hoi Na Uy Phi Le 0.3kg  1    145.000       145.000',
      'Rau Cai Xanh Huu Co        1     22.000        22.000',
      'Loc 4 Hop Sua Tuoi TH      2     37.000        74.000',
      'Hat Nem Knorr Thit Than    1     56.000        56.000',
      '-----------------------------------------------------',
      'TIEN HANG:                                    382.000',
      'CHIET KHAU THE CO.OP:                               0',
      'TONG THANH TOAN:                              382.000',
      'TT THE TECHCOMBANK:                           382.000',
      'DIEM TICH LUY: +38 DIEM'
    ]
  },
  {
    id: 'sample-petrolimex',
    title: 'Petrolimex - Đổ xăng xe máy Xăng RON 95',
    merchant: 'PETROLIMEX CUA HANG SO 03',
    category: 'Di chuyển',
    totalEstimated: 95000,
    date: '2026-10-28',
    imageUrl: createReceiptSvgUrl(
      'PETROLIMEX VIETNAM',
      '95,000 đ',
      '28/10/2026 07:30',
      [
        '1. Xang RON 95-III (4.2L) 95,000'
      ]
    ),
    rawOcrLines: [
      'TAP DOAN XANG DAU VIET NAM',
      'CUA HANG XANG DAU SO 03 - DIEN BIEN PHU',
      'HOA DON GIA TRI GIA TANG',
      'SO: 0048192 - KY HIEU: 1C26TPL',
      'NGAY: 28/10/2026  07:30',
      'TEN HANG HOA: XANG RON 95-III',
      'SO LUONG: 4.22 LIT',
      'DON GIA: 22.510 DONG/LIT',
      'TIEN HANG: 87.963',
      'THUE GTGT (8%): 7.037',
      'TONG TIEN THANH TOAN: 95.000 DONG',
      'HINH THUC: TIEN MAT',
      'PETROLIMEX HAN HANH PHUC VU'
    ]
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    date: '2026-10-28',
    time: '07:30',
    merchant: 'Petrolimex Cửa Hàng Số 03',
    category: 'Di chuyển',
    amount: 95000,
    walletId: 'w-cash',
    items: [{ name: 'Xăng RON 95-III (4.22L)', quantity: 1, unit_price: 95000, total: 95000 }],
    taxAmount: 7037,
    notes: 'Đổ xăng xe máy đi làm',
    createdAt: '2026-10-28T07:35:00Z',
    receiptImageUrl: SAMPLE_RECEIPTS[3].imageUrl,
  },
  {
    id: 'tx-002',
    date: '2026-10-27',
    time: '21:40',
    merchant: 'Circle K Nguyễn Thị Minh Khai',
    category: 'Mua sắm',
    amount: 68000,
    walletId: 'w-cash',
    items: [
      { name: 'Mì Trộn Trứng Xúc Xích', quantity: 1, unit_price: 35000, total: 35000 },
      { name: 'Trà Sữa Thái Xanh', quantity: 1, unit_price: 22000, total: 22000 },
      { name: 'Nước Suối Aquafina 500ml', quantity: 1, unit_price: 11000, total: 11000 }
    ],
    notes: 'Ăn khuya tăng ca',
    createdAt: '2026-10-27T21:45:00Z',
  },
  {
    id: 'tx-003',
    date: '2026-10-26',
    time: '09:15',
    merchant: 'Highlands Coffee Vincom',
    category: 'Ăn uống',
    amount: 124000,
    walletId: 'w-momo',
    items: [
      { name: 'Phin Sữa Đá (L)', quantity: 1, unit_price: 49000, total: 49000 },
      { name: 'Trà Sen Vàng (M)', quantity: 1, unit_price: 55000, total: 55000 },
      { name: 'Bánh Mì Que Gà', quantity: 1, unit_price: 20000, total: 20000 }
    ],
    diacriticCorrections: ['Phin Sua Da -> Phin Sữa Đá', 'Tra Sen Vang -> Trà Sen Vàng', 'Banh Mi Que Ga -> Bánh Mì Que Gà'],
    notes: 'Gặp gỡ khách hàng sáng thứ hai',
    createdAt: '2026-10-26T09:20:00Z',
  },
  {
    id: 'tx-004',
    date: '2026-10-25',
    time: '17:30',
    merchant: 'Co.opmart Cống Quỳnh',
    category: 'Mua sắm',
    amount: 382000,
    walletId: 'w-techcombank',
    items: [
      { name: 'Thịt Heo Ba Rọi VietGAP', quantity: 1, unit_price: 85000, total: 85000 },
      { name: 'Cá Hồi Na Uy Phi Lê 0.3kg', quantity: 1, unit_price: 145000, total: 145000 },
      { name: 'Rau Cải Xanh Hữu Cơ', quantity: 1, unit_price: 22000, total: 22000 },
      { name: 'Lốc 4 Hộp Sữa Tươi TH True Milk', quantity: 2, unit_price: 37000, total: 74000 },
      { name: 'Hạt Nêm Knorr Thịt Thăn', quantity: 1, unit_price: 56000, total: 56000 }
    ],
    diacriticCorrections: ['Thit Heo Ba Roi -> Thịt Heo Ba Rọi', 'Ca Hoi Na Uy -> Cá Hồi Na Uy'],
    notes: 'Đi siêu thị chuẩn bị nấu ăn gia đình',
    createdAt: '2026-10-25T17:40:00Z',
  },
  {
    id: 'tx-005',
    date: '2026-10-24',
    time: '12:15',
    merchant: 'Cơm Niêu Sài Gòn',
    category: 'Ăn uống',
    amount: 285000,
    walletId: 'w-techcombank',
    items: [
      { name: 'Cơm Niêu Cháy Giòn', quantity: 2, unit_price: 35000, total: 70000 },
      { name: 'Cá Kho Tộ Đậm Đà', quantity: 1, unit_price: 135000, total: 135000 },
      { name: 'Canh Chua Cá Bớp', quantity: 1, unit_price: 80000, total: 80000 }
    ],
    notes: 'Ăn trưa cùng đồng nghiệp',
    createdAt: '2026-10-24T12:20:00Z',
  },
  {
    id: 'tx-006',
    date: '2026-10-22',
    time: '19:00',
    merchant: 'Pharmacity Hai Bà Trưng',
    category: 'Sức khỏe',
    amount: 215000,
    walletId: 'w-momo',
    items: [
      { name: 'Vitamin C Berocca', quantity: 1, unit_price: 135000, total: 135000 },
      { name: 'Khẩu Trang Y Tế 4 Lớp', quantity: 2, unit_price: 40000, total: 80000 }
    ],
    notes: 'Mua vitamin bồi bổ',
    createdAt: '2026-10-22T19:05:00Z',
  },
  {
    id: 'tx-007',
    date: '2026-10-20',
    time: '08:45',
    merchant: 'Điện Lực EVN TP.HCM',
    category: 'Hóa đơn & Tiện ích',
    amount: 980000,
    walletId: 'w-techcombank',
    items: [{ name: 'Hóa đơn tiền điện tháng 10', quantity: 1, unit_price: 980000, total: 980000 }],
    notes: 'Tiền điện sinh hoạt căn hộ',
    createdAt: '2026-10-20T08:50:00Z',
  },
  {
    id: 'tx-008',
    date: '2026-10-18',
    time: '20:30',
    merchant: 'CGV Cinemas Landmark 81',
    category: 'Giải trí',
    amount: 320000,
    walletId: 'w-momo',
    items: [
      { name: 'Vé xem phim IMAX 2D', quantity: 2, unit_price: 130000, total: 260000 },
      { name: 'Bắp rang bơ phô mai', quantity: 1, unit_price: 60000, total: 60000 }
    ],
    notes: 'Xem phim cuối tuần',
    createdAt: '2026-10-18T20:35:00Z',
  }
];
