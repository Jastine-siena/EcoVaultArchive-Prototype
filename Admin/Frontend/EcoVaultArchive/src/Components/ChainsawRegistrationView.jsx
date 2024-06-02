import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook

const ChainsawRegistrationView = () => {
    const [fileData, setFileData] = useState(null);
    const { filename } = useParams(); // Use useParams hook to access route parameters
  
    useEffect(() => {
      const fetchDocument = async () => {
        try {
          const response = await axios.get(`http://localhost:7000/view/cr/${filename}`, {
            responseType: 'arraybuffer',
          });
          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          setFileData(url);
        } catch (error) {
          console.error('Error fetching document:', error);
          // Show an error message on UI
          setFileData('error');
        }
      };
      fetchDocument();
    }, [filename]);
  
    if (!fileData) return <div>Loading...</div>;
    if (fileData === 'error') return <div>Error fetching document. Please try again later.</div>;
  
    return (
      <div>
        <iframe src={fileData} width="100%" height="600px" title={filename} />
      </div>
    );
}

export default ChainsawRegistrationView;
