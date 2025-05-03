import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AgencyInfo = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    facebook: '',
    instagram: '',
    twitter: '',
    opening_hours: '',
    map_embed: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgencyInfo();
  }, []);

  const fetchAgencyInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/admin/agency-info');
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching agency info:', error);
      toast.error('Erreur lors du chargement des informations');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/admin/agency-info', formData);
      toast.success('Informations mises à jour avec succès');
    } catch (error) {
      console.error('Error updating agency info:', error);
      toast.error('Erreur lors de la mise à jour des informations');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Informations de l'Agence
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Informations générales
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Ces informations seront affichées sur la page d'accueil du site.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nom de l'agence
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      name="description"
                      id="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Contact
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Informations de contact de l'agence.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Adresse
                    </label>
                    <input
                      type="text"
                      name="address"
                      id="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Téléphone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      id="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Site web
                    </label>
                    <input
                      type="url"
                      name="website"
                      id="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6">
                    <label
                      htmlFor="opening_hours"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Horaires d'ouverture
                    </label>
                    <textarea
                      name="opening_hours"
                      id="opening_hours"
                      rows="3"
                      value={formData.opening_hours}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Réseaux sociaux
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Liens vers vos réseaux sociaux.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="facebook"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      id="facebook"
                      value={formData.facebook}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="instagram"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      id="instagram"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="twitter"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      id="twitter"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Carte
                </h3>
                <p className="mt-1 text-sm text-gray-700">
                  Code d'intégration Google Maps.
                </p>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div>
                  <label
                    htmlFor="map_embed"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code iframe Google Maps
                  </label>
                  <textarea
                    name="map_embed"
                    id="map_embed"
                    rows="3"
                    value={formData.map_embed}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgencyInfo; 