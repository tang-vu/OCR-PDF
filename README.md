# PDF OCR - Image-based PDF to Searchable PDF Converter

PDF OCR is a free web application that helps convert image-based or scanned PDF documents into searchable and copyable PDF format. The application uses OCR (Optical Character Recognition) technology to recognize text in images and create a digital text layer on top of the original images.

![PDF OCR Demo](public/images/demo.png)

## 🌟 Key Features

- ✅ Convert image-based PDFs to searchable PDFs
- ✅ Support for multiple languages, including Vietnamese (with accents)
- ✅ Completely client-side processing - no need to upload files to a server
- ✅ Privacy and security - your data never leaves your browser
- ✅ Create text-only PDFs for easy copying and editing
- ✅ User-friendly interface
- ✅ Completely free, no page or file limits
- ✅ Progressive Web App (PWA) - can be installed and used offline

## 🚀 Technologies Used

- **Frontend:** React, TypeScript, Tailwind CSS
- **OCR Engine:** Tesseract.js
- **PDF Processing:** PDF.js, PDF-lib
- **Build Tool:** Vite
- **Deployment:** Cloudflare Pages

## 🔧 Installation and Running the App

### System Requirements
- Node.js >= 20
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tang-vu/OCR-PDF.git
cd OCR-PDF
```

2. Install dependencies:
```bash
npm install
```

3. Run the application in development mode:
```bash
npm run dev
```

4. Build the application for production:
```bash
npm run build
```

5. Preview the build version:
```bash
npm run preview
```

## 🔍 How to Use

1. Open the website at https://ocr-pdf.pages.dev or run the application on your personal computer
2. Upload your image-based PDF file
3. Select the text recognition language (default is Vietnamese)
4. Click the "Start Conversion" button
5. Wait for the recognition process to complete
6. Download the searchable PDF or text-only PDF file

## 🌐 Online Access

The application is deployed at: https://ocr-pdf.pages.dev

## 🤝 Contributing

All contributions are welcome! If you'd like to contribute to the project, please follow the guidelines in the `CONTRIBUTING.md` file.

## 📝 License

This project is distributed under the MIT License. See the `LICENSE` file for more information.

## 🙏 Acknowledgments

- [Tesseract.js](https://github.com/naptha/tesseract.js) - OCR engine for JavaScript
- [PDF.js](https://github.com/mozilla/pdf.js) - Mozilla's PDF reader library
- [PDF-lib](https://github.com/Hopding/pdf-lib) - PDF creation and editing library
- [React](https://reactjs.org/) - JavaScript UI library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Modern frontend build tool 