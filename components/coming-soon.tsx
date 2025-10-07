"use client";

import { useTranslation } from '@/components/translation-context';
import { MotionWrapper } from '@/components/motion-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, Clock, Mail, Bell } from 'lucide-react';
import { CountdownTimer } from '@/components/countdown-timer';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

interface ComingSoonProps {
  targetDate: string;
}

export function ComingSoon({ targetDate }: ComingSoonProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-64 h-64 opacity-10 animate-float">
          <img src="/gradient-orb-1.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute bottom-1/4 right-0 w-48 h-48 opacity-10 animate-float" style={{animationDelay: '1s'}}>
          <img src="/gradient-orb-2.svg" alt="" className="w-full h-full" />
        </div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 opacity-5 animate-pulse">
          <div className="w-full h-full bg-gradient-primary rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-1/3 right-1/3 w-40 h-40 opacity-5 animate-pulse" style={{animationDelay: '2s'}}>
          <div className="w-full h-full bg-gradient-accent rounded-full blur-3xl"></div>
        </div>
      </div>

      <Header />
      <MotionWrapper type="fadeIn" className="min-h-screen bg-background relative z-10">
        {/* Hero Section */}
        <div className="relative py-24 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <MotionWrapper type="slideUp" delay={0.1}>
                <div className="flex items-center justify-center mb-8">
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-primary rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                    <img width={128} height={152} src="/mev.png" className="relative" alt="MEVStake" />
                  </div>
                </div>
              </MotionWrapper>

              <MotionWrapper type="slideUp" delay={0.2}>
                <h1 className="text-4xl lg:text-7xl font-bold text-balance mb-6 text-foreground">
                  {t('comingSoon.title')}
                </h1>
              </MotionWrapper>

              <MotionWrapper type="slideUp" delay={0.3}>
                <h2 className="text-2xl lg:text-4xl text-muted-foreground text-balance mb-8 max-w-3xl mx-auto leading-tight">
                  {t('comingSoon.subtitle')}
                </h2>
              </MotionWrapper>

              <MotionWrapper type="slideUp" delay={0.4}>
                <p className="text-lg text-muted-foreground text-balance mb-16 max-w-2xl mx-auto leading-relaxed">
                  {t('comingSoon.description')}
                </p>
              </MotionWrapper>

              <MotionWrapper type="fadeIn" delay={0.5} className="mb-20">
                <div className="max-w-4xl mx-auto">
                  <CountdownTimer targetDate={targetDate} compact={true} />
                </div>
              </MotionWrapper>

              {/*<MotionWrapper type="fadeIn" delay={0.6}>
                <Card className="bg-card/50 backdrop-blur-sm border-border p-8 mb-12">
                  <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <Bell className="w-6 h-6 text-accent" />
                        <h3 className="text-xl font-semibold">{t('comingSoon.notifyTitle')}</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {t('comingSoon.notifyDescription')}
                      </p>
                      <form className="flex gap-3">
                        <Input 
                          type="email" 
                          placeholder={t('comingSoon.emailPlaceholder')}
                          className="flex-1"
                        />
                        <Button type="submit" className="px-6">
                          {t('comingSoon.notifyButton')}
                        </Button>
                      </form>
                    </div>

                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-4">
                        <Mail className="w-6 h-6 text-accent" />
                        <h3 className="text-xl font-semibold">{t('comingSoon.contactTitle')}</h3>
                      </div>
                      <p className="text-muted-foreground mb-6">
                        {t('comingSoon.contactDescription')}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <a href="mailto:support@mevstake.com">
                          <Mail className="w-4 h-4 mr-2" />
                          {t('comingSoon.contactButton')}
                        </a>
                      </Button>
                    </div>
                  </div>
                </Card>
              </MotionWrapper>*/}

              <MotionWrapper type="fadeIn" delay={0.7}>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                  <MotionWrapper type="scale" delay={0.1}>
                    <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group">
                      <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Clock className="w-8 h-8 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3">{t('comingSoon.feature1.title')}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('comingSoon.feature1.description')}
                      </p>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper type="scale" delay={0.2}>
                    <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group">
                      <div className="w-16 h-16 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Bot className="w-8 h-8 text-accent" />
                      </div>
                      <h4 className="text-xl font-semibold mb-3">{t('comingSoon.feature2.title')}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('comingSoon.feature2.description')}
                      </p>
                    </div>
                  </MotionWrapper>

                  <MotionWrapper type="scale" delay={0.3}>
                    <div className="bg-gradient-card rounded-2xl p-8 border border-border/50 backdrop-blur-sm hover:gradient-hover transition-all duration-300 hover:scale-elevate group">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-foreground font-bold text-xl">1%</span>
                      </div>
                      <h4 className="text-xl font-semibold mb-3">{t('comingSoon.feature3.title')}</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        {t('comingSoon.feature3.description')}
                      </p>
                    </div>
                  </MotionWrapper>
                </div>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </MotionWrapper>
      <Footer />
    </div>
  );
}
