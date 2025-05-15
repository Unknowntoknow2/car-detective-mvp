
import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <div className="text-primary font-bold text-xl flex items-center">
        Car Detective™
      </div>
    </Link>
  );
};

export default Logo;
