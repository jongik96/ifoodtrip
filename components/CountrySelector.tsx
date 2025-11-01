import React from 'react';
import { useTranslation } from 'next-i18next';
import { Country } from '@/types/database';

interface CountrySelectorProps {
  selectedCountry: Country | null;
  onSelect: (country: Country) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onSelect }) => {
  const { t } = useTranslation('common');

  const countries: Array<{ code: Country; name: string; flag: string; description: string }> = [
    {
      code: 'korea',
      name: t('countries.korea'),
      flag: '🇰🇷',
      description: t('countries.koreaDesc'),
    },
    {
      code: 'japan',
      name: t('countries.japan'),
      flag: '🇯🇵',
      description: t('countries.japanDesc'),
    },
    {
      code: 'spain',
      name: t('countries.spain'),
      flag: '🇪🇸',
      description: t('countries.spainDesc'),
    },
    {
      code: 'italy',
      name: t('countries.italy'),
      flag: '🇮🇹',
      description: t('countries.italyDesc'),
    },
    {
      code: 'india',
      name: t('countries.india'),
      flag: '🇮🇳',
      description: t('countries.indiaDesc'),
    },
    {
      code: 'turkey',
      name: t('countries.turkey'),
      flag: '🇹🇷',
      description: t('countries.turkeyDesc'),
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {t('recipe.selectCountry')}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {countries.map((country) => (
          <button
            key={country.code}
            onClick={() => onSelect(country.code)}
            className={`p-6 rounded-xl border-4 transition-all text-left ${
              selectedCountry === country.code
                ? 'border-primary-600 bg-primary-50 shadow-lg scale-105'
                : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
            }`}
          >
            <div className="text-5xl mb-2">{country.flag}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{country.name}</h3>
            <p className="text-sm text-gray-600">{country.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CountrySelector;


