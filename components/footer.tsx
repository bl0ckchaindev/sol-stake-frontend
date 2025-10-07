"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useTranslation } from "@/components/translation-context"
import { MotionWrapper } from "@/components/motion-wrapper"

export function Footer() {
  const { t } = useTranslation()
  const [email, setEmail] = useState("")

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission logic here
    console.log("Email submitted:", email)
  }

  return (
    <MotionWrapper type="fadeIn" trigger="inView" className="bg-gradient-footer border-t relative overflow-hidden">
      {/* Background decoration - keep existing gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96">
            <img src="/gradient-orb-1.svg" alt="" className="w-full h-full" />
          </div>
          <div className="absolute bottom-0 right-0 w-80 h-80">
            <img src="/gradient-orb-2.svg" alt="" className="w-full h-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Two column layout for desktop, single column for tablet/mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Title */}
            <h2 className="font-poppins font-medium text-6xl lg:text-8xl leading-none tracking-tight text-foreground mb-16">
              {t('common.footer.title')}
            </h2>

            {/* Logo and text block */}
            <Link href="/" className="flex items-center gap-4 group">
              <Image 
                src="/mev.png" 
                alt="MEVStake" 
                width={42} 
                height={42} 
                className="w-10 h-10 lg:w-[42px] lg:h-[42px]"
              />
              <div>
                <h3 className="font-poppins font-semibold text-xl lg:text-2xl leading-none text-foreground">
                  MEVStake
                </h3>
                <p className="font-poppins font-light text-[13px] leading-none tracking-tight text-muted-foreground mt-1">
                  {t('common.footer.company.tagline')}
                </p>
              </div>
            </Link>

            {/* Address */}
            <p className="font-poppins font-normal text-lg leading-relaxed text-muted-foreground max-w-[462px]">
              {t('common.footer.address')}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              <Link href="/" className="w-10 h-10 lg:w-10 lg:h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <Image src="/footer-facebook.svg" alt="Facebook" width={40} height={40} />
              </Link>
              <Link href="/" className="w-10 h-10 lg:w-10 lg:h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <Image src="/footer-twitter.svg" alt="Twitter" width={40} height={40} />
              </Link>
              <Link href="/" className="w-10 h-10 lg:w-10 lg:h-10 flex items-center justify-center hover:opacity-80 transition-opacity">
                <Image src="/footer-instagram.svg" alt="Instagram" width={40} height={40} />
              </Link>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Email Input Field */}
            <form onSubmit={handleEmailSubmit} className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('common.footer.emailPlaceholder')}
                className="w-full font-poppins font-normal text-3xl lg:text-4xl leading-tight tracking-tight text-foreground placeholder:text-foreground/70 bg-transparent border-b border-foreground/20 focus:border-foreground/40 focus:outline-none pb-2"
              />
              <button 
                type="submit"
                className="absolute right-0 bottom-2 w-10 h-10 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <Image src="/footer-link.svg" alt="Submit" width={40} height={40} />
              </button>
            </form>

            {/* Three subcolumns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-16">
              {/* Company Column */}
              <div className="space-y-4">
                <h4 className="font-poppins font-medium text-xl leading-relaxed text-foreground mb-4">
                  {t('common.footer.sections.company')}
                </h4>
                <div className="space-y-3">
                  <Link href="/" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.about')}
                  </Link>
                  <Link href="/" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.pricing')}
                  </Link>
                  <Link href="/" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.jobs')}
                  </Link>
                  <Link href="/" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.blog')}
                  </Link>
                </div>
              </div>

              {/* Platform Column */}
              <div className="space-y-4">
                <h4 className="font-poppins font-medium text-xl leading-relaxed text-foreground mb-4">
                  {t('common.footer.sections.platform')}
                </h4>
                <div className="space-y-3">
                  <Link href="/dashboard" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.dashboard')}
                  </Link>
                  <Link href="/mev-tracker" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.mevBotTracker')}
                  </Link>
                  <Link href="/referrals" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.referrals')}
                  </Link>
                </div>
              </div>

              {/* Legal Column */}
              <div className="space-y-4">
                <h4 className="font-poppins font-medium text-xl leading-relaxed text-foreground mb-4">
                  {t('common.footer.sections.legal')}
                </h4>
                <div className="space-y-3">
                  <Link href="/terms" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.termsOfService')}
                  </Link>
                  <Link href="/privacy" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.privacyPolicy')}
                  </Link>
                  <Link href="/terms#risk" className="block font-poppins font-normal text-base leading-tight text-muted-foreground hover:text-foreground transition-colors">
                    {t('common.footer.links.riskDisclosure')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Watermark Image */}
        <div className="relative mt-16">
          <Image 
            src="/footer-watermark.svg" 
            alt="Footer watermark" 
            width={1200} 
            height={200} 
            className="w-full h-auto"
          />
          
          {/* Copyright text overlapping watermark */}
          <p className="font-poppins font-normal text-base leading-tight text-center text-muted-foreground mt-[16px] relative z-10">
            {t('common.footer.copyright').replace('{{year}}', new Date().getFullYear().toString())}
          </p>
        </div>
      </div>
    </MotionWrapper>
  )
}