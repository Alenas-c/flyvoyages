import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Voyages = () => {
  const [voyages, setVoyages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    pays: '',
    price: '',
    description: '',
    media: []
  });

  useEffect(() => {
    fetchVoyages();
  }, []);

  const fetchVoyages = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      if (!apiUrl) {
        throw new Error('REACT_APP_API_URL n\'est pas définie');
      }

      const response = await axios.get(`${apiUrl}/admin/voyages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.status === 'success') {
        setVoyages(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching voyages:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des voyages');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      media: Array.from(e.target.files)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (key !== 'media') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Ajouter les fichiers
      formData.media.forEach(file => {
        formDataToSend.append('media', file);
      });

      if (selectedVoyage) {
        // Mise à jour
        await axios.put(`${apiUrl}/admin/voyages/${selectedVoyage.id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Voyage mis à jour avec succès');
      } else {
        // Création
        await axios.post(`${apiUrl}/admin/voyages`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Voyage créé avec succès');
      }

      setIsModalOpen(false);
      fetchVoyages();
      resetForm();
    } catch (err) {
      console.error('Error saving voyage:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde du voyage');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce voyage ?')) {
      return;
    }

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.delete(`${apiUrl}/admin/voyages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Voyage supprimé avec succès');
      fetchVoyages();
    } catch (err) {
      console.error('Error deleting voyage:', err);
      toast.error('Erreur lors de la suppression du voyage');
    }
  };

  const handleEdit = (voyage) => {
    setSelectedVoyage(voyage);
    setFormData({
      title: voyage.title,
      destination: voyage.destination,
      pays: voyage.pays,
      price: voyage.price,
      description: voyage.description,
      media: []
    });
    setIsModalOpen(true);
  };

  const handleDeleteMedia = async (voyageId, mediaId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.delete(`${apiUrl}/admin/voyages/${voyageId}/media/${mediaId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Média supprimé avec succès');
      fetchVoyages();
    } catch (err) {
      console.error('Error deleting media:', err);
      toast.error('Erreur lors de la suppression du média');
    }
  };

  const handleSetMainMedia = async (voyageId, mediaId) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(`${apiUrl}/admin/voyages/${voyageId}/media/${mediaId}/main`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Image principale mise à jour');
      fetchVoyages();
    } catch (err) {
      console.error('Error setting main media:', err);
      toast.error('Erreur lors de la mise à jour de l\'image principale');
    }
  };

  const handleDragEnd = async (result, voyageId) => {
    if (!result.destination) return;

    const items = Array.from(voyages.find(v => v.id === voyageId).media);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      await axios.put(
        `${apiUrl}/admin/voyages/${voyageId}/media/order`,
        items.map(m => m.id),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      fetchVoyages();
    } catch (err) {
      console.error('Error updating media order:', err);
      toast.error('Erreur lors de la mise à jour de l\'ordre des médias');
    }
  };

  const resetForm = () => {
    setSelectedVoyage(null);
    setFormData({
      title: '',
      destination: '',
      pays: '',
      price: '',
      description: '',
      media: []
    });
  };

  const getMediaUrl = (filePath) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl || !filePath) return null;
    return `${apiUrl}/${filePath}`;
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Voyages</h1>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Ajouter un voyage
          </button>
        </div>

        {/* Voyages List */}
        <div className="grid grid-cols-1 gap-8">
          {voyages.map(voyage => (
            <div key={voyage.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{voyage.title}</h2>
                    <p className="text-gray-600">{voyage.destination}, {voyage.pays}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(voyage)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(voyage.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Media Gallery */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Médias</h3>
                  <DragDropContext onDragEnd={(result) => handleDragEnd(result, voyage.id)}>
                    <Droppable droppableId={`media-${voyage.id}`} direction="horizontal">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="flex space-x-4 overflow-x-auto pb-4"
                        >
                          {voyage.media.map((media, index) => (
                            <Draggable
                              key={media.id}
                              draggableId={`media-${media.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="relative group"
                                >
                                  {media.media_type === 'video' ? (
                                    <video
                                      src={getMediaUrl(media.file_path)}
                                      className="w-32 h-32 object-cover rounded-lg"
                                      controls
                                    />
                                  ) : (
                                    <img
                                      src={getMediaUrl(media.file_path)}
                                      alt=""
                                      className="w-32 h-32 object-cover rounded-lg"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-2">
                                    {!media.is_main && (
                                      <button
                                        onClick={() => handleSetMainMedia(voyage.id, media.id)}
                                        className="p-1 bg-blue-600 text-white rounded-full hover:bg-blue-700"
                                        title="Définir comme image principale"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleDeleteMedia(voyage.id, media.id)}
                                      className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                                      title="Supprimer"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                  {media.is_main && (
                                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                      Principal
                                    </div>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedVoyage ? 'Modifier le voyage' : 'Ajouter un voyage'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Titre</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Destination</label>
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Pays</label>
                      <input
                        type="text"
                        name="pays"
                        value={formData.pays}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Prix (DA)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Médias</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileChange}
                        className="mt-1 block w-full"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Formats acceptés : images (JPG, PNG, GIF) et vidéos (MP4, MOV, AVI)
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedVoyage ? 'Mettre à jour' : 'Créer'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Voyages; 