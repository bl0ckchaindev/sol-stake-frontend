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
  compact?: boolean;
}

export function CountdownTimer({ targetDate, compact = false }: CountdownTimerProps) {
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
      <Card className={`bg-card/50 border-border/50 backdrop-blur-xl relative overflow-hidden ${compact ? 'p-1 md:p-2' : 'p-2 md:p-4'}`}>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-accent rounded-full opacity-10 blur-3xl"></div>
        
        <div className="relative z-10">
          {!compact && (
            <div className="text-center mb-2 md:mb-4 py-2">
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground">
                {t('countdown.title')}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base">{t('countdown.untilLaunch')}</p>
            </div>
          )}
          
          {compact && (
            <div className="text-center mb-2 md:mb-4 py-1">
              <h3 className="text-base md:text-lg font-bold mb-1 text-foreground">
                {t('countdown.title')}
              </h3>
              <p className="text-muted-foreground text-xs">{t('countdown.untilLaunch')}</p>
            </div>
          )}

          <div className={`flex gap-2 justify-center md:gap-4 flex-wrap`}>
            <div className="w-[80px] h-[80px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
              <img src="/launch-clock.png" className="w-12 h-12 text-accent" />
            </div>
            <MotionWrapper type="scale" delay={0.2} className="text-center flex-shrink-0">
              <div className={`w-[80px] h-[80px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 flex-col`}>
                <div className={`font-bold text-foreground group-hover:scale-110 transition-transform duration-300 text-nowrap leading-none ${compact ? 'text-lg md:text-xl mb-1' : 'text-xl md:text-2xl lg:text-3xl mb-2'}`}>
                  {formatNumber(timeLeft.days)}
                </div>
                <div className={`text-muted-foreground uppercase tracking-wide font-medium text-nowrap ${compact ? 'text-[10px] md:text-xs leading-tight' : 'text-xs md:text-sm leading-tight'}`}>
                  {t('countdown.days')}
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper type="scale" delay={0.3} className="text-center flex-shrink-0">
              <div className={`w-[80px] h-[80px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 flex-col`}>
                <div className={`font-bold text-foreground group-hover:scale-110 transition-transform duration-300 text-nowrap leading-none ${compact ? 'text-lg md:text-xl mb-1' : 'text-xl md:text-2xl lg:text-3xl mb-2'}`}>
                  {formatNumber(timeLeft.hours)}
                </div>
                <div className={`text-muted-foreground uppercase tracking-wide font-medium text-nowrap ${compact ? 'text-[10px] md:text-xs leading-tight' : 'text-xs md:text-sm leading-tight'}`}>
                  {t('countdown.hours')}
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper type="scale" delay={0.4} className="text-center flex-shrink-0">
              <div className={`w-[80px] h-[80px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 flex-col`}>
                <div className={`font-bold text-foreground group-hover:scale-110 transition-transform duration-300 text-nowrap leading-none ${compact ? 'text-lg md:text-xl mb-1' : 'text-xl md:text-2xl lg:text-3xl mb-2'}`}>
                  {formatNumber(timeLeft.minutes)}
                </div>
                <div className={`text-muted-foreground uppercase tracking-wide font-medium text-nowrap ${compact ? 'text-[10px] md:text-xs leading-tight' : 'text-xs md:text-sm leading-tight'}`}>
                  {t('countdown.minutes')}
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper type="scale" delay={0.5} className="text-center flex-shrink-0">
              <div className={`w-[80px] h-[80px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] bg-gradient-secondary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 flex-col`}>
                <div className={`font-bold text-foreground group-hover:scale-110 transition-transform duration-300 text-nowrap leading-none ${compact ? 'text-lg md:text-xl mb-1' : 'text-xl md:text-2xl lg:text-3xl mb-2'}`}>
                  {formatNumber(timeLeft.seconds)}
                </div>
                <div className={`text-muted-foreground uppercase tracking-wide font-medium text-nowrap ${compact ? 'text-[10px] md:text-xs leading-tight' : 'text-xs md:text-sm leading-tight'}`}>
                  {t('countdown.seconds')}
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </Card>
    </MotionWrapper>
  );
}