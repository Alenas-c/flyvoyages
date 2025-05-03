import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VoyageDetail = () => {
  const { slug } = useParams();
  const [voyage, setVoyage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    const fetchVoyage = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL;
        if (!apiUrl) {
          throw new Error('REACT_APP_API_URL n\'est pas définie');
        }

        const response = await axios.get(`${apiUrl}/voyages/${slug}`);
        if (response.data.status === 'success') {
          setVoyage(response.data.data);
        } else {
          throw new Error(response.data.message || 'Erreur lors du chargement du voyage');
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching voyage:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVoyage();
  }, [slug]);

  const getMediaUrl = (filePath) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl || !filePath) {
      return null;
    }
    return `${apiUrl}/${filePath}`;
  };

  const nextMedia = () => {
    if (voyage?.media) {
      setCurrentMediaIndex((prev) => 
        prev === voyage.media.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevMedia = () => {
    if (voyage?.media) {
      setCurrentMediaIndex((prev) => 
        prev === 0 ? voyage.media.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du voyage...</p>
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

  if (!voyage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-xl">Voyage non trouvé</p>
          <Link 
            to="/voyages" 
            className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retour aux voyages
          </Link>
        </div>
      </div>
    );
  }

  const currentMedia = voyage.media[currentMediaIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link to="/voyages" className="text-blue-600 hover:text-blue-700 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux voyages
          </Link>
        </div>

        {/* Media Slider */}
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="h-[600px] w-full relative">
            {currentMedia && (
              currentMedia.media_type === 'video' ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <video
                    src={getMediaUrl(currentMedia.file_path)}
                    className="max-h-full max-w-full object-contain"
                    controls
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-black">
                  <img
                    src={getMediaUrl(currentMedia.file_path)}
                    alt={voyage.title}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )
            )}
          </div>

          {/* Navigation Buttons */}
          {voyage.media.length > 1 && (
            <>
              <button
                onClick={prevMedia}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextMedia}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all duration-300 hover:scale-110"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          {voyage.media.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {voyage.media.map((media, index) => (
                <button
                  key={media.id}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentMediaIndex ? 'bg-white scale-125' : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Voyage Details */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {voyage.title}
              </h1>
              <div className="flex items-center text-xl text-gray-600">
                <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {voyage.destination}, {voyage.pays}
              </div>
            </div>
            <div className="text-4xl font-bold text-blue-600 bg-blue-50 px-6 py-3 rounded-lg">
              {voyage.price.toLocaleString('fr-DZ')} DA
            </div>
          </div>

          <div className="prose max-w-none">
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description du voyage</h2>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                {voyage.description}
              </p>
            </div>
          </div>

          {/* Contact Button */}
          <div className="mt-8 text-center">
            <Link
              to="/contact"
              className="inline-flex items-center bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Réserver ce voyage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoyageDetail; 