import React, { useState } from 'react';
import axios from 'axios';


const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:7000/login', { username, password });
      if (response.data.success) {
        setIsLoggedIn(true);
      }// else {
    //     alert('Invalid username or password');
    //   }
    } catch (error) {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="container" style={{ backgroundImage: `url('https://www.rappler.com/tachyon/2023/10/denr-protected-area-october-18-2023.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
    <div className="row justify-content-center">
      <div className="col-md-6 mt-5">
        <div className='mt-5'></div>
        <div className='mt-5'></div>
        <div className="card shadow">
          <div className="card-header bg-success text-white">
            <h2 className="mb-0 text-center">Welcome to EcoVaultArchive</h2>
            <p className="mb-0 text-center">Document Security and Archiving System</p>
            <p className="mb-0 mt-3 text-center">Good Day, <i>Admin!</i></p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="mt-3 btn btn-success btn-block">Login</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
};

export default Login;
