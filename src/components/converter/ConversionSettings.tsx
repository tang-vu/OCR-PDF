import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { OcrOptions } from '../../types/ocr.types';

interface ConversionSettingsProps {
  options: OcrOptions;
  onOptionChange: (options: Partial<OcrOptions>) => void;
  onStartConversion: () => void;
  disabled: boolean;
}

export default function ConversionSettings({
  options,
  onOptionChange,
  onStartConversion,
  disabled,
}: ConversionSettingsProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Cài đặt chuyển đổi</h2>

      <div className="space-y-6">
        {/* Ngôn ngữ OCR */}
        <div>
          <Label htmlFor="language" className="block mb-2">
            Ngôn ngữ văn bản
          </Label>
          <Select
            value={options.language}
            onValueChange={value => onOptionChange({ language: value })}
            disabled={disabled}
          >
            <SelectTrigger id="language" className="w-full">
              <SelectValue placeholder="Chọn ngôn ngữ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="vie">Tiếng Việt</SelectItem>
              <SelectItem value="eng">Tiếng Anh</SelectItem>
              <SelectItem value="vie+eng">Tiếng Việt + Tiếng Anh</SelectItem>
              <SelectItem value="fra">Tiếng Pháp</SelectItem>
              <SelectItem value="deu">Tiếng Đức</SelectItem>
              <SelectItem value="jpn">Tiếng Nhật</SelectItem>
              <SelectItem value="kor">Tiếng Hàn</SelectItem>
              <SelectItem value="tha">Tiếng Thái</SelectItem>
              <SelectItem value="ind">Tiếng Indonesia</SelectItem>
              <SelectItem value="rus">Tiếng Nga</SelectItem>
              <SelectItem value="spa">Tiếng Tây Ban Nha</SelectItem>
              <SelectItem value="chi_sim">Tiếng Trung (Giản thể)</SelectItem>
              <SelectItem value="chi_tra">Tiếng Trung (Phồn thể)</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Chọn ngôn ngữ chính có trong tài liệu để tăng độ chính xác OCR
          </p>
        </div>

        {/* Chất lượng OCR */}
        <div>
          <Label className="block mb-2">Chất lượng OCR</Label>
          <RadioGroup
            value={options.quality}
            onValueChange={value => onOptionChange({ quality: value as 'medium' | 'high' })}
            className="flex flex-col space-y-2"
            disabled={disabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="quality-medium" />
              <Label htmlFor="quality-medium" className="cursor-pointer">
                Trung bình (xử lý nhanh hơn)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="high" id="quality-high" />
              <Label htmlFor="quality-high" className="cursor-pointer">
                Cao (xử lý chậm hơn, chính xác hơn)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Nút bắt đầu chuyển đổi */}
        <div className="pt-2">
          <Button onClick={onStartConversion} disabled={disabled} className="w-full">
            Bắt đầu chuyển đổi
          </Button>
        </div>
      </div>
    </div>
  );
}
