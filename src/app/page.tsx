"use client";

import { useEffect, useState } from 'react';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [headers, setHeaders] = useState<string[]>([]);
  const [dataRows, setDataRows] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (csv: string) => {
    const lines = csv.split(/\r?\n/).filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const dataRows = lines.slice(1);
    return { headers, dataRows };
  };

  const fetchAndBuildTable = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/spelling-list');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const csv = await response.text();
      const { headers, dataRows } = parseCSV(csv);
      setHeaders(headers);
      setDataRows(dataRows);
    } catch (error) {

      console.error('Error fetching spelling list:', error);
      setError('Error loading spelling list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndBuildTable();
  }, []);

  return (
    <div>
      <h1>Spelling Word Schedule</h1>
      {loading && <div id="loading">Loading spelling list...</div>}
      {error && <div id="loading">{error}</div>}
      <button onClick={fetchAndBuildTable}>Regenerate List</button>
      {!loading && !error && (
        <table id="spellingTable">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header.trim()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.split(',').map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell.trim()}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <style jsx>{`
        body {
          font-family: sans-serif;
          margin: 20px;
        }
        table {
          border-collapse: collapse;
          width: 100%;
          max-width: 600px;
        }
        th,
        td {
          border: 1px solid #aaa;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f5f5f5;
        }
        #loading {
          font-style: italic;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default Home;
