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

export async function searchSongsByArtist(id: number, page = 1, size = 10, config: any = {}) {
  const response = await axios.get('https://vocadb.net/api/songs', {
    params: {
      'artistId[]': id,
      fields: 'MainPicture,PVs',
      preferAccurateMatches: true,
      start: (page - 1) * size,
      maxResults: size,
      sort: 'PublishDate',
      getTotalCount: true,
      onlyWithPvs: true,
      songTypes: config.songTypes.join(','),
    },
  })
  return response.data
}

/**
 *  选出一个最合适的缩略图
 *  */
export function selectThumbnailFromPvs(pvs: any[]): string | undefined {
  const servicesOrder = ['Bilibili', 'NicoNicoDouga', 'Youtube', 'SoundCloud']
  const bestPv = pvs.sort(
    (a, b) => servicesOrder.indexOf(a.service) - servicesOrder.indexOf(b.service),
  )
  return bestPv[0]?.thumbUrl
}

/**
 * 筛选出有效的PV
 */
export function validatePv(pv: any) {
  return pv.author.slice(-5) != 'Topic' && pv.pvType === 'Original'
}
