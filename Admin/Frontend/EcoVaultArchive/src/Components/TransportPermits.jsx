import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TransportPermits = () => {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const sourceTable = 'tp';
  const destinationTables = ['treecp', 'lt', 'cr', 'tpr'];

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/documents/${sourceTable}`);
        setDocuments(response.data);
        setFilteredDocuments(response.data);
      } catch (error) {
        alert('Error fetching documents');
      }
    };
    fetchDocuments();
  }, [sourceTable]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(`http://localhost:7000/upload/${sourceTable}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      setFile(null); // Reset file input after successful upload
      const response = await axios.get(`http://localhost:7000/documents/${sourceTable}`);
      setDocuments(response.data);
      setFilteredDocuments(response.data);
    } catch (error) {
      alert('Error uploading file');
    }
  };

  const handleMove = async (filename, destinationTable) => {
    try {
      await axios.post(`http://localhost:7000/${sourceTable}/move/${sourceTable}/${destinationTable}`, {
        filename,
      });
      alert('File moved successfully');
      const updatedDocuments = documents.filter((doc) => doc !== filename);
      setDocuments(updatedDocuments);
      setFilteredDocuments(updatedDocuments);
      setDropdownOpen(null);
    } catch (error) {
      alert('Error moving file');
    }
  };

  const handleSearch = () => {
    const filtered = documents.filter((doc) =>
      doc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length === 0) {
      alert('Searched file not found');
    }
    setFilteredDocuments(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4 text-dark">Transport Permits Document Lists</h2>
      <div className="container mt-4">
        <div className="row justify-content-end">
          <div className="col-auto">
            <form onSubmit={handleSubmit} className="form-inline">
              <div className="input-group">
                <input
                  type="file"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
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
              <button className="btn btn-secondary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <ul className="list-group mt-5">
        {filteredDocuments.map((filename, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link to={`/view/${sourceTable}/${filename}`} className="text-dark">
              {filename}
            </Link>
            <div>
              <div className="btn-group">
                <button
                  type="button"
                  className="btn btn-info"
                  onClick={() =>
                    setDropdownOpen(dropdownOpen === index ? null : index)
                  }
                >
                  Move To
                </button>
                {dropdownOpen === index && (
                  <div className="dropdown-menu show">
                    {destinationTables.map((table, tableIndex) => (
                      <button
                        key={tableIndex}
                        className="dropdown-item pr-3"
                        onClick={() => handleMove(filename, table)}
                      >
                        {table}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={`http://localhost:7000/documents/${sourceTable}/${filename}`}
                className="btn btn-success"
                download
              >
                Download
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransportPermits;
