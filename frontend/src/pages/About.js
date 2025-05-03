import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-center mb-4">About FlyVoyages</h1>
          <p className="text-xl text-center max-w-3xl mx-auto">
            Your trusted partner in creating unforgettable travel experiences since 2010
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2010, FlyVoyages has grown from a small local travel agency to a
                premier travel service provider, helping thousands of travelers explore the
                world's most beautiful destinations.
              </p>
              <p className="text-gray-600">
                Our mission is to make travel accessible, enjoyable, and memorable for
                everyone, while providing exceptional service and value to our clients.
              </p>
            </div>
            <div className="bg-gray-200 h-96 rounded-lg">
              {/* Add company image here */}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every aspect of our service, from planning to
                execution.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Integrity</h3>
              <p className="text-gray-600">
                We conduct our business with honesty, transparency, and ethical practices.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Customer Focus</h3>
              <p className="text-gray-600">
                Our clients' satisfaction and happiness are at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Add team member cards here */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 