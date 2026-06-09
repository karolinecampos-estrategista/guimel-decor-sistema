import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Users, FileText, Package, Wrench,
  DollarSign, BarChart2, Settings, LogOut, Warehouse, ChevronRight, X
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

interface Props {
  aberta: boolean
  onFechar: () => void
}

export function Sidebar({ aberta, onFechar }: Props) {
  const { usuario, logout } = useAuthStore()
  const navigate = useNavigate()

  if (!usuario) return null

  const itensFiltrados = navItems.filter(item => item.perfis.includes(usuario.perfil))

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={cn(
        'bg-[#2D2D2D] flex flex-col shrink-0',
        // Desktop: always visible, fixed width
        'md:relative md:translate-x-0 md:w-60 md:min-h-screen',
        // Mobile: drawer that slides in/out
        'fixed inset-y-0 left-0 z-50 w-72 transition-transform duration-300 ease-in-out',
        aberta ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      )}
    >
      {/* Logo + fechar mobile */}
      <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between gap-3">
        <img
          src="/images/logo-claro.jpeg"
          alt="Guimel Decor"
          className="h-14 w-auto max-w-[180px] object-contain mix-blend-screen"
        />
        <button
          onClick={onFechar}
          className="md:hidden p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
        >
          <X size={20} />
        </button>
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
            onClick={onFechar}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group',
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
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/50 hover:bg-white/8 hover:text-white text-sm w-full transition-all"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}
