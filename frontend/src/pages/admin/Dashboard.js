import React from 'react';
import { Link } from 'react-router-dom';
import {
  HomeIcon,
  GlobeAltIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const menuItems = [
    {
      title: 'Gestion des Voyages',
      description: 'Ajouter, modifier ou supprimer des voyages',
      icon: GlobeAltIcon,
      href: '/admin/voyages',
    },
    {
      title: 'Informations Agence',
      description: 'Modifier les informations de contact et la description',
      icon: InformationCircleIcon,
      href: '/admin/agency-info',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Tableau de bord administrateur
        </h1>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
              <span
                className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
                aria-hidden="true"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
                </svg>
              </span>
            </Link>
          ))}

          <Link
            to="/"
            className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-700 ring-4 ring-white">
                <HomeIcon className="h-6 w-6" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-8">
              <h3 className="text-lg font-medium">
                <span className="absolute inset-0" aria-hidden="true" />
                Voir le site
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Retourner à la page d'accueil
              </p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 