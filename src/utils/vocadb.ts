import axios from 'axios'

export async function searchArtist(name: string) {
  const response = await axios.get('https://vocadb.net/api/artists', {
    params: {
      query: name,
      fields: 'MainPicture',
      preferAccurateMatches: true,
      maxResults: 3,
      sort: 'SongRating',
    },
  })
  return response.data
}

export async function searchSongsByArtist(id: number, page = 1, size = 10) {
  const response = await axios.get('https://vocadb.net/api/songs', {
    params: {
      'artistId[]': id,
      fields: 'MainPicture,PVs',
      preferAccurateMatches: true,
      start: (page - 1) * size,
      maxResults: size,
      sort: 'PublishDate',
      getTotalCount: true,
    },
  })
  return response.data
}

export function selectThumbnailFromPvs(pvs: any[]): string | undefined {
  return pvs.filter((pv: any) => ['Bilibili', 'NicoNicoDouga'].includes(pv.service))[0]?.thumbUrl
}
