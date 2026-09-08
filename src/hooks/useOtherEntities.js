import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/axios'

// --- Nav Links Hooks ---
export function useNavLinks() {
  return useQuery({
    queryKey: ['navLinks'],
    queryFn: async () => {
      const { data } = await api.get('/navigation-links')
      return data.data || []
    },
  })
}

export function useCreateNavLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkData) => {
      const { data } = await api.post('/navigation-links', linkData)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['navLinks'] }),
  })
}

export function useUpdateNavLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...linkData }) => {
      const { data } = await api.patch(`/navigation-links/${id}`, linkData)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['navLinks'] }),
  })
}

export function useDeleteNavLink() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/navigation-links/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['navLinks'] }),
  })
}

// --- Messages Hooks ---
export function useDeleteMessage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/messages/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  })
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.patch(`/messages/${id}/read`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['messages'] }),
  })
}

// --- Experiences Hooks ---
export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data } = await api.get('/experiences')
      return data.data || []
    },
  })
}
export function useCreateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/experiences', payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
  })
}
export function useUpdateExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.patch(`/experiences/${id}`, payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
  })
}
export function useDeleteExperience() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/experiences/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experiences'] }),
  })
}

// --- Skills Hooks ---
export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data } = await api.get('/skills')
      return data.data || []
    },
  })
}
export function useCreateSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post('/skills', payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  })
}
export function useUpdateSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const { data } = await api.patch(`/skills/${id}`, payload)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  })
}
export function useDeleteSkill() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/skills/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] }),
  })
}

// --- Projects CRUD (Images Upload via FormData) ---
export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/projects', formData)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, formData }) => {
      const { data } = await api.patch(`/projects/${id}`, formData)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/projects/${id}`)
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  })
}

// --- App Alert Hooks ---
export function useAlert() {
  return useQuery({
    queryKey: ['alert'],
    queryFn: async () => {
      const { data } = await api.get('/alert')
      return data.data
    },
  })
}

export function useUpdateAlert() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (alertData) => {
      const { data } = await api.patch('/alert', alertData)
      return data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alert'] }),
  })
}

// --- App Theme Hooks ---
export function useTheme() {
  return useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      const { data } = await api.get('/theme')
      return data.data
    },
  })
}

export function useUpdateTheme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (themeData) => {
      const { data } = await api.patch('/theme', themeData)
      return data.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['theme'] }),
  })
}

