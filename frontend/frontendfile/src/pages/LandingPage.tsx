import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-lightBg dark:bg-gray-900 text-darkText dark:text-white transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary to-[#A8E6CF] text-white py-20 md:py-32 flex items-center justify-center min-h-[500px]">
        <div className="container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 animate-fade-in-down">
            Fresh Milk Delivered Every Morning
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-90 animate-fade-in-up">
            Your daily dose of health, straight from our farms to your doorstep.
          </p>
          <Link to="/subscribe">
            <Button variant="accent" size="large" className="animate-scale-in">
              Start Your Subscription
            </Button>
          </Link>
        </div>
        {/* Placeholder for hero image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="/images/hero-milk.png" // High-quality realistic image of fresh milk bottles
            alt="Fresh milk bottles"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Category Showcase */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore Our Dairy Range</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Category Card 1: Cow Milk */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src="/images/cow-milk.png" alt="Cow Milk" className="w-full h-48 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Cow Milk</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Pure, wholesome, and nutritious.</p>
            </div>
          </div>
          {/* Category Card 2: Buffalo Milk */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src="/images/buffalo-milk.png" alt="Buffalo Milk" className="w-full h-48 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Buffalo Milk</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Rich, creamy, and energy-packed.</p>
            </div>
          </div>
          {/* Category Card 3: Flavoured Milk */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src="/images/flavoured-milk.png" alt="Flavoured Milk" className="w-full h-48 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Flavoured Milk</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Deliciously refreshing treats.</p>
            </div>
          </div>
          {/* Category Card 4: Curd */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src="/images/curd.png" alt="Curd" className="w-full h-48 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Curd</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Homemade goodness for your gut.</p>
            </div>
          </div>
          {/* Category Card 5: Ghee */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition-transform duration-300">
            <img src="/images/ghee.png" alt="Ghee" className="w-full h-48 object-cover" />
            <div className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Ghee</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Traditional clarity, rich flavor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="text-primary text-5xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Products</h3>
              <p className="text-gray-600 dark:text-gray-300">Select from our wide range of fresh dairy products.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="text-primary text-5xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Set Your Schedule</h3>
              <p className="text-gray-600 dark:text-gray-300">Daily, alternate, or custom days – your choice!</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md">
              <div className="text-primary text-5xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Enjoy Fresh Delivery</h3>
              <p className="text-gray-600 dark:text-gray-300">Receive fresh milk at your doorstep every morning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Milkman App?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div className="space-y-6">
            <div className="flex items-start">
              <svg className="w-8 h-8 text-primary mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <h3 className="text-xl font-semibold mb-1">Farm Fresh Quality</h3>
                <p className="text-gray-600 dark:text-gray-300">Sourced directly from local farms, ensuring the highest quality and freshness.</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-8 h-8 text-primary mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <div>
                <h3 className="text-xl font-semibold mb-1">Flexible Subscriptions</h3>
                <p className="text-gray-600 dark:text-gray-300">Easily pause, resume, or customize your delivery schedule anytime.</p>
              </div>
            </div>
            <div className="flex items-start">
              <svg className="w-8 h-8 text-primary mr-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              <div>
                <h3 className="text-xl font-semibold mb-1">Eco-Friendly Delivery</h3>
                <p className="text-gray-600 dark:text-gray-300">Sustainable practices from farm to your home.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <img
              src="/images/family-receiving-milk.png" // High-quality realistic image of family receiving milk
              alt="Family receiving milk"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-primary dark:bg-green-700 py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Experience Freshness?</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">Join our community and enjoy daily fresh milk delivery.</p>
          <Link to="/subscribe">
            <Button variant="secondary" size="large" className="text-primary bg-white hover:bg-gray-100">
              Subscribe Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
