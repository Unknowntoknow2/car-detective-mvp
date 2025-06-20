
import React from "react";
import { Search, Star, Shield, Clock } from "lucide-react";

export function CarFinderQaherHeader() {
  return (
    <div className="text-center mb-12">
      <div className="flex justify-center items-center mb-4">
        <Search className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-4xl font-bold text-gray-900">
          Car Detective™
        </h1>
      </div>
      
      <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
        Get instant, accurate vehicle valuations powered by AI and real market data
      </p>
      
      <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
        <div className="flex items-center">
          <Star className="h-4 w-4 text-yellow-500 mr-1" />
          <span>Trusted by 10,000+ users</span>
        </div>
        <div className="flex items-center">
          <Shield className="h-4 w-4 text-green-500 mr-1" />
          <span>Secure & Private</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 text-blue-500 mr-1" />
          <span>Instant Results</span>
        </div>
      </div>
    </div>
  );
}
