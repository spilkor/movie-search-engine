import React, {useState} from 'react';
import {gql, useQuery} from '@apollo/client';
import {Movie} from "../../common/interfaces/interfaces";
import {SearchField} from "./search-field/SearchField";
import {MovieGrid} from "./movie-grid/MovieGrid";
import {MovieDetail} from "./movie-detail/MovieDetail";
import './search-movies-page.css';

const SEARCH_MOVIES = gql`
    query SearchMovies($query: String!) {
        searchMovies(query: $query){
            id
            name
            score
            genres {
                name
            }
        }
    }
`;

const GET_MOVIE = gql`
    query getMovie($id: ID!) {
        movie(id: $id){
            similar {
                id
                name
                score
                genres {
                    name
                }
            }
        }
    }
`;

enum DisplayMode {
  SEARCH_RESULT,
  SIMILAR
}

export function SearchMoviesPage() {

  const [ displayMode, setDisplayMode ] = useState<DisplayMode>(DisplayMode.SEARCH_RESULT);
  const [ selectedMovie, setSelectedMovie ] = useState<Movie>();
  const [ query, setQuery ] = useState<string>("");
  const [ movieForSimilar, setMovieForSimilar ] = useState<Movie>();
  const { loading: searchLoading, data: searchData } = useQuery(SEARCH_MOVIES,  { skip: !query, variables: { query }});
  const { loading: movieLoading, data: movieData } = useQuery(GET_MOVIE, { skip: !movieForSimilar, variables: {id: movieForSimilar?.id }});

  function search(query: string) {
    setDisplayMode(DisplayMode.SEARCH_RESULT);
    setSelectedMovie(undefined);
    setQuery(query);
  }

  function selectMovie(movie: Movie) {
    setSelectedMovie(movie);
  }

  function showSimilarMovies(movie: Movie) {
    setDisplayMode(DisplayMode.SIMILAR);
    setMovieForSimilar(movie);
  }

  return (
      <div className={"search-movies-page"}>
        <div className={"search-movies-page-content"}>
          <div>
            <SearchField search={search}/>
            <MovieGrid
                movies={displayMode === DisplayMode.SEARCH_RESULT ?
                    searchData && searchData.searchMovies || [] :
                    movieData && movieData.movie && movieData.movie.similar || []
                }
                selectMovie={selectMovie}
                loading={searchLoading || movieLoading}
                title = {displayMode === DisplayMode.SEARCH_RESULT ?
                    query && "Search result for: \"" + query + "\"" :
                    movieForSimilar && "Similar movies to: " + movieForSimilar.name
                }
            />
          </div>
          {selectedMovie &&
          <MovieDetail
              movie = {selectedMovie}
              showSimilarMovies = {showSimilarMovies}
          />}
        </div>
      </div>
  );

}
