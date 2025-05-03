import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [agencyInfo, setAgencyInfo] = useState(null);
  const [featuredVoyages, setFeaturedVoyages] = useState([]);
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
          setFeaturedVoyages(response.data.featured_voyages || []);
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[80vh] bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80")' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full flex items-center justify-center text-center text-white px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {agencyInfo?.name || 'FlyVoyages'}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {agencyInfo?.description || 'Découvrez le monde avec nous'}
            </p>
            <Link
              to="/destinations"
              className="inline-block bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-50 transition duration-300"
            >
              Explorer nos destinations
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Voyages Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Voyages en Vedette
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez nos meilleures offres du moment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredVoyages.map((voyage) => {
              const imageUrl = getImageUrl(voyage);
              return (
                <div
                  key={voyage.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-64 relative">
                    {imageUrl && (
                      <img
                        src={imageUrl}
                        alt={voyage.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {voyage.title}
                      </h3>
                      <p className="text-white text-sm">
                        {voyage.destination}, {voyage.pays}
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {voyage.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-blue-600">
                        {voyage.price.toLocaleString('fr-DZ')} DA
                      </span>
                      <Link
                        to={`/voyages/${voyage.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Voir les détails →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/destinations"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
            >
              Voir tous nos voyages
            </Link>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Nous Choisir ?
            </h2>
            <p className="text-xl text-gray-600">
              Une expérience de voyage inoubliable
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service de Qualité</h3>
              <p className="text-gray-600">
                Une équipe professionnelle à votre service 24/7
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Meilleurs Prix</h3>
              <p className="text-gray-600">
                Des offres compétitives et des promotions régulières
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Destinations Uniques</h3>
              <p className="text-gray-600">
                Des voyages personnalisés selon vos envies
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prêt à Partir ?
            </h2>
            <p className="text-xl text-gray-600">
              Contactez-nous pour planifier votre prochain voyage
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
    </div>
  );
};

export default Home; 