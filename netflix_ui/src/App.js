import "./App.css";
import Navbar from "./components/Navbar.js";
import Banner from "./components/Banner.js";
import Rows from "./components/Rows.js";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Banner />
      <Rows />
      <Rows />
      <Rows />
      <Rows />
    </div>
  );
}

export default App;
