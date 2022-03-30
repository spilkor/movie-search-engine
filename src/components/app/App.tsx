import React from 'react';
import './app.css';
import {ApolloProvider} from "@apollo/client";
import client from "../../common/apollo-client";
import {SearchMoviesPage} from "../search-movies-page/SearchMoviePage";

function App() {
  return (
      <div className={"app"}>
        <ApolloProvider client={client}>
          <SearchMoviesPage/>
        </ApolloProvider>
      </div>
  );
}

export default App;
