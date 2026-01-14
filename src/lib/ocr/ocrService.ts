import * as Tesseract from 'tesseract.js';
import { OcrOptions, OcrProgress, OcrResult } from '../../types/ocr.types';
import { delay } from '../utils';

export class OcrService {
  private scheduler: Tesseract.Scheduler;
  private workers: Tesseract.Worker[] = [];
  private isInitialized = false;
  private abortController: AbortController | null = null;

  constructor() {
    this.scheduler = Tesseract.createScheduler();
  }

  private async initialize(languages: string[], numWorkers = 2, quality: 'medium' | 'high' = 'medium') {
    if (this.isInitialized) return;

    this.abortController = new AbortController();

    const languageList = languages.join('+');

    for (let i = 0; i < numWorkers; i++) {
      // Tạo worker với logger đơn giản không có hàm lambda
      const worker = await Tesseract.createWorker();

      // Sử dụng as any để bỏ qua TypeScript errors
      await (worker as any).loadLanguage(languageList);
      await (worker as any).initialize(languageList);

      // Cấu hình PSM và các tham số OCR tối ưu
      // PSM 6: Assume a single uniform block of text (tốt cho PDF documents)
      // preserve_interword_spaces: Giữ khoảng cách giữa các từ
      await (worker as any).setParameters({
        tessedit_pageseg_mode: quality === 'high' ? '6' : '3', // PSM 6 cho high, PSM 3 (auto) cho medium
        preserve_interword_spaces: '1',
        tessedit_char_blacklist: '', // Không loại bỏ ký tự nào
      });

      this.workers.push(worker);
      (this.scheduler as any).addWorker(worker);
    }

    this.isInitialized = true;
  }

  public async processPages(
    pages: { pageNumber: number; width: number; height: number; dataUrl: string }[],
    options: OcrOptions,
    onProgress: (progress: OcrProgress) => void,
    onComplete: (results: OcrResult[]) => void,
    onError: (error: Error) => void
  ): Promise<void> {
    try {
      // Xử lý language
      const languages = options.language.split('+');
      const numWorkers = Math.min(pages.length, navigator.hardwareConcurrency || 2);

      await this.initialize(languages, numWorkers, options.quality);

      if (this.abortController?.signal.aborted) {
        throw new Error('OCR process was aborted');
      }

      const results: OcrResult[] = [];
      let completedPages = 0;

      // Xử lý từng trang
      for (const page of pages) {
        if (this.abortController?.signal.aborted) {
          throw new Error('OCR process was aborted');
        }

        try {
          // Cập nhật tiến độ
          onProgress({
            page: completedPages + 1,
            totalPages: pages.length,
            percent: (completedPages / pages.length) * 100,
            status: `Đang xử lý trang ${completedPages + 1}/${pages.length}`,
          });

          // Thực hiện OCR - sử dụng as any để bỏ qua TypeScript errors
          const { data } = await (this.scheduler as any).addJob('recognize', page.dataUrl, {
            pageNumber: page.pageNumber,
          });

          // Bổ sung kết quả
          results.push({
            pageNumber: page.pageNumber,
            text: data.text,
          });

          // Cập nhật tiến độ
          completedPages++;
          onProgress({
            page: completedPages,
            totalPages: pages.length,
            percent: (completedPages / pages.length) * 100,
            status: `Đã hoàn thành ${completedPages}/${pages.length} trang`,
          });

          // Giảm tải cho CPU sau mỗi trang
          await delay(100);
        } catch (error) {
          console.error(`Error processing page ${page.pageNumber}:`, error);
          onError(error instanceof Error ? error : new Error(String(error)));
          return;
        }
      }

      // Sắp xếp kết quả theo số trang
      results.sort((a, b) => a.pageNumber - b.pageNumber);

      // Hoàn thành
      onComplete(results);
    } catch (error) {
      console.error('OCR processing error:', error);
      onError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  public terminate(): void {
    // Hủy quá trình đang chạy
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }

    // Giải phóng workers
    this.workers.forEach(worker => {
      // Sử dụng as any để bỏ qua TypeScript errors
      (this.scheduler as any).removeWorker(worker);
      (worker as any).terminate();
    });

    this.workers = [];
    this.scheduler = Tesseract.createScheduler();
    this.isInitialized = false;
  }
}
