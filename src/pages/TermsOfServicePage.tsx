
import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="bg-white shadow-md rounded-lg p-6 prose max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        
        <h2>2. Use License</h2>
        <p>
          Permission is granted to temporarily use this website for personal, non-commercial transitory viewing only.
        </p>
        
        <h2>3. Disclaimer</h2>
        <p>
          The materials on this website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaims and negates all other warranties.
        </p>
        
        <h2>4. Limitations</h2>
        <p>
          In no event shall we or our suppliers be liable for any damages arising out of the use or inability to use the materials on this website.
        </p>
        
        <h2>5. Revisions and Errata</h2>
        <p>
          The materials appearing on this website could include technical, typographical, or photographic errors.
        </p>
        
        <h2>6. Links</h2>
        <p>
          We have not reviewed all of the sites linked to this website and are not responsible for the contents of any such linked site.
        </p>
        
        <h2>7. Site Terms of Use Modifications</h2>
        <p>
          We may revise these terms of use for this website at any time without notice.
        </p>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
