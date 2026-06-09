import { create } from 'zustand'
import type { Usuario, Perfil } from '@/types'
import { mockUsuarios } from '@/lib/mockData'

interface AuthState {
  usuario: Usuario | null
  login: (email: string, _senha: string) => boolean
  logout: () => void
  temAcesso: (perfis: Perfil[]) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  usuario: null,

  login: (email: string, _senha: string) => {
    const usuario = mockUsuarios.find(u => u.email === email)
    if (usuario) {
      set({ usuario })
      return true
    }
    return false
  },

  logout: () => set({ usuario: null }),

  temAcesso: (perfis: Perfil[]) => {
    const { usuario } = get()
    if (!usuario) return false
    return perfis.includes(usuario.perfil)
  },
}))
