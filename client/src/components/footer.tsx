"use client"

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Icons } from './shared/icons';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Product",
            links: [
                { name: 'Features', href: '/features' },
                { name: 'Pricing', href: '/pricing' },
                { name: 'Testimonials', href: '/testimonials' },
                { name: 'Integration', href: '/integration' }
            ]
        },
        {
            title: "Integrations",
            links: [
                { name: 'Facebook', href: '#' },
                { name: 'Instagram', href: '#' },
                { name: 'Twitter', href: '#' },
                { name: 'LinkedIn', href: '#' }
            ]
        },
        {
            title: "Resources",
            links: [
                { name: 'Blog', href: '/resources/blog' },
                { name: 'Support', href: '/resources/help' }
            ]
        },
        {
            title: "Company",
            links: [
                { name: 'About Us', href: '/about' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms & Conditions', href: '/terms' }
            ]
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10,
            },
        },
    };

    return (
        <footer className="bg-gradient-to-br from-blue-600 dark:from-gray-900 via-purple-600 dark:via-gray-800 to-pink-600 dark:to-gray-700 shadow-2xl backdrop-blur-xl py-24 transition-all duration-500 ease-in-out">
            <motion.div 
                className="mx-auto px-6 container"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="gap-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
                    <motion.div 
                        className="lg:col-span-2"
                        variants={itemVariants}
                    >
                        <div className="flex flex-col space-y-8">  
                            <motion.p 
                                className="max-w-sm font-semibold text-lg text-white leading-relaxed transform transition-all duration-300 ease-in-out hover:scale-105"
                                whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(255,255,255)" }}
                            >
                                Elevate your social media management with Engage.AI, the ultimate AI-powered CRM platform. Experience the future of AI-driven social engagement.
                            </motion.p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link href="/contact" className="inline-flex items-center bg-gradient-to-r from-green-400 hover:from-green-500 to-blue-500 hover:to-blue-600 shadow-lg hover:shadow-xl px-8 py-4 rounded-full font-bold text-lg text-white transform transition-all duration-300 ease-in-out hover:scale-105">
                                    Contact Us
                                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                    
                    {footerSections.map((section, index) => (
                        <motion.div 
                            key={section.title}
                            variants={itemVariants}
                            className="bg-white/20 dark:bg-gray-800/30 shadow-2xl hover:shadow-3xl backdrop-blur-lg p-8 rounded-3xl transform transition-all duration-500 hover:scale-105 hover:rotate-1"
                        >
                            <h3 className="mb-8 font-extrabold text-2xl text-white dark:text-gray-100 tracking-wide">{section.title}</h3>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <motion.li 
                                        key={link.name} 
                                        whileHover={{ x: 10, textShadow: "0 0 8px rgb(255,255,255)" }} 
                                        transition={{ type: "spring", stiffness: 400 }}
                                    >
                                        <Link href={link.href} className="flex items-center font-medium text-gray-200 text-lg hover:text-white dark:hover:text-primary-400 dark:text-gray-300 transform transition-colors duration-200 hover:scale-105">
                                            <span className="mr-3 text-2xl">→</span>
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
                
                <motion.div 
                    variants={itemVariants}
                    className="flex md:flex-row flex-col justify-between items-center border-white/30 dark:border-gray-700 mt-20 pt-10 border-t"
                >
                    <p className="font-medium text-lg text-white dark:text-gray-400">
                        &copy; {currentYear} Engage.AI Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-8 mt-8 md:mt-0">
                        {['Facebook', 'Twitter', 'Instagram', 'LinkedIn'].map((social) => (
                            <motion.a
                                key={social}
                                href="#"
                                className="text-white hover:text-primary dark:hover:text-primary-400 transform transition-colors duration-300 hover:scale-110"
                                whileHover={{ scale: 1.2, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="sr-only">{social}</span>
                              
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </footer>
    )
}

export default Footer