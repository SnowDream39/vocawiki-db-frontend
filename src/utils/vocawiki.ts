import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

if (import.meta.env.VITE_APP_ENV === 'development') {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
}

export async function getProducerEntry(id: number): Promise<string> {
  const response = await api.get('/entry/producer', {
    params: {
      ids: [id],
    },
  })
  return response.data[0].id
}

export async function getProducerId(entry: string): Promise<number> {
  const response = await api.get('/entry/producer/id', {
    params: {
      entry,
    },
  })
  return response.data
}

export async function upsertProducers(data: any) {
  const response = await api.post('/entry/producer/upsert', data)
  return response.data
}

export async function checkPSong(producer_id: number, song_id: number) {
  const response = await api.get('/entry/producer/song/check', {
    params: { producer_id, song_id },
  })
  return response.data
}

export async function addPSong(data: { producer_id: number; song_id: number }) {
  const response = await api.post('/entry/producer/song', data)
  return response.data
}

export async function deletePSong(data: { producer_id: number; song_id: number }) {
  const response = await api.delete('/entry/producer/song', {
    data,
  })
  return response.data
}
