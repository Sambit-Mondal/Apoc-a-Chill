import { useState } from 'react';
import RealTimeComm from '../components/RealTimeComm';
import Navbar from '../components/Navbar';
import ResourceTrading from '../components/ResourceTrading';
import SurvivalGuide from '../components/SurvivalGuide';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextFile';
import SurvivalScanner from '../components/SurvivalScanner';
import EdibilityChecker from '../components/EdibilityChecker';

const Home = () => {
  const [activeView, setActiveView] = useState('real-time-comm');
  const { user } = useContext(AuthContext);

  // Show a loading screen if `user` is null (context is initializing)
  if (!user) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <h1 className="text-white text-lg">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-mlsa-bg flex items-center justify-between px-5">
      <Navbar setActiveView={setActiveView} activeView={activeView} />
      {
        activeView === 'real-time-comm' ? <RealTimeComm userEmail={user.email} /> :
          activeView === 'resourceTrading' ? <ResourceTrading /> :
            activeView === 'survivalGuide' ? <SurvivalGuide /> :
              activeView === 'survivalScanner' ? <SurvivalScanner /> :
                activeView === 'edibilityChecker' ? <EdibilityChecker /> :
                  null
      }
    </div>
  );
};

export default Home;