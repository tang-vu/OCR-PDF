import * as pdfjsLib from 'pdfjs-dist';
import { PdfPageInfo } from '../../types/pdf.types';
import { preprocessCanvas, getPreprocessOptions } from '../ocr/imagePreprocessor';

// Đăng ký worker cho pdf.js
// Sử dụng worker từ CDN phù hợp hoặc sao chép vào thư mục public
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export interface ExtractOptions {
  quality?: 'medium' | 'high';
  enablePreprocessing?: boolean;
}

/**
 * Trích xuất các trang từ file PDF và chuyển thành dạng hình ảnh
 * @param file File PDF cần trích xuất
 * @param onProgress Callback để báo cáo tiến độ trích xuất
 * @param options Tùy chọn chất lượng và preprocessing
 */
export async function extractPdfPages(
  file: File,
  onProgress?: (current: number, total: number) => void,
  options: ExtractOptions = {}
): Promise<PdfPageInfo[]> {
  const { quality = 'medium', enablePreprocessing = true } = options;

  // Scale cao hơn cho quality high (tương đương ~300 DPI)
  // Scale 2.0 cho medium (~200 DPI), 3.0 cho high (~300 DPI)
  const scale = quality === 'high' ? 3.0 : 2.0;

  try {
    // Chuyển File thành ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Tải tài liệu PDF
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // Lấy tổng số trang
    const numPages = pdfDocument.numPages;
    const pagesInfo: PdfPageInfo[] = [];

    // Lặp qua từng trang và trích xuất thành hình ảnh
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      // Cập nhật tiến độ nếu có callback
      if (onProgress) {
        onProgress(pageNum, numPages);
      }

      const page = await pdfDocument.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Tạo canvas để render PDF
      let canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Không thể tạo context canvas 2D');
      }

      // Thiết lập kích thước canvas
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render trang PDF vào canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Áp dụng image preprocessing để cải thiện OCR accuracy (15-30%)
      if (enablePreprocessing) {
        const preprocessOptions = getPreprocessOptions(quality);
        canvas = preprocessCanvas(canvas, preprocessOptions);
      }

      // Chuyển canvas thành dataURL (base64 image)
      const dataUrl = canvas.toDataURL('image/png');

      // Thêm thông tin trang vào mảng kết quả
      pagesInfo.push({
        pageNumber: pageNum,
        width: viewport.width,
        height: viewport.height,
        dataUrl: dataUrl,
      });
    }

    return pagesInfo;
  } catch (error) {
    console.error('Lỗi khi trích xuất trang PDF:', error);
    throw error;
  }
}
