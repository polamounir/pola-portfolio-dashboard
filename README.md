<div align="center">

# Pola Mounir — Portfolio Admin Dashboard

A comprehensive, responsive administrative control panel built with **React**, **Redux Toolkit**, **Vite**, and **Tailwind CSS** for managing portfolio content, projects, skills, visitor analytics, and messages in real time.

[![React Version](https://img.shields.io/badge/React-19.0.0-61DAFB.svg?style=flat-square&logo=react)](https://react.dev/)
[![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.5.1-764ABC.svg?style=flat-square&logo=redux)](https://redux-toolkit.js.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[**Live Application**](https://pola-mounir.vercel.app/) • [**GitHub Repository**](https://github.com/polamounir/pola-portfolio-dashboard)

</div>

---

## Features

- **Content Management System**: Complete CRUD operations for portfolio projects, skills, work experience, and navigation links.
- **Image & PDF Media Management**: Crop, resize, and preview project images and resume PDFs directly within modal interfaces before uploading to Cloudinary.
- **Message Inbox**: View, filter, mark as read, and delete contact form inquiries submitted through the portfolio website.
- **Theme & Alert Controls**: Dynamic theme customization and maintenance alert broadcasting to the portfolio frontend.
- **Real-Time Visitor Analytics**: Comprehensive analytics dashboard tracking visitor counts, device types, and page traffic.
- **Secure Authentication**: JWT-based authentication with auto-refresh tokens and protected route guards.

---

## Technology Stack

| Category | Technology |
|---|---|
| **Frontend Library** | React 19 |
| **State Management** | Redux Toolkit |
| **Routing** | React Router DOM v7 |
| **HTTP Client** | Axios (with request/response interceptors) |
| **Styling & UI** | Tailwind CSS, Lucide Icons |
| **Build Tool** | Vite 7 |

---

## Project Structure

```text
admin-dashboard/
├── public/
│   ├── favicon.svg          # Application favicon
│   └── icons.svg            # SVG sprite resources
├── src/
│   ├── api/                 # Axios instance & base API config
│   ├── assets/              # Static media resources
│   ├── components/          # Layout, ImageEditorModal, PdfPreviewModal
│   ├── context/             # SidebarContext state provider
│   ├── hooks/               # Custom hooks for profile, dashboard & entities
│   ├── pages/               # Dashboard, Projects, Skills, Experiences, Messages, Settings
│   ├── store/               # Redux store & authSlice
│   ├── App.jsx              # Main App Component & Router config
│   ├── main.jsx             # React DOM Entry
│   └── index.css            # Tailwind CSS imports
├── eslint.config.js         # ESLint configuration
├── vite.config.js           # Vite build settings
└── package.json             # App dependencies
```

---

## Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### Local Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/polamounir/pola-portfolio-dashboard.git
   cd pola-portfolio-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## Contact & Developer Info

- **Developer**: Pola Mounir
- **Email**: [polamounir103@gmail.com](mailto:polamounir103@gmail.com)
- **LinkedIn**: [linkedin.com/in/pola-mounir-samir](https://www.linkedin.com/in/pola-mounir-samir/)
- **GitHub**: [github.com/polamounir](https://github.com/polamounir)

---

## License

This project is open-source under the [MIT License](LICENSE).
