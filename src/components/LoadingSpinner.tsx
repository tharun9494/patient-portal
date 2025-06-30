import React from 'react';
import { Heart } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} animate-pulse-gentle`}>
        <div className="relative">
          <Heart className="h-full w-full text-primary-500" fill="currentColor" />
          <div className="absolute inset-0 animate-ping">
            <Heart className="h-full w-full text-primary-300" fill="currentColor" />
          </div>
        </div>
      </div>
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-fade-in">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;