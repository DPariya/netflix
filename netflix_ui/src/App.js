import "./App.css";
import { Rows } from "./components";
import { requests } from "./api";
import Navbar from "./components/Navbar";
import Banner from "./components/Banner";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Banner />

      <Rows title="Top Trending" fetchUrl={requests.fetchTrending} />
      <Rows title="Top Rated" fetchUrl={requests.fetchTopRated} />
      <Rows title="Action Movies" fetchUrl={requests.fetchActionMovies} />
      <Rows title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} />
      <Rows title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} />
      <Rows title="Top Documentaries" fetchUrl={requests.fetchDocumentaries} />
      <Rows title="Sci-Fi Movies" fetchUrl={requests.fetchSciFiMovies} />
      <Rows title="Thriller Movies" fetchUrl={requests.fetchThrillerMovies} />
    </div>
  );
}

export default App;
