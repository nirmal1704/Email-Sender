"use client";
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export default function Home() {
  const [csvData, setCsvData] = useState([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [dailySent, setDailySent] = useState(0);
  const [showAllCols, setShowAllCols] = useState(false);

  const DAILY_LIMIT = 100;
  const BATCH_SIZE = 10;
  const RATE_LIMIT_DELAY_MS = 1000;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        setDailySent(data.sent || 0);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    };
    fetchStats();
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data.length === 0) return;

          // Smart Email Column Detection
          const headers = Object.keys(results.data[0]);
          let emailKey = headers.find(h => h.toLowerCase().includes('email'));
          
          // Fallback regex search on the first row's values
          if (!emailKey) {
            const firstRow = results.data[0];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            emailKey = headers.find(h => typeof firstRow[h] === 'string' && emailRegex.test(firstRow[h].trim()));
          }

          if (!emailKey) {
            alert("Could not automatically find an email column in your CSV! Please ensure there is a column containing emails.");
            return;
          }

          const validData = results.data.filter(row => {
            const email = row[emailKey];
            if (email && email.trim() !== '') {
              row._targetEmail = email.trim(); // Normalize for backend
              return true;
            }
            return false;
          });
          
          setCsvData(validData);
          setStatus(`Loaded ${validData.length} valid rows.`);
        },
      });
    }
  };

  const handleSendEmails = async () => {
    if (csvData.length === 0) {
      alert("Please upload a valid CSV first!");
      return;
    }

    if (dailySent >= DAILY_LIMIT) {
      setStatus(`Daily limit of ${DAILY_LIMIT} emails reached. Try again tomorrow!`);
      return;
    }

    setLoading(true);
    let sentThisRun = 0;
    const remainingLimit = DAILY_LIMIT - dailySent;
    const toProcess = csvData.slice(0, remainingLimit);

    if (toProcess.length < csvData.length) {
      alert(`Only sending ${toProcess.length} emails to stay under your ${DAILY_LIMIT} daily limit.`);
    }

    for (let i = 0; i < toProcess.length; i += BATCH_SIZE) {
      const batch = toProcess.slice(i, i + BATCH_SIZE);
      const currentEnd = Math.min(i + BATCH_SIZE, toProcess.length);
      setStatus(`Sending emails ${i + 1} to ${currentEnd}...`);
      
      try {
        const response = await fetch('/api/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: batch })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          sentThisRun += result.sentCount;
          setDailySent(prev => prev + result.sentCount);
        } else {
          console.error("Batch error:", result.error);
        }
      } catch (error) {
        console.error(error);
      }
      
      if (i + BATCH_SIZE < toProcess.length) {
        setStatus(`Sent ${currentEnd}. Waiting 1s for rate limit...`);
        await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
      }
    }
    
    setStatus(`Finished! Sent ${sentThisRun} emails this run.`);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-20 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">CSV to Email Sender</h1>
        <p className="text-gray-500 mb-8">Upload a CSV file and send personalized emails instantly.</p>
        
        <div className="flex justify-between items-center mb-6 p-4 bg-indigo-50 text-indigo-800 rounded-lg border border-indigo-100">
          <div>
            <span className="font-semibold block">Daily Limit Tracker</span>
            <span className="text-sm opacity-80">Limits reset daily per browser/computer.</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{dailySent}</span> / {DAILY_LIMIT} Sent
            <div className="text-xs mt-1">{DAILY_LIMIT - dailySent} remaining today</div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload CSV File</label>
          <input 
            type="file" 
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-colors"
          />
        </div>

        {csvData.length > 0 && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-700">Data Preview ({csvData.length} valid rows):</h3>
              <button 
                onClick={() => setShowAllCols(!showAllCols)}
                className="text-xs text-indigo-600 hover:underline"
              >
                {showAllCols ? "Show fewer columns" : "Show all columns"}
              </button>
            </div>
            
            <div className="overflow-x-auto overflow-y-auto max-h-96 border border-gray-200 rounded">
              <table className="min-w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0 shadow-sm">
                  <tr>
                    {(showAllCols ? Object.keys(csvData[0]) : Object.keys(csvData[0]).slice(0, 4)).map((key) => (
                      <th key={key} className="px-4 py-3 whitespace-nowrap">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {csvData.map((row, i) => (
                    <tr key={i} className="bg-white hover:bg-gray-50 transition-colors">
                      {(showAllCols ? Object.keys(csvData[0]) : Object.keys(csvData[0]).slice(0, 4)).map((key) => (
                        <td key={key} className="px-4 py-3 whitespace-nowrap">{row[key] || '-'}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={handleSendEmails}
            disabled={loading || csvData.length === 0 || dailySent >= DAILY_LIMIT}
            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all min-w-[150px] ${
              loading || csvData.length === 0 || dailySent >= DAILY_LIMIT
                ? 'bg-indigo-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? 'Sending...' : 'Send Emails'}
          </button>
          
          <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-md animate-pulse">
            {status || 'Waiting to send...'}
          </span>
        </div>
      </div>
    </div>
  );
}
