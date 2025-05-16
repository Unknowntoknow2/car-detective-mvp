
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { LockIcon, FileBarChart, Shield, TrendingUp, Camera, Award, FileText, Zap, BadgeDollarSign } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { PremiumTabs } from '@/components/premium/PremiumTabs';
import { useInView } from 'react-intersection-observer';

// PREMIUM_PAGE_ELEVATED_V1
export const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const [zipCode, setZipCode] = useState('');
  const scrollToFormRef = useRef<HTMLDivElement>(null);
  
  // Animation refs for scroll view
  const [featureRef, featureInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [pdfRef, pdfInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleGetStarted = () => {
    navigate('/valuation');
  };
  
  const scrollToForm = () => {
    scrollToFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFeatures = () => {
    featureRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Card 3D effect
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!heroRef.current) return;
      
      const { left, top, width, height } = heroRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const rotateY = ((event.clientX - centerX) / width) * 5;
      const rotateX = ((centerY - event.clientY) / height) * 5;
      
      setCardRotation({ x: rotateX, y: rotateY });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section ref={heroRef} className="py-16 md:py-24 px-4 relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
        <Container className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-1.5 bg-green-100 px-3 py-1 rounded-full text-green-700 text-sm font-medium mb-2"
                >
                  <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                    <BadgeDollarSign className="h-3 w-3 mr-1" />
                    $44 CARFAX® Value Included
                  </Badge>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  Know Your Car's True Worth — <span className="text-primary">Backed by AI + CARFAX®</span>
                </h1>
                <p className="text-xl text-gray-600 mt-4">
                  Pay once. Sell smart. Get premium insights, market forecasts, and a complete CARFAX® report.
                </p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 mt-8"
              >
                <Button 
                  size="lg" 
                  className="gap-2 text-base font-medium"
                  onClick={scrollToForm}
                >
                  Start My Premium Valuation
                  <TrendingUp className="h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2 text-base"
                  onClick={scrollToFeatures}
                >
                  See What's Included
                </Button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.5 }}
                className="mt-8 flex items-center gap-3"
              >
                <div className="flex items-center gap-1.5 text-amber-700">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  Trusted by <span className="font-medium">10,000+</span> vehicle sellers
                </span>
              </motion.div>
            </motion.div>
            
            <div className="relative hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-8 right-4 z-20 transform translate-x-0 translate-y-0"
              >
                <Card className="w-full max-w-md border-2 border-primary/20 bg-white/90 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-3 rounded-full bg-primary flex items-center justify-center">
                        <FileBarChart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">Premium Analysis</h3>
                        <p className="text-sm text-muted-foreground">CARFAX® Integration</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-muted/30 border border-border rounded-lg p-4">
                          <h4 className="text-sm text-muted-foreground font-medium mb-1">Estimated Value</h4>
                          <p className="text-2xl font-bold text-primary">$24,350</p>
                        </div>
                        <div className="bg-muted/30 border border-border rounded-lg p-4">
                          <h4 className="text-sm text-muted-foreground font-medium mb-1">Confidence</h4>
                          <p className="text-2xl font-bold text-green-600">95%</p>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Feature Adjustments</span>
                          <span className="font-medium text-green-600">+$1,240</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full w-3/4 bg-gradient-to-r from-primary to-green-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/20 border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">CARFAX® Highlights</h4>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Clean
                          </Badge>
                        </div>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-primary" />
                            <span>2 owners, no accidents</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-primary" />
                            <span>Regular service history</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-primary" />
                            <span>Clean title verified</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute bottom-8 left-12 z-10"
                style={{
                  perspective: "1000px",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  style={{
                    transform: `rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`,
                    transition: "transform 0.1s ease-out",
                  }}
                  className="w-full max-w-sm"
                >
                  <Card className="border-2 border-border bg-white/80 backdrop-blur-sm shadow-lg rounded-xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-full bg-green-100 flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">Market Forecast</h3>
                          <p className="text-xs text-muted-foreground">12-Month Projection</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="h-32 bg-muted/30 rounded-lg border border-border flex items-center justify-center p-4">
                          <svg className="w-full h-full" viewBox="0 0 200 80">
                            <path
                              d="M0,40 C30,10 60,60 90,40 C120,20 150,80 180,60 L180,80 L0,80 Z"
                              fill="rgba(59, 130, 246, 0.1)"
                            />
                            <path
                              d="M0,40 C30,10 60,60 90,40 C120,20 150,80 180,60"
                              fill="none"
                              stroke="#3b82f6"
                              strokeWidth="2"
                            />
                          </svg>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Best time to sell</span>
                          <span className="font-medium text-primary">3 months</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section ref={featureRef} className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Report Features</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Get the complete picture of your vehicle's value with our comprehensive premium report, backed by AI technology and industry-leading data.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featureInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="hover-lift premium-shine"
              >
                <Card className="h-full border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* PDF Preview Section */}
      <section ref={pdfRef} className="py-16 bg-gray-50">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={pdfInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold mb-4">Professional PDF Report</h2>
                <p className="text-gray-600 mb-6">
                  Get a comprehensive, printable report with detailed analysis and market data to share with potential buyers or your insurance company.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full mt-0.5">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Complete CARFAX® History</h4>
                      <p className="text-gray-500 text-sm">Accident history, service records, and ownership details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full mt-0.5">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Market Value Analysis</h4>
                      <p className="text-gray-500 text-sm">Detailed breakdown of factors affecting your vehicle's value.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-full mt-0.5">
                      <Zap className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">12-Month Value Forecast</h4>
                      <p className="text-gray-500 text-sm">Predicted value trends to help you time your sale perfectly.</p>
                    </div>
                  </div>
                </div>
                <Button
                  className="mt-8 gap-2"
                  onClick={scrollToForm}
                >
                  Unlock Full Report
                  <LockIcon size={16} />
                </Button>
                <p className="text-xs text-gray-500 mt-2">Includes title check, photos, forecasts & more</p>
              </motion.div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={pdfInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative max-w-md mx-auto">
                  <div className="relative overflow-hidden rounded-lg border-4 border-white shadow-xl">
                    <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-10">
                      <div className="bg-primary/90 text-white py-2 px-4 rounded-full font-bold transform -rotate-12 shadow-lg">
                        PREMIUM ONLY
                      </div>
                    </div>
                    <img 
                      src="/images/report-preview.png" 
                      alt="PDF Report Preview" 
                      className="w-full"
                      onError={(e) => { 
                        e.currentTarget.src = "https://placehold.co/600x800/e2e8f0/64748b?text=Premium+Valuation+Report";
                      }} 
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-primary text-white p-3 rounded-full shadow-lg">
                    <FileText className="h-6 w-6" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* AI Photo Scoring Section */}
      <section className="py-16 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 order-2 md:order-1">
              <div className="relative max-w-md">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src="/images/car-front.jpg" 
                      alt="Car Front" 
                      className="w-full aspect-square object-cover"
                      onError={(e) => { 
                        e.currentTarget.src = "https://placehold.co/300x300/e2e8f0/64748b?text=Front";
                      }} 
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                      Excellent
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src="/images/car-side.jpg" 
                      alt="Car Side" 
                      className="w-full aspect-square object-cover"
                      onError={(e) => { 
                        e.currentTarget.src = "https://placehold.co/300x300/e2e8f0/64748b?text=Side";
                      }} 
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                      Excellent
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src="/images/car-interior.jpg" 
                      alt="Car Interior" 
                      className="w-full aspect-square object-cover"
                      onError={(e) => { 
                        e.currentTarget.src = "https://placehold.co/300x300/e2e8f0/64748b?text=Interior";
                      }} 
                    />
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-xs py-1 px-2 rounded-full">
                      Good
                    </div>
                  </div>
                  <div className="relative rounded-lg overflow-hidden">
                    <img 
                      src="/images/car-rear.jpg" 
                      alt="Car Rear" 
                      className="w-full aspect-square object-cover"
                      onError={(e) => { 
                        e.currentTarget.src = "https://placehold.co/300x300/e2e8f0/64748b?text=Rear";
                      }} 
                    />
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs py-1 px-2 rounded-full">
                      Excellent
                    </div>
                  </div>
                </div>
                <div className="mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4 text-primary" />
                      <span className="font-medium">AI Condition Score</span>
                    </div>
                    <Badge className="bg-primary">94%</Badge>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-to-r from-green-400 to-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">AI Photo Analysis</h2>
              <p className="text-gray-600 mb-6">
                Our AI technology analyzes your vehicle photos to provide an accurate condition assessment, helping you get the most accurate valuation.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">AI-Verified Condition</h4>
                    <p className="text-gray-500 text-sm">Computer vision technology detects scratches, dents, and wear.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Higher Confidence Score</h4>
                    <p className="text-gray-500 text-sm">Photo analysis increases valuation accuracy by up to 18%.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Dealer-Ready Assessment</h4>
                    <p className="text-gray-500 text-sm">The same technology dealers use to determine trade-in value.</p>
                  </div>
                </div>
              </div>
              <Button
                className="mt-8"
                onClick={scrollToForm}
              >
                Get AI Photo Analysis
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Free vs Premium Comparison */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Free vs Premium Valuation</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              See what you're missing with the free version.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Free Valuation</h3>
                  <Badge variant="outline" className="text-gray-500">$0</Badge>
                </div>
                <ul className="space-y-3">
                  {comparisonFeatures.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        {feature.free ? (
                          <div className="h-5 w-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="h-5 w-5 bg-gray-100 rounded-full flex items-center justify-center">
                            <svg className="h-3 w-3 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <span className={feature.free ? "" : "text-gray-400"}>{feature.name}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-2 border-primary relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-bold">
                RECOMMENDED
              </div>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold">Premium Valuation</h3>
                    <p className="text-sm text-gray-500">One-time payment</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold">$29.99</div>
                    <div className="text-xs text-gray-500">Includes $44 CARFAX®</div>
                  </div>
                </div>
                <ul className="space-y-3">
                  {comparisonFeatures.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      <div className="mt-0.5 flex-shrink-0">
                        <div className="h-5 w-5 bg-primary/10 rounded-full flex items-center justify-center">
                          <svg className="h-3 w-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span>{feature.name}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-6 w-full" onClick={scrollToForm}>
                  Start Premium Valuation
                </Button>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Testimonial Section */}
      <section ref={testimonialsRef} className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              See what customers like you have to say about our premium valuation service.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full border border-gray-100 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { 
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${testimonial.name.replace(' ', '+')}&color=7F9CF5&background=EBF4FF`;
                          }} 
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <div className="flex items-center">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{testimonial.carModel}</span>
                          <span className="text-xs ml-2 text-gray-500">{testimonial.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex pb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm">{testimonial.testimonial}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Trust Row */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <Container>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Military-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">CARFAX® Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <BadgeDollarSign className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Used by 10,000+ sellers</span>
            </div>
          </div>
        </Container>
      </section>

      {/* Form Section */}
      <section ref={scrollToFormRef} id="premium-form" className="py-16 bg-white">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Your Premium Valuation</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Enter your vehicle information to get started with your comprehensive premium valuation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-6 md:p-8">
                <PremiumTabs showFreeValuation={false} />
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Floating CTA Button (Mobile Only) */}
      <div className="md:hidden fixed bottom-4 inset-x-4 z-50">
        <Button
          size="lg"
          className="w-full flex items-center justify-center shadow-lg gap-2"
          onClick={scrollToForm}
        >
          Start Premium ($29.99)
          <Badge variant="outline" className="bg-white/20 border-white/30 text-white">
            Includes CARFAX®
          </Badge>
        </Button>
      </div>
    </MainLayout>
  );
};

// Feature data
const features = [
  {
    title: "CARFAX® Report ($44 value)",
    description: "Complete vehicle history including accidents, maintenance records, and title information.",
    icon: FileText
  },
  {
    title: "AI Condition Analysis",
    description: "Advanced AI technology analyzes photos to accurately assess your vehicle's condition.",
    icon: Camera
  },
  {
    title: "Market Value Insights",
    description: "Comprehensive analysis of your vehicle's value based on current market trends.",
    icon: BadgeDollarSign
  },
  {
    title: "12-Month Forecast",
    description: "Predictive analysis of your vehicle's value over the next 12 months to time your sale perfectly.",
    icon: TrendingUp
  },
  {
    title: "Professional PDF Report",
    description: "Downloadable report with all valuation details to share with potential buyers or insurance.",
    icon: FileBarChart
  },
  {
    title: "Dealer-Level Insights",
    description: "Access the same data and insights that dealers use when making purchase decisions.",
    icon: Award
  }
];

// Comparison data
const comparisonFeatures = [
  { name: "Basic Vehicle Value Estimate", free: true },
  { name: "Make, Model, Year Identification", free: true },
  { name: "Simple Condition Assessment", free: true },
  { name: "CARFAX® Vehicle History Report", free: false },
  { name: "AI Photo Condition Analysis", free: false },
  { name: "Title & VIN Verification", free: false },
  { name: "12-Month Value Forecast", free: false },
  { name: "Professional PDF Report", free: false },
  { name: "Dealer Network Offers", free: false },
  { name: "Detailed Market Comparison", free: false }
];

// Testimonial data
const testimonials = [
  {
    name: "Michael Johnson",
    role: "Seller",
    carModel: "Tesla Model 3",
    avatar: "/images/testimonial-1.jpg",
    testimonial: "The premium valuation was spot on. I received $2,200 more than I expected by using the detailed report to negotiate with the dealer."
  },
  {
    name: "Sarah Williams",
    role: "Buyer",
    carModel: "Honda Accord",
    avatar: "/images/testimonial-2.jpg",
    testimonial: "The CARFAX® report saved me from buying a car with hidden flood damage. Best $30 I've ever spent on car shopping."
  },
  {
    name: "David Chen",
    role: "Seller",
    carModel: "BMW X5",
    avatar: "/images/testimonial-3.jpg",
    testimonial: "The AI photo analysis gave my listing credibility. Sold my car in 3 days with multiple competing offers."
  }
];

export default EnhancedHomePage;
