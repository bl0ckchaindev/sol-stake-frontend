"use client";

import { countdownConfig } from '@/lib/countdown-config';
import { ComingSoon } from '@/components/coming-soon';
import { ReactNode } from 'react';

interface ComingSoonWrapperProps {
  children: ReactNode;
  pageType: 'dashboard' | 'mevTracker' | 'referrals';
}

export function ComingSoonWrapper({ children, pageType }: ComingSoonWrapperProps) {
  const { enabledPages } = countdownConfig;
  
  // Check if this page should show coming soon content
  const shouldShowComingSoon = enabledPages[pageType];

  if (shouldShowComingSoon) {
    return <ComingSoon targetDate={countdownConfig.targetDate} />;
  }

  // Return original page content if coming soon is disabled
  return <>{children}</>;
}