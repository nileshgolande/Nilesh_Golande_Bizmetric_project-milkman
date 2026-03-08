import React from 'react';

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = 'w-full',
  height = 'h-4',
  className = '',
}) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${width} ${height} ${className}`}
    ></div>
  );
};

export default LoadingSkeleton;
