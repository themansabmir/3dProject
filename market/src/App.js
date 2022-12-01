import {BrowserRouter as Router} from 'react-router-dom'
import './App.css';
import {DataProvider} from './GlobalState'
import Header from './components/Headers/Header'
import MainPage from './components/mainpages/Pages'


function App() {
 
  return (
    
    <DataProvider>
      <Router>
       
        <Header/>
        
        <MainPage/>

      </Router>
    </DataProvider>
    
  );
}

export default App;
