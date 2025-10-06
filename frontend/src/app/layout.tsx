import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Detector de Duplicados Semánticos',
  description: 'Sistema de detección de productos duplicados usando IA',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-white">
          <header className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold text-gray-900">
                      <span className="text-primary-600">🔍</span> Detector de Duplicados
                    </h1>
                  </div>
                </div>
                <nav className="flex space-x-4">
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Historial
                  </a>
                  <a
                    href="#"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Configuración
                  </a>
                </nav>
              </div>
            </div>
          </header>
          <main>{children}</main>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#fff',
              border: '1px solid #e5e7eb',
            },
          }}
        />
      </body>
    </html>
  )
}