import axios from 'axios'

const api = axios.create({
  baseURL: 'https://api.voca.wiki',
  headers: {
    'Content-Type': 'application/json',
  },
})

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
