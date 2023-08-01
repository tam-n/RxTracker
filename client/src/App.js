import './App.css';
import { Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import SearchPage from './Pages/SearchPage';

function App() {
  return (
    <Routes>
      <Route>
        <NavBar />
        <SearchPage />
      </Route>
    </Routes>
  );
}
export default App;
