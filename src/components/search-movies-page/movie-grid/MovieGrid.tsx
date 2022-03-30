import React from 'react';
import {Genre, Movie} from "../../../common/interfaces/interfaces";
import {ClipLoader} from "react-spinners";
import './movie-grid.css';

export interface MovieGridProps {
  movies: Movie[]
  selectMovie: (movie: Movie) => void
  loading: boolean
  title?: string
}

export function MovieGrid({movies, selectMovie, loading, title} : MovieGridProps) {

  if (loading){
    return (
        <div className={"movie-grid"}>
          <div className={"spinner"}>
            <ClipLoader size={150}/>
          </div>
        </div>
    );
  }

  return (
      <div className={"movie-grid"}>
        {title && <p>{title}</p>}
        {
          movies.map((movie : Movie) => (
              <div className={"movie-grid-item"}
                   key={movie.id}
                   onClick={()=> selectMovie(movie)}>
                <p className={"movie-grid-item-value movie-name"}>
                  <b>
                    {movie.name}
                  </b>
                </p>
                <p className={"movie-grid-item-value movie-item-genres"}>
                  <b>
                    Category:
                  </b>
                  {" " + movie.genres.map((g: Genre) => g.name).join(', ')}
                </p>
                <p className={"movie-grid-item-value movie-score"}>
                  <b>
                    Rating:
                  </b>
                  {" " + movie.score}
                </p>
              </div>
          ))
        }
      </div>
  );

}
