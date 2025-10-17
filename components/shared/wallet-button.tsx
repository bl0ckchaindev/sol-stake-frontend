"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "@/context/wallet-provider"
import { Wallet, LogOut, ChevronDown } from "lucide-react"
import { useTranslation } from "@/context/translation-context"
import { WalletSelector } from "@/components/shared/wallet-selector"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletButton() {
  const { connected, connecting, publicKey, disconnect, balance, walletName, detectedWallets } = useWallet()
  const { t } = useTranslation()
  const [showWalletSelector, setShowWalletSelector] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (connected && publicKey) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 bg-transparent">
            <Wallet className="h-4 w-4" />
            <div className="flex flex-col items-start">
              <span className="text-sm">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </span>
              {walletName && <span className="text-xs text-muted-foreground">{walletName}</span>}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <div className="text-sm font-medium">{t('common.header.balance')}</div>
            <div className="text-lg font-bold text-primary">{balance.toFixed(4)} SOL</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('common.header.disconnect')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const modalContent = showWalletSelector && mounted && (
    <div 
      className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
      onClick={() => setShowWalletSelector(false)}
    >
      <div 
        className="relative max-w-md w-full max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setShowWalletSelector(false)}
          className="absolute top-2 right-2 w-8 h-8 bg-background border rounded-full flex items-center justify-center hover:bg-muted z-10 text-lg font-bold shadow-lg"
        >
          ×
        </button>
        <WalletSelector onClose={() => setShowWalletSelector(false)} />
      </div>
    </div>
  )

  return (
    <>
      <Button 
        onClick={() => setShowWalletSelector(true)} 
        disabled={connecting} 
        className="flex items-center gap-2"
      >
        <Wallet className="h-4 w-4" />
        {connecting ? t('common.header.connecting') : t('common.header.connectWallet')}
        <ChevronDown className="h-3 w-3" />
      </Button>

      {mounted && modalContent && createPortal(modalContent, document.body)}
    </>
  )
}
