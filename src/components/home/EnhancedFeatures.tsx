
import { motion } from "framer-motion";
import { Car, ChartBar, Shield, FileBarChart } from "lucide-react";
import { DesignCard, SectionHeader } from "../ui/design-system";

const features = [
  {
    icon: <Car className="h-6 w-6" />,
    title: "Comprehensive Protection",
    description: "Ensure your property is safeguarded with comprehensive insurance coverage tailored to your specific needs."
  },
  {
    icon: <ChartBar className="h-6 w-6" />,
    title: "Advanced Analytics",
    description: "Get detailed insights into market trends and valuation patterns with our advanced analytics engine."
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Secure Data Storage",
    description: "Your information is securely stored and protected with state-of-the-art encryption technology."
  },
  {
    icon: <FileBarChart className="h-6 w-6" />,
    title: "Real-Time Updates",
    description: "Stay informed with real-time market data and instant valuations based on current conditions."
  }
];

export function EnhancedFeatures() {
  return (
    <section className="py-24 bg-gradient-to-b from-surface to-surface-dark">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Key Features"
          description="Our platform offers a comprehensive set of features designed to provide accurate vehicle valuations"
          align="center"
          size="lg"
          className="mb-16"
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <DesignCard 
                variant="glass"
                className="h-full card-3d hover:border-primary/30 transition-all"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </div>
              </DesignCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
