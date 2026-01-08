const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

const request = {
  fetchTrending: `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  fetchNetflixOriginals: `discover/tv?api_key=${API_KEY}&with_networks=213&language=en-US`,
  fetchTopRated: `movie/top_rated?api_key=${API_KEY}&language=en-US`,
  fetchActionMovies: `movie/top_rated?api_key=${API_KEY}&with_genres=28`,
  fetchComedyMovies: `movie/top_rated?api_key=${API_KEY}&with_genres=35`,
  fetchHorrorMovies: `movie/top_rated?api_key=${API_KEY}&with_genres=27`,
  fetchRomanceMovies: `movie/top_rated?api_key=${API_KEY}&with_genres=10479`,
  fetchDocumentaries: `movie/top_rated?api_key=${API_KEY}&with_genres=99`,
};
export default request;
