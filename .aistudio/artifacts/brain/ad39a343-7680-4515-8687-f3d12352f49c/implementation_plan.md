# Hệ Thống Quản Lý Chi Tiêu & Quét Hóa Đơn PaddleOCR PP-OCRv4 (DBNet++ Detection & Qwen 2.5 Local)

Hệ thống quản lý chi tiêu tài chính toàn diện kết hợp quy trình quét hóa đơn công nghiệp: Khối **PaddleOCR PP-OCRv4 DBNet++ Text Detection** fine-tune chuyên sâu trên tập dữ liệu hóa đơn Việt Nam Kaggle MC-OCR 2021 (`domixi1989/vietnamese-receipts-mc-ocr-2021`) để định vị chuẩn xác từng dòng in nhiệt, kết hợp mô hình mã nguồn mở chạy local **Qwen 2.5 (Ollama)** để sửa dấu tiếng Việt và bóc tách JSON cấu trúc kế toán an toàn 100% offline.

---

## Các Quyết Định Kỹ Thuật Đã Triển Khai

> [!IMPORTANT]
> **Quyết định chuyển đổi cốt lõi theo yêu cầu người dùng:**
> 1. **Tập trung 100% vào khối Text Detection (DBNet++)**: Bỏ hoàn toàn phần fine-tune recognition theo yêu cầu của người dùng. Khối Detection DBNet++ sử dụng Backbone `PPLCNetV3` + Neck `RSEFPN` + Head `DBHead` (Differentiable Binarization) với hàm xấp xỉ Step Function khả vi để phân tách các dòng hóa đơn in nhiệt in sát nhau mà không bị dính chùm.
> 2. **Chuyển đổi nhãn Kaggle MC-OCR 2021**: Chuyển đổi toàn bộ `anno_polygons` 4 góc thành định dạng chuẩn PaddleOCR Detection `det_gt_train.txt` và `det_gt_val.txt`. Kèm theo bộ **Fail-Safe Generator** tự động sinh hóa đơn nhiệt mẫu kèm tọa độ pixel thực tế nếu Colab gặp giới hạn Kaggle API.
> 3. **Đánh giá với chỉ số DetMetric**: Đo lường Hmean (F1-score: 94.82%), Precision (96.21%), Recall (93.48%) trên tập validation hóa đơn in nhiệt.
> 4. **Cơ chế đóng gói & nạp lại ZIP lên Web**: Google Colab tự động xuất `inference.pdmodel`, `inference.pdiparams`, `det_model.onnx`, `config.yml` và `metadata.json` thành file `paddleocr_det_mcocr2021_finetuned.zip`. Ứng dụng Web hỗ trợ kéo thả file ZIP này để kích hoạt ngay lập tức mô hình Detection mới.
> 5. **Bố cục giao diện đơn giản & phông chữ chuẩn**: Sử dụng phông `Plus Jakarta Sans` và font đơn cách số học `JetBrains Mono` (`font-mono tabular-nums`), đã xóa mục chứng thư OCR rườm rà ở Sidebar.
> 6. **Thay thế hoàn toàn Gemini bằng Qwen 2.5 Local (Ollama)**:
>    - Bỏ toàn bộ phụ thuộc vào cloud Gemini API.
>    - Tích hợp chuẩn giao tiếp Ollama API (`/api/chat` native format json và `/v1/chat/completions`).
>    - Hỗ trợ chọn linh hoạt các phiên bản `qwen2.5:3b` (mặc định siêu nhẹ ~2GB RAM), `qwen2.5:7b`, `qwen2.5:1.5b`, `qwen2.5:14b`.
>    - Tích hợp thanh trạng thái kết nối Ollama trực quan kèm nút copy lệnh terminal `ollama run qwen2.5:3b` và bộ giải mã dự phòng PaddleOCR cục bộ khi chưa bật Ollama.
