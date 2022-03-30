export interface Genre {
    id: string
    name: string
}

export interface Movie {
    id: string
    name: string
    score: number
    genres: Genre[]
}