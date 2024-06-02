import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DocumentView = ({ match }) => {
  const [fileData, setFileData] = useState(null);
  const { filename } = match.params;

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/view/treecp/${filename}`, {
          responseType: 'arraybuffer',
        });
        const blob = new Blob([response.data], { type: response.headers['content-type'] });
        const url = URL.createObjectURL(blob);
        setFileData(url);
      } catch (error) {
        alert('Error fetching document');
      }
    };
    fetchDocument();
  }, [filename]);

  if (!fileData) return <div>Loading...</div>;

  return (
    <div>
      <iframe src={fileData} width="100%" height="600px" title={filename} />
    </div>
  );
};

export default DocumentView;
