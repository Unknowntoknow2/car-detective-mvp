
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProfessionalCard, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/enhanced/ProfessionalCard';
import { ProfessionalButton } from '@/components/ui/enhanced/ProfessionalButton';
import { FeatureSection } from '@/components/ui/enhanced/FeatureSection';
import { 
  Car, 
  FileText, 
  TrendingUp, 
  BarChart, 
  Clock, 
  Award,
  Search,
  History
} from 'lucide-react';

const DashboardRouter = () => {
  const quickActions = [
    {
      icon: <Search className="w-6 h-6" />,
      title: 'New Valuation',
      description: 'Start a new vehicle valuation',
      action: () => window.location.href = '/',
    },
    {
      icon: <History className="w-6 h-6" />,
      title: 'My Valuations',
      description: 'View your saved valuations',
      action: () => window.location.href = '/saved-valuations',
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Premium Features',
      description: 'Upgrade to premium services',
      action: () => window.location.href = '/premium',
    },
  ];

  const features = [
    {
      icon: <Car className="w-8 h-8" />,
      title: 'Vehicle Management',
      description: 'Track and manage all your vehicle valuations in one place with detailed history and insights.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Market Tracking',
      description: 'Monitor market trends and get alerts on value changes for your tracked vehicles.',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Report History',
      description: 'Access all your previous valuation reports and download them anytime.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container py-8 space-y-8">
        {/* Welcome Header */}
        <ProfessionalCard variant="premium" className="animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl gradient-text">Welcome to Your Dashboard</CardTitle>
            <CardDescription className="text-lg">
              Manage your vehicle valuations, track market trends, and access premium features.
            </CardDescription>
          </CardHeader>
        </ProfessionalCard>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <ProfessionalCard 
              key={index} 
              variant="elevated" 
              interactive
              className="animate-fade-in group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={action.action}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {action.icon}
                </div>
                <CardTitle className="text-xl">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </ProfessionalCard>
          ))}
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Valuations', value: '12', icon: <Car className="w-5 h-5" /> },
            { label: 'Premium Reports', value: '3', icon: <Award className="w-5 h-5" /> },
            { label: 'This Month', value: '5', icon: <Clock className="w-5 h-5" /> },
            { label: 'Avg. Confidence', value: '94%', icon: <BarChart className="w-5 h-5" /> },
          ].map((stat, index) => (
            <ProfessionalCard 
              key={index} 
              variant="ghost"
              className="animate-fade-in text-center"
              style={{ animationDelay: `${(index + 3) * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  {stat.icon}
                  <span className="text-2xl font-bold text-primary">{stat.value}</span>
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </ProfessionalCard>
          ))}
        </div>

        {/* Features Overview */}
        <FeatureSection
          title="Dashboard Features"
          description="Everything you need to manage your vehicle portfolio and make informed decisions."
          features={features}
          className="bg-transparent py-12"
        />

        {/* Call to Action */}
        <ProfessionalCard variant="outline" className="text-center animate-fade-in">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Create your first valuation or explore our premium features for advanced insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ProfessionalButton 
                variant="premium" 
                size="lg"
                onClick={() => window.location.href = '/'}
                icon={<Search className="w-5 h-5" />}
              >
                New Valuation
              </ProfessionalButton>
              <ProfessionalButton 
                variant="outline" 
                size="lg"
                onClick={() => window.location.href = '/premium'}
                icon={<Award className="w-5 h-5" />}
              >
                Explore Premium
              </ProfessionalButton>
            </div>
          </CardContent>
        </ProfessionalCard>
      </div>
    </div>
  );
};

export default DashboardRouter;
