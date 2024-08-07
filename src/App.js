import React from 'react';
import ChatComponent from './ChatComponent';
import Bubbles from './Bubbles'
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Bubbles/>
        <ChatComponent />
      </header>
    </div>
  );
}

export default App;
