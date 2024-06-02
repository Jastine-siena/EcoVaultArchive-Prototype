import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DocumentView from './Components/DocumentView';
import Login from './Components/Login';
import DocumentList from './Components/DocumentList'
import 'bootstrap/dist/css/bootstrap.min.css';
import FIleRouterLinks from './File Management Routes/FIleRouterLinks';
import ChainsawRegistration from './Components/ChainsawRegistration';
import LandTitleRegistration from './Components/LandTitleRegistration';
import TransportPermits from './Components/TransportPermits';
import TreePlantationPermits from './Components/TreePlantationPermits';



function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Router>
        <div>
          {isLoggedIn ? (
            
              <Routes>
                  <Route path ="/" element={<FIleRouterLinks />} />
                  
                  <Route path="/doclist" element={<DocumentList />} />
                  <Route path="/cr" element={<ChainsawRegistration />} />
                  <Route path="/lt" element={<LandTitleRegistration />} />
                  <Route path="/tp" element={<TransportPermits />} />
                  <Route path="/tpr" element={<TreePlantationPermits />} />

                  <Route path="/view/:filename" element={<DocumentView />} />  
            </Routes>
   
          ) : (
            <Login setIsLoggedIn={setIsLoggedIn} />
          )}
        </div>
      </Router>
    </div>
  );
}

export default App;
