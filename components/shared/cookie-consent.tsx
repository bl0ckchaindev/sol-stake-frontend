"use client"

import { useState, useEffect } from "react"
import { X, Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useTranslation } from "@/context/translation-context"
import Link from "next/link"

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Show popup after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
    // Here you can initialize analytics or other tracking
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      })
    }
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
    // Disable analytics if user declines
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      })
    }
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 pointer-events-auto">
        <Card className="max-w-5xl mx-auto bg-card/95 backdrop-blur-xl border-border/50 shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
          <div className="relative p-6 md:p-8">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="text-lg md:text-xl font-semibold text-foreground">
                  {t("cookie.title")}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {t("cookie.description")}{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    {t("cookie.privacyLink")}
                  </Link>
                  {" "}{t("cookie.and")}{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    {t("cookie.termsLink")}
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-shrink-0">
                <Button
                  onClick={handleDecline}
                  variant="outline"
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  {t("cookie.decline")}
                </Button>
                <Button
                  onClick={handleAccept}
                  className="w-full sm:w-auto min-w-[120px]"
                >
                  {t("cookie.accept")}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

