
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/marketing/AnnouncementBar';
import { useTranslation } from 'react-i18next';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-slate-50">
      <AnnouncementBar />
      <Navbar />
      <main className="container max-w-4xl py-12 px-4">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
            <p className="mb-2">We collect the following data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account information (email, name)</li>
              <li>Vehicle information (VIN, license plate, make, model, year)</li>
              <li>Usage data and analytics</li>
              <li>Cookies and local storage data</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide vehicle valuation services</li>
              <li>To improve our services based on usage patterns</li>
              <li>To authenticate users and maintain account security</li>
              <li>To communicate about your account and our services</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Third-Party Services</h2>
            <p className="mb-2">We utilize the following third-party services:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Supabase (authentication and database)</li>
              <li>CARFAX (vehicle history information)</li>
              <li>Analytics providers for usage tracking</li>
              <li>Payment processors for premium services</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Your Rights</h2>
            <p className="mb-2">You have the following rights regarding your data:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Request access to your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability (receiving your data in a structured format)</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Cookie Policy</h2>
            <p className="mb-2">We use cookies for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Essential cookies: These are necessary for the website to function properly</li>
              <li>Preference cookies: These remember your settings and preferences</li>
              <li>Analytics cookies: These help us understand how visitors interact with our site</li>
              <li>Marketing cookies: These track your online activity to help deliver relevant advertising</li>
            </ul>
            <p className="mt-4">You can manage your cookie preferences through our Cookie Consent Banner or by clearing cookies in your browser settings.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
            <p>If you have any questions about our privacy practices, please contact us at privacy@carvaluationapp.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
