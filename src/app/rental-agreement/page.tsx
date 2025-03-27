import React from 'react';
import RentalAgreement from '@/pages/RentalAgreement';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Rental Agreement Generator - Dreamy Haven Explorer',
  description: 'Generate, sign, and analyze rental agreements with our AI-powered tools.',
};

export default function RentalAgreementPage() {
  return <RentalAgreement />;
} 