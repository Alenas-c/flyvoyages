import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const Voyages = () => {
  const location = useLocation();
  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVoyages = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('REACT_APP_API_URL n\'est pas définie');
        }

        const searchParams = new URLSearchParams(location.search);
        const response = await axios.get(`${apiUrl}/voyages`, {
          params: {
            pays: searchParams.get('pays'),
            destination: searchParams.get('destination'),
            min_price: searchParams.get('min_price'),
            max_price: searchParams.get('max_price')
          }
        });

        if (response.data.status === 'success') {
          setVoyages(response.data.data);
        } else {
          throw new Error(response.data.message || 'Erreur lors du chargement des voyages');
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching voyages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoyages();
  }, [location.search]);

  const getImageUrl = (voyage) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl || !voyage.media || voyage.media.length === 0) {
      return null;
    }
    const mainMedia = voyage.media.find(m => m.is_main) || voyage.media[0];
    return `${apiUrl}/${mainMedia.file_path}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des voyages...</p>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nos Voyages
          </h1>
          {location.search && (
            <p className="text-gray-600">
              {voyages.length} voyage{voyages.length !== 1 ? 's' : ''} trouvé{voyages.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Voyages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {voyages.map((voyage) => (
            <Link
              key={voyage.id}
              to={`/voyages/${voyage.slug}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="aspect-w-16 aspect-h-9">
                {voyage.media && voyage.media.length > 0 && (
                  <img
                    src={getImageUrl(voyage)}
                    alt={voyage.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {voyage.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {voyage.destination}, {voyage.pays}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">
                    {voyage.price.toLocaleString('fr-DZ')} DA
                  </span>
                  <span className="text-blue-600 hover:text-blue-700">
                    Voir les détails →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* No Results */}
        {voyages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              Aucun voyage trouvé pour les critères sélectionnés
            </p>
            <Link
              to="/voyages"
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700"
            >
              Voir tous les voyages
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voyages; 