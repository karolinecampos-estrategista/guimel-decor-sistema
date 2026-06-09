import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Sidebar } from './Sidebar'
import { Bell } from 'lucide-react'

export function Layout() {
  const { usuario } = useAuthStore()

  if (!usuario) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F6F2]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
          <div />
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#2D2D2D] flex items-center justify-center text-white font-bold text-xs">
              {usuario.nome.charAt(0)}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
