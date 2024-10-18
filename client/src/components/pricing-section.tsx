import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const api = {
  get: async (p0: string) => ({ data: { sessionId: 'mock-session-id' } })
};

const stripePromise = Promise.resolve({
  redirectToCheckout: async (p0: { sessionId: string; }) => ({})
});

export function PricingSection() {
  const handleUpgrade = async () => {
    try {
      const response = await api.get("/payments/create-checkout-session");
      const stripe = await stripePromise;
      await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-r from-purple-800/20 via-pink-700/20 to-red-600/20"
      />
      <motion.h2 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
      >
        Choose Your Perfect Plan
      </motion.h2>
      <motion.p 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-xl md:text-2xl lg:text-3xl text-center max-w-4xl mx-auto mb-16 text-gray-300"
      >
        Unlock premium features and supercharge your contract analysis experience. Upgrade anytime to elevate your business to new heights!
      </motion.p>
      <div className="grid md:grid-cols-2 gap-12 max-w-7xl mx-auto">
        <PricingCard
          title="Basic"
          description="For comprehensive contract analysis"
          price="Free"
          period="/lifetime"
          features={[
            "Advanced contract analysis",
            "Unlimited projects",
            "Chat with your contract",
            "10+ risks with severity levels",
            "10+ opportunities with impact levels",
          ]}
          buttonText="Get Started"
          onButtonClick={handleUpgrade}
          gradientFrom="from-blue-500"
          gradientTo="to-cyan-500"
        />
        <PricingCard
          title="Premium"
          description="For comprehensive contract analysis"
          price="$100"
          highlight
          period="/lifetime"
          features={[
            "All Basic features",
            "Comprehensive contract summary",
            "Improvement recommendations",
            "Key clauses identification",
            "Legal compliance assessment",
          ]}
          buttonText="Upgrade Now"
          onButtonClick={handleUpgrade}
          gradientFrom="from-purple-600"
          gradientTo="to-pink-500"
        />
      </div>
    </div>
  );
}

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  onButtonClick: () => void;
  gradientFrom: string;
  gradientTo: string;
}

function PricingCard({
  title,
  description,
  price,
  features,
  period,
  buttonText,
  highlight,
  onButtonClick,
  gradientFrom,
  gradientTo,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      whileHover={{ scale: 1.05 }}
      className={`bg-gray-800 rounded-3xl overflow-hidden shadow-2xl ${
        highlight ? 'ring-4 ring-pink-500 ring-opacity-50' : ''
      }`}
    >
      <div className={`p-8 ${highlight ? 'bg-gradient-to-br from-purple-900 to-pink-900' : 'bg-gray-900'}`}>
        <motion.h3 
          className={`text-3xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {title}
        </motion.h3>
        <motion.p 
          className="text-gray-400 mb-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {description}
        </motion.p>
        <motion.div 
          className="flex items-baseline mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <span className={`text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${gradientFrom} ${gradientTo}`}>{price}</span>
          <span className="text-xl text-gray-500 ml-2">{period}</span>
        </motion.div>
      </div>
      <div className="p-8">
        <ul className="space-y-4 mb-8">
          <AnimatePresence>
            {features.map((feature, index) => (
              <motion.li 
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center text-gray-300"
              >
                <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full py-4 rounded-full text-lg font-bold transition-colors duration-300 ${
            highlight 
              ? `bg-gradient-to-r ${gradientFrom} ${gradientTo} text-white`
              : `bg-gray-700 text-gray-300 hover:bg-gradient-to-r hover:${gradientFrom} hover:${gradientTo} hover:text-white`
          }`}
          onClick={onButtonClick}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.div>
  );
}

export default PricingSection;