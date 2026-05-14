const FOOTBALL_API_URL = 'https://api.football-data.org/v4'

const ligasMap = {
  LaLiga: 'PD',
  Premier: 'PL',
  Bundesliga: 'BL1',
  SerieA: 'SA',
  Ligue1: 'FL1',
  Champions: 'CL'
}

const obtenerPartidosPorJornada = async (liga, jornada) => {
  const codigoLiga = ligasMap[liga]
  if (!codigoLiga) {
    throw new Error('Liga no válida')
  }

  const res = await fetch(
    `${FOOTBALL_API_URL}/competitions/${codigoLiga}/matches?matchday=${jornada}`,
    {
      headers: {
        'X-Auth-Token': process.env.FOOTBALL_API_KEY
      }
    }
  )

  if (!res.ok) {
    throw new Error('Error al consultar la API de fútbol')
  }

  const data = await res.json()

  const partidos = data.matches.map(partido => ({
    partidoId: String(partido.id),
    jornada: partido.matchday,
    fecha: partido.utcDate,
    estado: partido.status,
    equipoLocal: partido.homeTeam.name,
    escudoLocal: partido.homeTeam.crest,
    equipoVisitante: partido.awayTeam.name,
    escudoVisitante: partido.awayTeam.crest,
    golesLocal: partido.score.fullTime.home,
    golesVisitante: partido.score.fullTime.away
  }))

  return partidos
}

module.exports = { obtenerPartidosPorJornada }