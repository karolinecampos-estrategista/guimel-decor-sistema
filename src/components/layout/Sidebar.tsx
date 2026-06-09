import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, FileText, Package, Wrench,
  DollarSign, BarChart2, Settings, LogOut, Warehouse, ChevronRight
} from 'lucide-react'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
  perfis: ('gestor' | 'comercial' | 'producao')[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} />, perfis: ['gestor'] },
  { label: 'CRM / Leads', path: '/crm', icon: <Users size={18} />, perfis: ['gestor', 'comercial'] },
  { label: 'Orçamentos', path: '/orcamentos', icon: <FileText size={18} />, perfis: ['gestor', 'comercial'] },
  { label: 'Pedidos', path: '/pedidos', icon: <Package size={18} />, perfis: ['gestor', 'comercial'] },
  { label: 'Produção', path: '/producao', icon: <Wrench size={18} />, perfis: ['gestor', 'comercial', 'producao'] },
  { label: 'Estoque', path: '/estoque', icon: <Warehouse size={18} />, perfis: ['gestor', 'comercial', 'producao'] },
  { label: 'Instalações', path: '/instalacoes', icon: <Wrench size={18} />, perfis: ['gestor', 'comercial', 'producao'] },
  { label: 'Financeiro', path: '/financeiro', icon: <DollarSign size={18} />, perfis: ['gestor'] },
  { label: 'Anúncios', path: '/anuncios', icon: <BarChart2 size={18} />, perfis: ['gestor'] },
  { label: 'Configurações', path: '/configuracoes', icon: <Settings size={18} />, perfis: ['gestor'] },
]

const perfilLabel: Record<string, string> = {
  gestor: 'Gestor',
  comercial: 'Comercial',
  producao: 'Produção',
}

export function Sidebar() {
  const { usuario, logout } = useAuthStore()

  if (!usuario) return null

  const itensFiltrados = navItems.filter(item => item.perfis.includes(usuario.perfil))

  return (
    <aside className="w-60 min-h-screen bg-[#2D2D2D] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-3 border-b border-white/10">
        <img
          src="/images/logo-claro.jpeg"
          alt="Guimel Decor"
          className="h-14 w-auto max-w-full object-contain mix-blend-screen"
        />
      </div>

      {/* Usuário */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#E87820] flex items-center justify-center text-white font-bold text-xs shrink-0">
            {usuario.nome.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{usuario.nome.split(' ')[0]}</p>
            <p className="text-white/40 text-xs">{perfilLabel[usuario.perfil] ?? usuario.perfil}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {itensFiltrados.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group',
                isActive
                  ? 'bg-[#E87820] text-white font-semibold shadow-sm'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-white/50 group-hover:text-white/90 transition-colors'}>
                  {item.icon}
                </span>
                <span className="flex-1 leading-none">{item.label}</span>
                {isActive && <ChevronRight size={13} className="shrink-0" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-3 py-3 border-t border-white/10 shrink-0">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/8 hover:text-white text-sm w-full transition-all"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
