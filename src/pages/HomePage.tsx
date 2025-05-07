
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Car, 
  DollarSign, 
  Shield, 
  Camera 
} from 'lucide-react';

const HomePage = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5 + (i * 0.1),
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const features = [
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Accurate Valuations",
      description: "Get precise market valuations using our proprietary algorithm and real-time data."
    },
    {
      icon: <Camera className="h-8 w-8 text-primary" />,
      title: "Photo Analysis",
      description: "Our AI analyzes your vehicle photos to provide a more accurate condition assessment."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: "Market Insights",
      description: "Understand market trends and get selling recommendations for the best timing."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Premium Reports",
      description: "Unlock detailed vehicle history, CARFAX integration, and comprehensive PDF reports."
    }
  ];

  return (
    <motion.div 
      className="container mx-auto py-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div className="max-w-3xl mx-auto text-center mb-16" variants={itemVariants}>
        <motion.h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent" variants={itemVariants}>
          Car Detective
        </motion.h1>
        <motion.p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto" variants={itemVariants}>
          Your trusted source for accurate vehicle valuations and automotive insights.
        </motion.p>
        <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
          <Link to="/lookup/vin">
            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-base">
              Get Free Valuation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/premium">
            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-6 text-base">
              Premium Features
            </Button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            variants={featureVariants}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA Section */}
      <motion.div 
        className="mt-24 text-center"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="bg-gradient-to-r from-primary/10 to-blue-500/10 p-8 rounded-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to discover your vehicle's value?</h2>
          <p className="text-lg mb-6">Get started with a free valuation in less than 2 minutes.</p>
          <Link to="/lookup/vin">
            <Button size="lg" className="px-8">
              Start Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
