'use client';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Zap,
  ArrowRight,
  Share2,
  Settings,
  Smartphone,
  Shield,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

// Color theme
const theme = {
  primary: {
    main: 'from-emerald-500 to-teal-700',
    light: 'bg-emerald-50',
    dark: 'bg-emerald-900',
    text: 'text-emerald-600',
    hover: 'hover:bg-emerald-100'
  },
  secondary: {
    main: 'bg-teal-600',
    light: 'bg-teal-50',
    text: 'text-teal-600'
  }
};

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const features = [
    {
      icon: <Share2 className="w-8 h-8" />,
      title: "Connect Your Services",
      description: "Link your favorite apps and services to create automated workflows."
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Custom Triggers",
      description: "Set up custom conditions to trigger your automated actions."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Your data and connections are encrypted and secure."
    }
  ];

  const NavLink = ({ href, children }) => (
    <a 
      href={href} 
      className="text-gray-100 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200"
    >
      {children}
    </a>
  );

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-gradient-to-r from-emerald-600 to-teal-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="text-white text-2xl font-bold">
              AREA
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="/mobile">Mobile App</NavLink>
              <NavLink href="/docs">Documentation</NavLink>
              <a 
                href="/register" 
                className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
              >
                Get Started
              </a>
            </div>

            {/* Mobile Navigation Button */}
            <button 
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <div className="flex flex-col space-y-2">
                <NavLink href="#how-it-works">How It Works</NavLink>
                <NavLink href="#features">Features</NavLink>
                <NavLink href="/mobile">Mobile App</NavLink>
                <NavLink href="/docs">Documentation</NavLink>
                <a 
                  href="/register" 
                  className="bg-white text-emerald-600 px-4 py-2 rounded-lg font-medium text-center hover:bg-gray-100 transition-colors duration-200"
                >
                  Get Started
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-700 pt-16">
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div
          className="container mx-auto px-4 text-center relative z-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Automate Your Digital Life
          </h1>

          <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Connect your services and create powerful automation workflows with AREA's intuitive platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.a
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-emerald-700 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Building
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>

            <motion.a
              href="#how-it-works"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white border-2 border-white/30 rounded-full hover:bg-white/10 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              How It Works
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white/80" />
        </motion.div>
      </section>

      {/* Rest of the sections remain the same but with updated colors */}
      {/* ... How It Works Section ... */}
      
      {/* Mobile App Section */}
      <section className="py-24 bg-emerald-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            {...fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8">
              AREA Mobile App
            </h2>
            <p className="text-lg text-gray-600 mb-12">
              Take your automations on the go with our Android app. Monitor and manage your workflows from anywhere.
            </p>
            <motion.a
              href="/downloads/area-mobile.apk"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Smartphone className="mr-2 w-5 h-5" />
              Download APK
            </motion.a>
            <p className="mt-4 text-sm text-gray-500">
              Android 6.0 and above
            </p>
          </motion.div>
        </div>
      </section>

      {/* Updated CTA Section with new colors */}
      <section className="py-24 bg-emerald-900">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            {...fadeIn}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">
              Ready to Automate?
            </h2>
            <p className="text-lg text-gray-300 mb-12">
              Start building your first automation workflow today.
            </p>
            <motion.a
              href="/register"
              className="inline-flex items-center px-8 py-4 text-lg font-medium text-emerald-700 bg-white rounded-full hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
