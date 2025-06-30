import React, { useState, useEffect } from 'react';
import { populateDatabase, checkDatabaseData } from '../utils/firebaseSetup';
import LoadingSpinner from './LoadingSpinner';

const DatabaseSetup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [dataStatus, setDataStatus] = useState<any>(null);

  const checkData = async () => {
    const status = await checkDatabaseData();
    setDataStatus(status);
  };

  const handlePopulateDatabase = async () => {
    setLoading(true);
    try {
      const result = await populateDatabase();
      if (result.success) {
        alert('Database populated successfully!');
        await checkData();
      } else {
        alert('Error populating database. Check console for details.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error populating database. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkData();
  }, []);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Database Setup</h2>
      
      {dataStatus && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Hospitals: {dataStatus.hospitalCount} | Doctors: {dataStatus.doctorCount}
          </p>
          {dataStatus.error && (
            <p className="text-red-600 text-sm mt-1">
              Error: {dataStatus.error.message}
            </p>
          )}
        </div>
      )}

      <button
        onClick={handlePopulateDatabase}
        disabled={loading}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? <LoadingSpinner size="sm" /> : 'Populate Database with Sample Data'}
      </button>

      <div className="mt-4 text-xs text-gray-500">
        <p>This will add sample hospitals and doctors to your Firestore database.</p>
        <p className="mt-1">Make sure you have deployed the firestore.rules file to your Firebase project.</p>
      </div>
    </div>
  );
};

export default DatabaseSetup; 