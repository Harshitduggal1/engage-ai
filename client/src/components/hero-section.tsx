import React from 'react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "AI-powered Analysis",
    description: "Leverage advanced AI to analyze contracts quickly and accurately.",
    icon: "🔍",
  },
  {
    title: "Risk Identification",
    description: "Spot potential risks and opportunities in your contracts.",
    icon: "🛡️",
  },
  {
    title: "Streamlined Negotiation",
    description: "Accelerate the negotiation process with AI-driven insights.",
    icon: "⏳",
  },
  {
    title: "Cost Reduction",
    description: "Significantly reduce legal costs through automation.",
    icon: "💰",
  },
  {
    title: "Improved Compliance",
    description: "Ensure your contracts meet all regulatory requirements.",
    icon: "⚖️",
  },
  {
    title: "Faster Turnaround",
    description: "Complete contract reviews in minutes instead of hours.",
    icon: "⚡",
  },
];

const MotionLink = motion.a;
const MotionButton = motion.button;

export function HeroSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      <div className="container px-4 md:px-6 flex flex-col items-center max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 w-full relative z-10"
        >
          <MotionLink
            href="/dashboard"
            className="px-6 py-3 mb-8 inline-flex items-center justify-center text-sm font-medium rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform hover:scale-105 transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2 text-lg">✨</span>
            Introducing Simple Metrics for your team
          </MotionLink>
          
          <motion.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Revolutionize Your Contracts
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Harness the power of AI to analyze, understand, and optimize your contracts in no time.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <MotionButton
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(236, 72, 153, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <span className="ml-2">→</span>
            </MotionButton>
            <MotionButton
              className="px-8 py-4 text-lg font-semibold rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(79, 70, 229, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
              <span className="ml-2">🌐</span>
            </MotionButton>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 group"
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="text-4xl mb-4 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full w-16 h-16 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-indigo-400 group-hover:from-indigo-400 group-hover:to-pink-400 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-all duration-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;