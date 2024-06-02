import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ChainsawRegistration = () => {
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const sourceTable = 'cr'; // Chainsaw Registration table


  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/documents/${sourceTable}`);
        setDocuments(response.data);
        setFilteredDocuments(response.data); // Initialize filtered documents
      } catch (error) {
        alert('Error fetching documents');
      }
    };
    fetchDocuments();
  }, [sourceTable]);


  const handleSearch = () => {
    const filtered = documents.filter(doc => doc.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filtered.length === 0){
      alert("Searched file not found");
    }
    setFilteredDocuments(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4 text-dark">Chainsaw Registration Document Archive Lists</h2>
      <div className="container mt-4">
        <div className="row mt-3 justify-content-end">
          <div className="col-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search documents"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-secondary" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </div>
      <ul className="list-group mt-5">
        {filteredDocuments.map((filename, index) => (
          <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={`/view/${sourceTable}/${filename}`} className="text-dark">{filename}</Link>
            <div>
              <a href={`http://localhost:7000/documents/${sourceTable}/${filename}`} className="btn btn-success" download>Download</a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChainsawRegistration;
