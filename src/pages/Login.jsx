import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '../store/authSlice'
import { Navigate, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { Lock, Mail, Loader2, ArrowRight } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await api.post('/auth/login', credentials)
      return data
    },
    onSuccess: (data) => {
      if (data.success && data.data?.accessToken) {
        dispatch(setCredentials({ token: data.data.accessToken }))
        navigate('/', { replace: true })
      }
    },
  })

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090807] px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Warm Ambient Orbs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#E73F1E]/12 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-[#FB6C00]/10 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />

      <div className="glass w-full max-w-md rounded-2xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.7)] relative z-10 border border-[#241d18] animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#E73F1E] via-[#FB6C00] to-[#F9B637] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#E73F1E]/30 rotate-3 hover:rotate-0 transition-transform duration-300">
            <Lock className="w-8 h-8 text-white drop-shadow-md" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-stone-400">
            Sign in to securely manage your portfolio
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="block text-sm font-medium text-stone-300 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-stone-500 group-focus-within:text-[#FB6C00] transition-colors duration-300" />
              </div>
              <input
                id="login-email"
                {...register('email')}
                name="email"
                type="email"
                autoComplete="email"
                className="block w-full pl-11 pr-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all duration-300 shadow-inner"
                placeholder="admin@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-xs font-medium text-[#E73F1E] ml-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-[#E73F1E] rounded-full mr-2"></span>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="login-password" className="block text-sm font-medium text-stone-300 ml-1">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-stone-500 group-focus-within:text-[#FB6C00] transition-colors duration-300" />
              </div>
              <input
                id="login-password"
                {...register('password')}
                name="password"
                type="password"
                autoComplete="current-password"
                className="block w-full pl-11 pr-4 py-3 border border-[#241d18] rounded-xl bg-[#14100d]/80 text-[#fff8f0] placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#FB6C00]/40 focus:border-[#FB6C00]/60 focus:bg-[#1a1511] transition-all duration-300 shadow-inner"
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <p className="mt-2 text-xs font-medium text-[#E73F1E] ml-1 flex items-center">
                <span className="w-1.5 h-1.5 bg-[#E73F1E] rounded-full mr-2"></span>
                {errors.password.message}
              </p>
            )}
          </div>

          {loginMutation.isError && (
            <div className="bg-[#E73F1E]/10 border border-[#E73F1E]/30 rounded-xl p-3.5 flex items-center">
              <div className="w-1.5 h-1.5 bg-[#E73F1E] rounded-full mr-3 shrink-0 animate-pulse"></div>
              <p className="text-sm font-medium text-[#FFDD9C]">
                {loginMutation.error.response?.data?.message || 
                  (loginMutation.error.code === 'ERR_NETWORK' || !loginMutation.error.response 
                    ? 'Cannot connect to backend server. Please make sure the server is running on http://localhost:5000.'
                    : 'Authentication failed. Please check your credentials.')}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="group w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-[0_0_25px_rgba(231,63,30,0.35)] hover:shadow-[0_0_35px_rgba(251,108,0,0.5)] text-sm font-extrabold text-white bg-gradient-to-r from-[#E73F1E] via-[#FB6C00] to-[#F9B637] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#090807] focus:ring-[#FB6C00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden relative"
          >
            <span className="relative flex items-center">
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
