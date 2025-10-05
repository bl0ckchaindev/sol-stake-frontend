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
    <div className="min-h-screen bg-background">
      <Header />
      <MotionWrapper type="fadeIn" className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper type="slideUp" delay={0.1}>
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <img width={256} height={128} src="/mev.png" />
              </div>
            </div>
          </MotionWrapper>

          <MotionWrapper type="slideUp" delay={0.2}>
            <h1 className="text-4xl lg:text-6xl font-bold text-balance mb-6">
              {t('comingSoon.title')}
            </h1>
          </MotionWrapper>

          <MotionWrapper type="slideUp" delay={0.3}>
            <h2 className="text-2xl lg:text-3xl text-muted-foreground text-balance mb-6">
              {t('comingSoon.subtitle')}
            </h2>
          </MotionWrapper>

          <MotionWrapper type="slideUp" delay={0.4}>
            <p className="text-lg text-muted-foreground text-balance mb-12 max-w-2xl mx-auto leading-relaxed">
              {t('comingSoon.description')}
            </p>
          </MotionWrapper>

          <MotionWrapper type="fadeIn" delay={0.5} className="mb-16">
            <div className="max-w-2xl mx-auto">
              <CountdownTimer targetDate={targetDate} />
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
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-card/30 rounded-lg p-6 border border-border">
                <Clock className="w-8 h-8 text-accent mx-auto mb-3" />
                <h4 className="font-semibold mb-2">{t('comingSoon.feature1.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('comingSoon.feature1.description')}
                </p>
              </div>

              <div className="bg-card/30 rounded-lg p-6 border border-border">
                <Bot className="w-8 h-8 text-accent mx-auto mb-3" />
                <h4 className="font-semibold mb-2">{t('comingSoon.feature2.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('comingSoon.feature2.description')}
                </p>
              </div>

              <div className="bg-card/30 rounded-lg p-6 border border-border">
                <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-bold">1%</span>
                </div>
                <h4 className="font-semibold mb-2">{t('comingSoon.feature3.title')}</h4>
                <p className="text-sm text-muted-foreground">
                  {t('comingSoon.feature3.description')}
                </p>
              </div>
            </div>
          </MotionWrapper>
        </div>
        </div>
      </MotionWrapper>
      <Footer />
    </div>
  );
}
