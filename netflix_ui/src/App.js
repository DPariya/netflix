import "./App.css";
import Navbar from "./components/Navbar.js";
import Banner from "./components/Banner.js";
import Rows from "./components/Rows.js";
import request from "./request.js";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Banner />

      <Rows title={"Top Trending"} fetchUrl={request.fetchTrending} />
      <Rows title={"Top Rated"} fetchUrl={request.fetchTopRated} />
      <Rows title={"Action Movies"} fetchUrl={request.fetchActionMovies} />
      <Rows title={"Comedy Movies"} fetchUrl={request.fetchComedyMovies} />
      <Rows title={"Horror Movies"} fetchUrl={request.fetchHorrorMovies} />
      <Rows title={"Top Documentaries"} fetchUrl={request.fetchDocumentaries} />
    </div>
  );
}

export default App;
