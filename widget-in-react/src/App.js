import logo from './logo.svg';
import './App.css';
import Widget from './Widget';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <Widget />
    </div>
  );
}

export default App;
