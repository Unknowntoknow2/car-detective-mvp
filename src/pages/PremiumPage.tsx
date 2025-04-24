
import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { VinDecoderForm } from '@/components/lookup/VinDecoderForm';
import { PlateDecoderForm } from '@/components/lookup/PlateDecoderForm';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { 
  BreadcrumbPath, 
  DesignCard, 
  FeatureItem, 
  SectionHeader 
} from '@/components/ui/design-system';
import { 
  CarFront, 
  FileText, 
  Search, 
  Award, 
  TrendingUp, 
  BarChart4, 
  ShieldCheck, 
  FileBarChart,
  Zap,
  Database,
  ClipboardCheck,
  Car,
  BadgeCheck,
  History,
  FileLineChart,
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConditionSliderWithTooltip } from '@/components/valuation/ConditionSliderWithTooltip';
import { AccidentHistoryInput } from '@/components/valuation/AccidentHistoryInput';
import { FeaturesSelector } from '@/components/valuation/FeaturesSelector';
import { ZipMarketAnalysis } from '@/components/valuation/ZipMarketAnalysis';
import { PhotoUploader } from '@/components/valuation/PhotoUploader';

export default function PremiumPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  // State for new form fields
  const [conditionValue, setConditionValue] = useState(75);
  const [zipCode, setZipCode] = useState('');
  const [hasAccidents, setHasAccidents] = useState('no');
  const [accidentCount, setAccidentCount] = useState('');
  const [accidentSeverity, setAccidentSeverity] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize coordinates between -1 and 1
      const normalizedX = Math.min(Math.max((e.clientX - centerX) / (rect.width / 2), -1), 1);
      const normalizedY = Math.min(Math.max((e.clientY - centerY) / (rect.height / 2), -1), 1);
      
      // Apply subtle rotation (max 3 degrees)
      setCardRotation({
        x: normalizedY * 3,
        y: -normalizedX * 3
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {/* Hero Section */}
        <div className="bg-gradient-primary py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] opacity-10"></div>
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
            <BreadcrumbPath 
              className="text-white/70 mb-8" 
              items={[
                { label: 'Home', href: '/' },
                { label: 'Premium Valuation' }
              ]}
            />
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge className="bg-white/20 text-white hover:bg-white/30 mb-2">CARFAX® Included</Badge>
                <SectionHeader
                  title="Premium Vehicle Valuation"
                  description="Unlock comprehensive insights with our professional-grade valuation service that combines market data with accident history"
                  variant="gradient"
                  className="text-white"
                  size="lg"
                />
                
                <ul className="space-y-4 mt-8">
                  {[
                    "Complete CARFAX® accident and service history analysis",
                    "Dealer network price comparison across your area",
                    "12-month value forecast with market trend analysis",
                    "Personalized PDF report with detailed breakdown"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                        <Check3DIcon className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <Button 
                    onClick={scrollToForm}
                    size="lg"
                    className="button-3d"
                  >
                    Start Premium Valuation
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={scrollToFeatures}
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              
              <div className="relative hidden md:block preserve-3d">
                <div 
                  ref={cardRef}
                  className="relative preserve-3d transition-all duration-200 ease-out transform"
                  style={{
                    transform: `perspective(1000px) rotateX(${cardRotation.x}deg) rotateY(${cardRotation.y}deg)`
                  }}
                >
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-2xl transform -rotate-3 z-0"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary-dark/20 to-transparent rounded-2xl transform rotate-3 z-0"></div>
                  <DesignCard 
                    variant="glass" 
                    className="relative z-10 shadow-xl border-white/30 bg-white/80"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                          <FileBarChart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Premium Report</h3>
                          <p className="text-xs text-text-secondary">CARFAX® Integration</p>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium border border-success/20">
                        +25% accuracy
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-surface-dark/50 border border-border/50">
                          <h4 className="text-sm font-medium mb-1">Estimated Value</h4>
                          <p className="text-2xl font-bold text-primary">$24,350</p>
                        </div>
                        <div className="p-4 rounded-lg bg-surface-dark/50 border border-border/50">
                          <h4 className="text-sm font-medium mb-1">Confidence</h4>
                          <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold">95%</p>
                            <BadgeCheck className="h-5 w-5 text-success" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-border/50 bg-gradient-card">
                        <h4 className="text-sm font-medium mb-3 flex items-center">
                          <History className="h-4 w-4 mr-2 text-primary" />
                          CARFAX® History
                        </h4>
                        <div className="space-y-2">
                          <div className="h-2 w-full bg-surface-dark rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-gradient-primary rounded-full"></div>
                          </div>
                          <div className="flex justify-between text-xs text-text-secondary">
                            <span>3 Previous Owners</span>
                            <span>No Accidents</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 rounded-lg border border-border/50 bg-gradient-card">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <FileLineChart className="h-4 w-4 mr-2 text-primary" />
                          Market Position
                        </h4>
                        <div className="h-24 bg-surface-dark/30 rounded-lg flex items-end p-2">
                          {[30, 45, 80, 65, 90, 75, 85].map((height, i) => (
                            <div 
                              key={i}
                              className="h-full flex-1 flex items-end mx-0.5"
                            >
                              <div 
                                className={`w-full rounded-t-sm ${i === 4 ? 'bg-primary' : 'bg-border-dark/80'}`}
                                style={{ height: `${height}%` }}
                              ></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DesignCard>
                </div>
              </div>
            </div>
          </div>
          
          {/* Curved separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
              <path d="M0 0L48 8C96 16 192 32 288 37.3C384 43 480 37 576 32C672 27 768 21 864 24C960 27 1056 37 1152 42.7C1248 48 1344 48 1392 48H1440V80H0V0Z" fill="#F9FAFB"/>
            </svg>
          </div>
        </div>
        
        {/* Value Proposition Section */}
        <section ref={featuresRef} className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Why Choose Premium Valuation"
              description="Get the most accurate and comprehensive vehicle valuation with our premium service"
              align="center"
              className="mb-16"
            />
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Award className="h-5 w-5" />,
                  title: "CARFAX® Integration",
                  description: "Complete vehicle history analysis for superior accuracy in valuations"
                },
                {
                  icon: <TrendingUp className="h-5 w-5" />,
                  title: "Market Trend Analysis",
                  description: "Future value projections based on historical market data"
                },
                {
                  icon: <BarChart4 className="h-5 w-5" />,
                  title: "Dealer Price Comparison",
                  description: "See how your vehicle compares to current dealer listings"
                },
                {
                  icon: <ShieldCheck className="h-5 w-5" />,
                  title: "Confidence Scoring",
                  description: "Know exactly how accurate your valuation is with confidence metrics"
                },
                {
                  icon: <Database className="h-5 w-5" />,
                  title: "Comprehensive Data",
                  description: "Leveraging millions of data points for precise valuations"
                },
                {
                  icon: <ClipboardCheck className="h-5 w-5" />,
                  title: "Detailed Reports",
                  description: "Professional PDF reports with complete valuation breakdown"
                }
              ].map((feature, i) => (
                <DesignCard 
                  key={i} 
                  variant="outline"
                  className="card-3d hover:border-primary/30 hover:bg-primary-light/20 transition-all"
                >
                  <FeatureItem
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                  />
                </DesignCard>
              ))}
            </div>
          </div>
        </section>
        
        {/* How it compares section */}
        <section className="py-20 px-4 bg-gradient-to-b from-surface to-surface-dark">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="How Premium Compares"
              description="See the difference between our free and premium valuation services"
              align="center"
              className="mb-16"
            />
            
            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <div className="rounded-xl overflow-hidden border border-border bg-white">
                <div className="bg-surface-dark p-6">
                  <h3 className="text-xl font-semibold">Free Valuation</h3>
                  <p className="text-text-secondary mt-1">Basic vehicle valuation</p>
                </div>
                <div className="p-6">
                  <p className="text-3xl font-bold">$0</p>
                  <ul className="mt-6 space-y-3">
                    {[
                      { feature: "Basic market value estimate", included: true },
                      { feature: "VIN and license plate lookup", included: true },
                      { feature: "Manual entry option", included: true },
                      { feature: "Simple condition assessment", included: true },
                      { feature: "CARFAX® history report", included: false },
                      { feature: "Accident history analysis", included: false },
                      { feature: "Market trend forecast", included: false },
                      { feature: "Dealer network comparison", included: false },
                      { feature: "Professional PDF report", included: false }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        {item.included ? (
                          <CheckCircleIcon className="h-5 w-5 text-success flex-shrink-0" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-text-tertiary flex-shrink-0" />
                        )}
                        <span className={item.included ? "text-text-primary" : "text-text-tertiary"}>
                          {item.feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-8">
                    Start Free Valuation
                  </Button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden border-2 border-primary bg-white relative">
                <div className="absolute top-6 right-6">
                  <Badge className="bg-primary text-white">Recommended</Badge>
                </div>
                <div className="bg-primary/10 p-6">
                  <h3 className="text-xl font-semibold text-primary">Premium Valuation</h3>
                  <p className="text-text-secondary mt-1">Complete vehicle history and premium insights</p>
                </div>
                <div className="p-6">
                  <p className="text-3xl font-bold">$29.99</p>
                  <ul className="mt-6 space-y-3">
                    {[
                      { feature: "Basic market value estimate", included: true },
                      { feature: "VIN and license plate lookup", included: true },
                      { feature: "Manual entry option", included: true },
                      { feature: "Advanced condition assessment", included: true },
                      { feature: "CARFAX® history report", included: true, highlight: true },
                      { feature: "Accident history analysis", included: true, highlight: true },
                      { feature: "Market trend forecast", included: true, highlight: true },
                      { feature: "Dealer network comparison", included: true, highlight: true },
                      { feature: "Professional PDF report", included: true, highlight: true }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircleIcon className={`h-5 w-5 flex-shrink-0 ${item.highlight ? 'text-primary' : 'text-success'}`} />
                        <span className={item.highlight ? "text-text-primary font-medium" : "text-text-primary"}>
                          {item.feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-8" onClick={scrollToForm}>
                    Get Premium Valuation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Premium Alert */}
        <section className="py-16 px-4 bg-warning-light/30">
          <div className="max-w-5xl mx-auto">
            <DesignCard 
              variant="premium" 
              className="border-warning/20 bg-warning-light/50 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-warning/5 rounded-full transform translate-x-20 -translate-y-20 z-0"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-warning/5 rounded-full transform -translate-x-20 translate-y-20 z-0"></div>
              
              <div className="relative z-10 flex items-start gap-6">
                <div className="rounded-xl bg-warning-light p-3 text-warning mt-0.5 flex-shrink-0">
                  <HeartHandshake className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-warning-hover mb-3">Accident History Matters</h3>
                  <p className="text-text-secondary">
                    Our premium valuation includes verified CARFAX® accident and vehicle history data
                    for up to <strong>30% more accurate</strong> valuation compared to basic estimates. 
                    This can make a significant difference when negotiating with dealers or private buyers.
                  </p>
                  <div className="mt-4 pt-4 border-t border-warning/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { figure: "30%", label: "Greater accuracy" },
                      { figure: "12K+", label: "Dealerships" },
                      { figure: "3.2M", label: "Valuations/month" }
                    ].map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-xl font-bold text-warning-hover">{stat.figure}</p>
                        <p className="text-sm text-text-secondary">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DesignCard>
          </div>
        </section>

        {/* Main Lookup Form */}
        <section ref={formRef} className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="Start Your Premium Valuation"
              description="Choose your preferred lookup method below"
              className="mb-12"
            />
            
            <Tabs defaultValue="manual" className="space-y-8">
              <TabsList className="grid w-full grid-cols-3 h-auto p-1 rounded-lg">
                <TabsTrigger 
                  value="vin" 
                  className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <CarFront className="w-5 h-5" />
                    <span>VIN Lookup</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="plate" 
                  className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Search className="w-5 h-5" />
                    <span>Plate Lookup</span>
                  </div>
                </TabsTrigger>
                
                <TabsTrigger 
                  value="manual" 
                  className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <FileText className="w-5 h-5" />
                    <span>Manual Entry</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vin">
                <Card className="border-2 border-primary/20 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <SectionHeader
                      title="VIN Lookup"
                      description="Enter your Vehicle Identification Number for detailed information"
                      size="md"
                    />
                  </CardHeader>
                  <CardContent className="pt-8">
                    <VinDecoderForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plate">
                <Card className="border-2 border-primary/20 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <SectionHeader
                      title="License Plate Lookup"
                      description="Look up vehicle details using a license plate number"
                      size="md"
                    />
                  </CardHeader>
                  <CardContent className="pt-8">
                    <PlateDecoderForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="manual">
                <Card className="border-2 border-primary/20 shadow-xl rounded-xl overflow-hidden">
                  <CardHeader className="bg-primary/5 border-b border-border">
                    <SectionHeader
                      title="Manual Entry"
                      description="Enter vehicle details manually for a custom valuation"
                      size="md"
                    />
                  </CardHeader>
                  <CardContent className="pt-8 space-y-8">
                    <ManualEntryForm 
                      onSubmit={async (data) => {
                        try {
                          setIsSubmitting(true);
                          const response = await fetch("/functions/car-price-prediction", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              ...data,
                              includeCarfax: true
                            })
                          });
                          
                          if (!response.ok) throw new Error('Failed to get valuation');
                          
                          const result = await response.json();
                          if (result?.id) {
                            navigate(`/valuation/${result.id}`);
                          }
                        } catch (error) {
                          console.error('Premium valuation error:', error);
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      submitButtonText="Get Premium Valuation with CARFAX"
                      isPremium={true}
                      isLoading={isSubmitting}
                    />
                    
                    {/* New components */}
                    <div className="border-t border-border pt-8">
                      <div className="grid gap-8">
                        {/* Photo Uploader Component */}
                        <PhotoUploader disabled={isSubmitting} />
                        
                        {/* Condition Slider */}
                        <ConditionSliderWithTooltip 
                          value={conditionValue}
                          onChange={setConditionValue}
                          disabled={isSubmitting}
                        />
                        
                        {/* ZIP-based Market Analysis */}
                        <ZipMarketAnalysis
                          zipCode={zipCode}
                          setZipCode={setZipCode}
                          disabled={isSubmitting}
                        />
                        
                        {/* Premium Features Component */}
                        <FeaturesSelector
                          selectedFeatures={selectedFeatures}
                          onFeaturesChange={setSelectedFeatures}
                          disabled={isSubmitting}
                        />
                        
                        {/* Accident History Input */}
                        <AccidentHistoryInput
                          hasAccidents={hasAccidents}
                          setHasAccidents={setHasAccidents}
                          accidentCount={accidentCount}
                          setAccidentCount={setAccidentCount}
                          accidentSeverity={accidentSeverity}
                          setAccidentSeverity={setAccidentSeverity}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Customer Testimonials */}
        <section className="py-20 px-4 bg-gradient-to-b from-surface to-surface-dark">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              title="What Our Customers Say"
              description="Thousands of vehicle owners trust our premium valuations"
              align="center"
              className="mb-12"
            />
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "The premium report helped me sell my car for $3,200 more than the dealer initially offered. The CARFAX integration proved my car's excellent history.",
                  author: "Michael T.",
                  role: "BMW 3 Series Owner",
                  image: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "I was skeptical at first, but the premium valuation was spot on. The dealer matched the valuation price when I showed them the detailed report.",
                  author: "Sarah J.",
                  role: "Toyota Highlander Owner",
                  image: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "The accident history analysis in the premium report saved me from buying a car with hidden damage. Best $30 I've ever spent!",
                  author: "David R.",
                  role: "Ford F-150 Buyer",
                  image: "https://randomuser.me/api/portraits/men/62.jpg"
                }
              ].map((testimonial, i) => (
                <DesignCard 
                  key={i} 
                  variant="glass"
                  className="bg-white shadow-lg border border-border/60"
                >
                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-warning">★</span>
                      ))}
                    </div>
                    <p className="italic text-text-secondary mb-6 flex-1">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <div className="h-12 w-12 rounded-full overflow-hidden bg-surface">
                        <img src={testimonial.image} alt={testimonial.author} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium">{testimonial.author}</h4>
                        <p className="text-sm text-text-secondary">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </DesignCard>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

// 3D effect check icon
const Check3DIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="3" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// Check circle icon
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// X circle icon
const XCircleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);
