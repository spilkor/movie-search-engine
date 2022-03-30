import React, {useEffect, useState} from 'react';
import {Movie} from "../../../common/interfaces/interfaces";
import API from "../../../common/api/API";
import {ClipLoader} from "react-spinners";
import './movie-detail.css';

export interface MovieDetailProps {
  movie: Movie
  showSimilarMovies: (movie: Movie) => void
}

export function MovieDetail({movie, showSimilarMovies} : MovieDetailProps) {

  const [loading, setLoading] = useState<boolean>(true);
  const [wikipediaLink, setWikipediaLink] = useState<string | null>(null);
  const [imdbLink, setImdbLink] = useState<string | null>(null);
  const [paragraphs, setParagraphs] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setWikipediaLink(null);
    setImdbLink(null);
    setParagraphs([]);
  }, [movie.id]);

  useEffect(() => {
    fetchData();
  }, [movie.id]);

  async function fetchData() {
    const wikipediaPageId = await API.getWikipediaPageId(movie.name);
    // console.log("wikipediaPageId", wikipediaPageId);

    if (wikipediaPageId){
      const wikipediaLink = await API.getWikipediaLink(wikipediaPageId);
      // console.log("wikipediaLink", wikipediaLink);
      wikipediaLink && setWikipediaLink(wikipediaLink);

      const firstWikipediaParagraph = await API.getWikipediaFirstParagraph(wikipediaPageId);
      // console.log("firstWikipediaParagraph", firstWikipediaParagraph);
      setParagraphs([firstWikipediaParagraph]);
    }

    const imdbLink = await API.getImdbLink(movie.name);
    // console.log("imdbLink", imdbLink);
    imdbLink && setImdbLink(imdbLink);

    setLoading(false);
  }

  if (loading){
    return (
        <div className={"movie-detail"}>
          <div className={"spinner"}>
            <ClipLoader size={150}/>
          </div>
        </div>
    );
  }

  return (
      <div className={"movie-detail"}>
        <div className={"display-flex"}>
          <h2>
            {movie.name}
          </h2>
          <div className={"movie-detail-links"}>
            {imdbLink &&
            <a className={"imdb-logo"} href={imdbLink} target={"_blank"}>
              IMDb
            </a>}
            {wikipediaLink &&
            <a href={wikipediaLink} className={"wikipedia-logo"} target={"_blank"}>
              <img src="https://pngimg.com/uploads/wikipedia/wikipedia_PNG25.png" alt="wiki" width="30" height="30" />
            </a>}
          </div>
        </div>
        {paragraphs && <p className={"first-paragraph"}>{paragraphs.length > 0 ? paragraphs[0] : 'No Wikipedia page found :('}</p>}
        <div className={"show-similar-button app-button"}
             onClick={()=> showSimilarMovies(movie)}>
          Show similar
        </div>
      </div>
  );

}

