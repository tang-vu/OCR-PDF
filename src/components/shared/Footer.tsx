import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">PDF OCR</h3>
            <p className="text-gray-600 text-sm">
              Công cụ miễn phí chuyển đổi PDF dạng ảnh sang PDF có thể tìm kiếm. Ứng dụng hoạt động
              hoàn toàn trên trình duyệt web, không cần tải lên máy chủ.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-500 text-sm">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-gray-600 hover:text-blue-500 text-sm">
                  Chuyển đổi
                </Link>
              </li>
              <li>
                <Link to="/huong-dan" className="text-gray-600 hover:text-blue-500 text-sm">
                  Hướng dẫn
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 hover:text-blue-500 text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Pháp lý</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-blue-500 text-sm">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-blue-500 text-sm">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Theo dõi</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/tang-vu/OCR-PDF"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-blue-500"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} PDF OCR. Bản quyền thuộc về chúng tôi.
          </p>
          <p className="text-sm text-gray-500 mt-2 md:mt-0">
            Được phát triển bởi{' '}
            <a href="#" className="text-blue-500 hover:underline">
              tang-vu
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
