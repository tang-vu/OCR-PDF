import { extractPdfPages, ExtractOptions } from './pdfReader';
import { createSearchablePdf, createTextOnlyPdf } from './pdfCreator';
import { OcrService } from '../ocr/ocrService';
import { OcrOptions, OcrProgress } from '../../types/ocr.types';
import { ConversionProgress, PageOcrResult } from '../../types/pdf.types';

export class PdfOcrService {
  private ocrService: OcrService;

  constructor() {
    this.ocrService = new OcrService();
  }

  public async convertPdfToSearchable(
    file: File,
    options: OcrOptions,
    onProgress: (progress: ConversionProgress) => void
  ): Promise<{ searchablePdf: Blob; textOnlyPdf: Blob }> {
    try {
      return new Promise<{ searchablePdf: Blob; textOnlyPdf: Blob }>(async (resolve, reject) => {
        try {
          // Giai đoạn 1: Trích xuất các trang từ PDF với preprocessing
          onProgress({ stage: 'extracting', percent: 0 });

          // Cấu hình extract options dựa trên quality
          const extractOptions: ExtractOptions = {
            quality: options.quality,
            enablePreprocessing: true, // Bật image preprocessing để cải thiện OCR
          };

          const pdfPages = await extractPdfPages(
            file,
            (current: number, total: number) => {
              onProgress({
                stage: 'extracting',
                percent: (current / total) * 100,
                page: current,
                totalPages: total,
                status: `Đang trích xuất trang ${current}/${total}`,
              });
            },
            extractOptions
          );
          onProgress({ stage: 'extracting', percent: 100 });

          // Giai đoạn 2: Thực hiện OCR trên từng trang
          onProgress({ stage: 'ocr', percent: 0 });

          this.ocrService.processPages(
            pdfPages,
            options,
            // Callback khi xử lý tiến trình
            (progress: OcrProgress) => {
              onProgress({
                stage: 'ocr',
                percent: progress.percent,
                page: progress.page,
                totalPages: progress.totalPages,
                status: progress.status,
              });
            },
            // Callback khi OCR hoàn tất
            async (results: PageOcrResult[]) => {
              try {
                // Giai đoạn 3: Tạo PDF có thể tìm kiếm
                onProgress({ stage: 'creating', percent: 0 });
                const searchablePdfBytes = await createSearchablePdf(file, results);
                onProgress({
                  stage: 'creating',
                  percent: 50,
                  status: 'Đang tạo PDF có thể tìm kiếm',
                });

                // Tạo PDF chỉ chứa text
                onProgress({
                  stage: 'creating',
                  percent: 51,
                  status: 'Đang tạo PDF chỉ chứa text',
                });
                const textOnlyPdfBytes = await createTextOnlyPdf(file, results);
                onProgress({ stage: 'creating', percent: 100 });

                // Giai đoạn 4: Hoàn tất
                onProgress({ stage: 'complete', percent: 100 });

                // Tạo Blob từ cả hai loại PDF bytes
                const searchablePdfBlob = new Blob([searchablePdfBytes], {
                  type: 'application/pdf',
                });
                const textOnlyPdfBlob = new Blob([textOnlyPdfBytes], { type: 'application/pdf' });

                resolve({
                  searchablePdf: searchablePdfBlob,
                  textOnlyPdf: textOnlyPdfBlob,
                });
              } catch (error) {
                reject(error);
              }
            },
            // Callback khi có lỗi
            (error: Error) => {
              reject(error);
            }
          );
        } catch (error) {
          reject(error);
        }
      });
    } catch (error) {
      throw error;
    }
  }

  public terminate() {
    this.ocrService.terminate();
  }
}
