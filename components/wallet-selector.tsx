"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWallet } from "./wallet-provider"
import { Wallet, Download, Check } from "lucide-react"
import { useTranslation } from "@/components/translation-context"

interface WalletSelectorProps {
  onClose?: () => void
}

export function WalletSelector({ onClose }: WalletSelectorProps) {
  const { connecting, connect, detectedWallets, availableWallets } = useWallet()
  const { t } = useTranslation()

  const handleWalletSelect = async (walletName: string) => {
    try {
      await connect(walletName)
      onClose?.()
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Failed to connect wallet. Please try again.')
    }
  }

  const handleInstallWallet = (downloadUrl: string) => {
    window.open(downloadUrl, "_blank")
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-2">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="h-5 w-5" />
          {t('common.header.selectWallet')}
        </CardTitle>
        <CardDescription className="text-sm">
          {t('common.header.selectWalletDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto scrollbar-hide max-h-[70vh]">
        {/* All Wallets */}
        {(() => {
          const solanaWallets = detectedWallets.filter(w => 
            !["MetaMask", "Trust Wallet", "Coinbase Wallet", "WalletConnect"].includes(w.name)
          )
          const solanaAvailable = availableWallets.filter(w => 
            !["MetaMask", "Trust Wallet", "Coinbase Wallet", "WalletConnect"].includes(w.name)
          )
          
          return (solanaWallets.length > 0 || solanaAvailable.length > 0) && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src="/sol.png" alt="Solana" className="w-4 h-4" />
                <h3 className="text-sm font-medium text-muted-foreground">
                  Solana Wallets
                </h3>
              </div>
              
              {/* Detected Solana Wallets */}
              {solanaWallets.length > 0 && (
                <div className="space-y-2 mb-3">
                  {solanaWallets.map((wallet) => (
                    <Button
                      key={wallet.name}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 transition-all duration-200 hover:scale-105 cursor-pointer"
                      onClick={() => handleWalletSelect(wallet.name)}
                      disabled={connecting}
                    >
                      <div className="flex items-center gap-3">
                        <img src={wallet.icon} alt={wallet.name} className="w-10 h-10" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {t('common.header.clickToConnect')}
                          </div>
                        </div>
                        {connecting && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Available Solana Wallets */}
              {solanaAvailable.length > 0 && (
                <div className="space-y-2">
                  {solanaAvailable.map((wallet) => (
                    <Button
                      key={wallet.name}
                      variant="secondary"
                      className="w-full justify-start h-auto p-4 transition-all duration-200 hover:scale-105 cursor-pointer"
                      onClick={() => handleInstallWallet(wallet.downloadUrl)}
                    >
                      <div className="flex items-center gap-3">
                        <img src={wallet.icon} alt={wallet.name} className="w-10 h-10" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {t('common.header.clickToInstall')}
                          </div>
                        </div>
                        <Download className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* Multi-Chain Wallets */}
        {(() => {
          const multiChainWallets = detectedWallets.filter(w => 
            ["MetaMask", "Trust Wallet", "Coinbase Wallet"].includes(w.name)
          )
          const multiChainAvailable = availableWallets.filter(w => 
            ["MetaMask", "Trust Wallet", "Coinbase Wallet", "WalletConnect"].includes(w.name)
          )
          
          return (multiChainWallets.length > 0 || multiChainAvailable.length > 0) && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">
                Multi-Chain Wallets
              </h3>
              
              {/* Detected Multi-Chain Wallets */}
              {multiChainWallets.length > 0 && (
                <div className="space-y-2 mb-3">
                  {multiChainWallets.map((wallet) => (
                    <Button
                      key={wallet.name}
                      variant="outline"
                      className="w-full justify-start h-auto p-4 transition-all duration-200 hover:scale-105 cursor-pointer"
                      onClick={() => handleWalletSelect(wallet.name)}
                      disabled={connecting}
                    >
                      <div className="flex items-center gap-3">
                        <img src={wallet.icon} alt={wallet.name} className="w-10 h-10" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {t('common.header.clickToConnect')}
                          </div>
                        </div>
                        {connecting && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              
              {/* Available Multi-Chain Wallets */}
              {multiChainAvailable.length > 0 && (
                <div className="space-y-2">
                  {multiChainAvailable.map((wallet) => (
                    <Button
                      key={wallet.name}
                      variant="secondary"
                      className="w-full justify-start h-auto p-4 transition-all duration-200 hover:scale-105 cursor-pointer"
                      onClick={() => handleInstallWallet(wallet.downloadUrl)}
                    >
                      <div className="flex items-center gap-3">
                        <img src={wallet.icon} alt={wallet.name} className="w-10 h-10" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {t('common.header.clickToInstall')}
                          </div>
                        </div>
                        <Download className="h-4 w-4" />
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          )
        })()}

        {/* No Wallets Available */}
        {detectedWallets.length === 0 && availableWallets.length === 0 && (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">
              {t('common.header.noWalletsFound')}
            </h3>
            <p className="text-muted-foreground">
              {t('common.header.installWalletFirst')}
            </p>
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-2 bg-gray-100 rounded text-xs">
            <p>Detected: {detectedWallets.length}</p>
            <p>Available: {availableWallets.length}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
