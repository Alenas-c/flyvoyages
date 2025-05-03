import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contact = () => {
  const [agencyInfo, setAgencyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('REACT_APP_API_URL n\'est pas définie');
        }

        const response = await axios.get(`${apiUrl}/`);
        if (response.data) {
          setAgencyInfo(response.data.agency);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600">
            Nous sommes à votre disposition pour répondre à toutes vos questions
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Nos Coordonnées</h3>
                <div className="space-y-4">
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {agencyInfo?.address || 'Adresse de l\'agence'}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {agencyInfo?.phone || 'Téléphone'}
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {agencyInfo?.email || 'Email'}
                  </p>
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Horaires d'Ouverture</h3>
                  <p className="text-gray-600 whitespace-pre-line">
                    {agencyInfo?.opening_hours || 'Lundi - Vendredi: 9h00 - 18h00\nSamedi: 9h00 - 12h00'}
                  </p>
                </div>
              </div>
              <div className="h-[450px] rounded-lg overflow-hidden">
                {agencyInfo?.map_embed && (
                  <div dangerouslySetInnerHTML={{ __html: agencyInfo.map_embed }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 