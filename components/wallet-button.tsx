"use client"

import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"
import { Wallet, LogOut, Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function WalletButton() {
  const { connected, connecting, publicKey, connect, disconnect, balance, walletName } = useWallet()

  if (
    !connected &&
    !connecting &&
    typeof window !== "undefined" &&
    !window.phantom &&
    !window.solflare &&
    !window.solana
  ) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Install Wallet
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => window.open("https://phantom.app/", "_blank")}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">P</span>
              </div>
              Install Phantom
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open("https://solflare.com/", "_blank")}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              Install Solflare
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

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
            <div className="text-sm font-medium">Balance</div>
            <div className="text-lg font-bold text-primary">{balance.toFixed(4)} SOL</div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={disconnect}>
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <Button onClick={connect} disabled={connecting} className="flex items-center gap-2">
      <Wallet className="h-4 w-4" />
      {connecting ? "Connecting..." : "Connect Wallet"}
    </Button>
  )
}
