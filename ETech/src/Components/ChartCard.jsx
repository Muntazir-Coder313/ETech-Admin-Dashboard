import React from 'react';

const ChartCard = ({ title, children }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-800 dark:text-white mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default ChartCard;