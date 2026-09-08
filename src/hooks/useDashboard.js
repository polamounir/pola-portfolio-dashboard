import { useQuery } from '@tanstack/react-query'
import api from '../api/axios'

export function useVisitors() {
  return useQuery({
    queryKey: ['visitors'],
    queryFn: async () => {
      const { data } = await api.get('/visitors')
      return data.data || []
    },
  })
}

export function useMessages() {
  return useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data } = await api.get('/messages')
      return data.data || []
    },
  })
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data } = await api.get('/projects')
      return data.data || []
    },
  })
}
