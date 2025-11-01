import React from 'react';
import { useTranslation } from 'next-i18next';

const LoadingSpinner: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex flex-col items-center justify-center py-16 my-8">
      <div className="relative w-32 h-32 mb-6">
        <div className="absolute top-0 left-0 w-full h-full border-8 border-primary-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-8 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800 mb-2">
          {t('loading.generating')}
        </p>
        <p className="text-gray-600">
          {t('loading.pleaseWait')}
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;





