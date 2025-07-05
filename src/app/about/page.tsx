import Link from 'next/link';
import { Shield, Truck, Users, Award } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'Your personal information and payments are always safe and secure with us.'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly with our reliable shipping partners.'
    },
    {
      icon: Users,
      title: 'Customer Support',
      description: '24/7 customer support to help you with any questions or concerns.'
    },
    {
      icon: Award,
      title: 'Quality Products',
      description: 'We carefully curate our products to ensure the highest quality standards.'
    }
  ];

  const stats = [
    { label: 'Happy Customers', value: '50,000+' },
    { label: 'Products Sold', value: '500,000+' },
    { label: 'Countries Served', value: '25+' },
    { label: 'Years in Business', value: '5+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About GoShop
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We&apos;re passionate about bringing you the best shopping experience with 
              quality products, competitive prices, and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2019, GoShop started with a simple mission: to make 
                  online shopping accessible, affordable, and enjoyable for everyone. 
                  What began as a small team with big dreams has grown into a 
                  trusted e-commerce platform serving customers worldwide.
                </p>
                <p>
                  We believe that great products shouldn&apos;t be hard to find or 
                  expensive to buy. That&apos;s why we work directly with manufacturers 
                  and suppliers to bring you the best deals on quality merchandise 
                  across a wide range of categories.
                </p>
                <p>
                  Today, we&apos;re proud to serve over 50,000 happy customers and 
                  continue to expand our product selection to meet your evolving needs.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://via.placeholder.com/600x400/6366f1/white?text=Our+Team"
                alt="GoShop Team"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose GoShop?
            </h2>
            <p className="text-lg text-gray-600">
              We&apos;re committed to providing you with the best shopping experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-indigo-100">
              See how we&apos;ve been making a difference
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-indigo-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              To democratize access to quality products by creating an inclusive, 
              user-friendly platform that connects customers with the best deals 
              from trusted sellers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
              </Link>
              <Link
                href="/signup"
                className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
              >
                Join Our Community
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
