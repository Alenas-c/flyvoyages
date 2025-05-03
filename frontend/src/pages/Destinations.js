import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Destinations = () => {
  const [destinations, setDestinations] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('REACT_APP_API_URL n\'est pas définie dans les variables d\'environnement');
        }

        // Récupérer les destinations
        const destinationsResponse = await axios.get(`${apiUrl}/destinations`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (destinationsResponse.data.status === 'success') {
          setDestinations(destinationsResponse.data.data);
        } else {
          throw new Error(destinationsResponse.data.message || 'Erreur lors du chargement des destinations');
        }

        // Récupérer tous les voyages
        const voyagesResponse = await axios.get(`${apiUrl}/voyages`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (voyagesResponse.data.status === 'success') {
          setVoyages(voyagesResponse.data.data);
        } else {
          throw new Error(voyagesResponse.data.message || 'Erreur lors du chargement des voyages');
        }

        setError(null);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        
        let errorMessage = 'Erreur lors du chargement des données';
        if (err.response) {
          errorMessage = err.response.data.message || errorMessage;
        } else if (err.request) {
          errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion internet.';
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getImageUrl = (voyage) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl || !voyage.media || voyage.media.length === 0) {
      return null;
    }
    const mainMedia = voyage.media.find(m => m.is_main) || voyage.media[0];
    return `${apiUrl}/${mainMedia.file_path}`;
  };

  // Filtrer les voyages par pays
  const filteredVoyages = selectedCountry
    ? voyages.filter(voyage => voyage.pays === selectedCountry)
    : voyages;

  // Grouper les voyages par pays
  const voyagesByCountry = filteredVoyages.reduce((acc, voyage) => {
    if (!acc[voyage.pays]) {
      acc[voyage.pays] = [];
    }
    acc[voyage.pays].push(voyage);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-6 text-xl text-gray-600 font-medium">Chargement des destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <svg className="w-20 h-20 text-red-500 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl text-gray-800 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative py-20 bg-blue-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Explorez le Monde
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Découvrez nos destinations uniques et vivez des expériences inoubliables
            </p>
            
            {/* Filtre par pays */}
            <div className="max-w-md mx-auto">
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full px-6 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="" className="text-gray-900">Tous les pays</option>
                {destinations.map((destination) => (
                  <option key={destination.pays} value={destination.pays} className="text-gray-900">
                    {destination.pays}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des voyages par pays */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {Object.entries(voyagesByCountry).map(([country, countryVoyages]) => (
          <div key={country} className="mb-16">
            <div className="flex items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">{country}</h2>
              <div className="ml-4 px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                {countryVoyages.length} voyage{countryVoyages.length > 1 ? 's' : ''}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countryVoyages.map((voyage) => {
                const imageUrl = getImageUrl(voyage);
                return (
                  <Link
                    key={voyage.id}
                    to={`/voyages/${voyage.slug}`}
                    className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="aspect-w-16 aspect-h-9 relative">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={voyage.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-medium">
                          {voyage.destination}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {voyage.title}
                        </h3>
                        <span className="text-2xl font-bold text-blue-600">
                          {voyage.price.toLocaleString('fr-DZ')} DA
                        </span>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2 mb-4">
                        {voyage.description}
                      </p>
                      
                      <div className="flex justify-end">
                        <span className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700">
                          Voir les détails
                          <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Message si aucun voyage trouvé */}
        {Object.keys(voyagesByCountry).length === 0 && (
          <div className="text-center py-16">
            <svg className="w-20 h-20 text-gray-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-gray-600 mb-6">
              Aucun voyage trouvé pour les critères sélectionnés
            </p>
            <button
              onClick={() => setSelectedCountry('')}
              className="px-8 py-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Voir tous les voyages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Destinations; 