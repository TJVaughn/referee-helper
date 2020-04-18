import React from 'react';
import '../styles/App.scss';
import '../styles/AllGames.scss'
import '../styles/CreateGame.scss'
import '../styles/SingleGame.scss'
import '../styles/Stripe.scss'
import '../styles/Navbar.scss'
import '../styles/Schedule.scss'
import '../styles/CreateBlocks.scss'
import AppRouter from '../main/AppRouter'

function App() {
  return (
    <div className="App">
      <AppRouter />
    </div>
  );
}

export default App;
