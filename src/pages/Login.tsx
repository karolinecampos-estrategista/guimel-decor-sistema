import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

export function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = login(email, senha)
    if (ok) {
      navigate('/dashboard')
    } else {
      setErro('E-mail não encontrado. Use um dos e-mails de demo abaixo.')
    }
  }

  const demos = [
    { label: 'Karoline — Gestora', email: 'karoline@guimel.com.br', cor: 'bg-[#E87820]' },
    { label: 'Tiago — Gestor', email: 'tiago@guimel.com.br', cor: 'bg-[#2D2D2D]' },
    { label: 'Fernanda — Comercial', email: 'fernanda@guimel.com.br', cor: 'bg-blue-600' },
    { label: 'Roberto — Produção', email: 'roberto@guimel.com.br', cor: 'bg-stone-500' },
  ]

  return (
    <div className="min-h-screen bg-[#2D2D2D] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <img
              src="/images/logo-claro.jpeg"
              alt="Guimel Decor"
              className="h-24 sm:h-28 w-auto max-w-[280px] object-contain mix-blend-screen"
            />
          </div>
          <p className="text-white/50 text-sm tracking-wide">Sistema de Gestão</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl">
          <h2 className="text-gray-800 text-lg font-semibold mb-5">Entrar no sistema</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErro('') }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={e => setSenha(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2D2D] focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {erro && (
              <p className="text-red-600 text-xs bg-red-50 px-3 py-2 rounded-lg">{erro}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#E87820] hover:bg-[#C96A10] text-white font-semibold py-2.5 rounded-lg transition-colors"
            >
              Entrar
            </button>
          </form>

          {/* Demo logins */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-3">Acessos de demonstração (clique para preencher):</p>
            <div className="space-y-2">
              {demos.map(d => (
                <button
                  key={d.email}
                  onClick={() => { setEmail(d.email); setSenha('demo'); setErro('') }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-white text-sm transition-opacity hover:opacity-90 ${d.cor}`}
                >
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    {d.label.charAt(0)}
                  </span>
                  <span>{d.label}</span>
                  <span className="ml-auto text-white/70 text-xs">{d.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
