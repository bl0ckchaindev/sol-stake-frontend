"use client";

import { useState, useEffect } from 'react';
import { useTranslation } from '@/components/translation-context';
import { MotionWrapper } from '@/components/motion-wrapper';
import { Card } from '@/components/ui/card';
import { Bot } from 'lucide-react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isLaunched: boolean;
}

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: false });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isLaunched: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isLaunched: false
      };
    };

    // Calculate immediately
    setTimeLeft(calculateTimeLeft());

    // Set up interval for updates
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, '0');
  };

  if (timeLeft.isLaunched) {
    return (
      <MotionWrapper type="fadeIn" delay={0.1}>
        <Card className="bg-gradient-to-br from-success/10 to-accent/10 border-success/20 p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Bot className="w-12 h-12 text-success animate-pulse" />
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-success mb-2">
            {t('countdown.launched')}
          </h2>
          <p className="text-muted-foreground">
            {t('countdown.launchedSubtitle')}
          </p>
        </Card>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper type="fadeIn" delay={0.1}>
      <Card className="bg-card/50 backdrop-blur-sm border-border p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold mb-2">{t('countdown.title')}</h3>
          <p className="text-muted-foreground">{t('countdown.untilLaunch')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MotionWrapper type="scale" delay={0.2} className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-border">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                {formatNumber(timeLeft.days)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {t('countdown.days')}
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper type="scale" delay={0.3} className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-border">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                {formatNumber(timeLeft.hours)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {t('countdown.hours')}
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper type="scale" delay={0.4} className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-border">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                {formatNumber(timeLeft.minutes)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {t('countdown.minutes')}
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper type="scale" delay={0.5} className="text-center">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-4 border border-border">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                {formatNumber(timeLeft.seconds)}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wide">
                {t('countdown.seconds')}
              </div>
            </div>
          </MotionWrapper>
        </div>
      </Card>
    </MotionWrapper>
  );
}