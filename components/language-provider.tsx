"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "de" | "it" | "es" | "pt"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.mevTracker": "MEV Tracker",
    "nav.referrals": "Referrals",
    "nav.connectWallet": "Connect Wallet",

    // Dashboard
    "dashboard.title": "Staking Dashboard",
    "dashboard.subtitle": "Manage your staked tokens and track rewards",
    "dashboard.subtitleDisconnected": "Connect your wallet to start staking",
    "dashboard.walletNotConnected": "Wallet not connected.",
    "dashboard.connectPrompt": "Connect your Solana wallet to view your positions and start staking.",

    // Stats Cards
    "stats.totalStaked": "Total Staked",
    "stats.dailyRewards": "Daily Rewards",
    "stats.totalEarned": "Total Earned",
    "stats.claimable": "Claimable",
    "stats.referralRewards": "Referral Rewards",
    "stats.activePositions": "active positions",
    "stats.activePosition": "active position",
    "stats.connectWallet": "Connect wallet",
    "stats.dailyRate": "daily rate",
    "stats.lifetimeRewards": "Lifetime rewards",
    "stats.fromReferrals": "From referrals",
    "stats.readyToClaim": "Ready to claim",

    // Tabs
    "tabs.staking": "Staking",
    "tabs.myStakes": "My Stakes",
    "tabs.history": "Withdrawal History",

    // Staking
    "staking.availableTokens": "Available Tokens",
    "staking.selectToken": "Select a token to start staking with 90-day lock period. Current APY:",
    "staking.balance": "Balance:",
    "staking.stake": "Stake",
    "staking.connectWallet": "Connect Wallet",

    // Positions
    "positions.yourStakes": "Your Stakes",
    "positions.noActiveStakes": "No Active Stakes",
    "positions.startStaking": "Start staking to see your positions here",
    "positions.startStakingButton": "Start Staking",
    "positions.walletNotConnected": "Wallet Not Connected",
    "positions.connectPrompt": "Connect your wallet to view your staking positions",

    // Common
    "common.apy": "APY",
    "common.sol": "SOL",
    "common.connectWallet": "Connect Wallet",
  },
  de: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.mevTracker": "MEV Tracker",
    "nav.referrals": "Empfehlungen",
    "nav.connectWallet": "Wallet Verbinden",

    // Dashboard
    "dashboard.title": "Staking Dashboard",
    "dashboard.subtitle": "Verwalten Sie Ihre gestakten Token und verfolgen Sie Belohnungen",
    "dashboard.subtitleDisconnected": "Verbinden Sie Ihr Wallet, um mit dem Staking zu beginnen",
    "dashboard.walletNotConnected": "Wallet nicht verbunden.",
    "dashboard.connectPrompt":
      "Verbinden Sie Ihr Solana-Wallet, um Ihre Positionen anzuzeigen und mit dem Staking zu beginnen.",

    // Stats Cards
    "stats.totalStaked": "Gesamt Gestakt",
    "stats.dailyRewards": "Tägliche Belohnungen",
    "stats.totalEarned": "Gesamt Verdient",
    "stats.claimable": "Abrufbar",
    "stats.referralRewards": "Empfehlungsbelohnungen",
    "stats.activePositions": "aktive Positionen",
    "stats.activePosition": "aktive Position",
    "stats.connectWallet": "Wallet verbinden",
    "stats.dailyRate": "täglicher Satz",
    "stats.lifetimeRewards": "Lebenslange Belohnungen",
    "stats.fromReferrals": "Von Empfehlungen",
    "stats.readyToClaim": "Bereit zum Abholen",

    // Tabs
    "tabs.staking": "Staking",
    "tabs.myStakes": "Meine Stakes",
    "tabs.history": "Abhebungshistorie",

    // Staking
    "staking.availableTokens": "Verfügbare Token",
    "staking.selectToken": "Wählen Sie einen Token für 90-Tage-Sperrfrist. Aktueller APY:",
    "staking.balance": "Guthaben:",
    "staking.stake": "Staken",
    "staking.connectWallet": "Wallet Verbinden",

    // Positions
    "positions.yourStakes": "Ihre Stakes",
    "positions.noActiveStakes": "Keine Aktiven Stakes",
    "positions.startStaking": "Beginnen Sie mit dem Staking, um Ihre Positionen hier zu sehen",
    "positions.startStakingButton": "Staking Beginnen",
    "positions.walletNotConnected": "Wallet Nicht Verbunden",
    "positions.connectPrompt": "Verbinden Sie Ihr Wallet, um Ihre Staking-Positionen anzuzeigen",

    // Common
    "common.apy": "APY",
    "common.sol": "SOL",
    "common.connectWallet": "Wallet Verbinden",
  },
  it: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.mevTracker": "MEV Tracker",
    "nav.referrals": "Referenze",
    "nav.connectWallet": "Connetti Wallet",

    // Dashboard
    "dashboard.title": "Dashboard di Staking",
    "dashboard.subtitle": "Gestisci i tuoi token in staking e traccia le ricompense",
    "dashboard.subtitleDisconnected": "Connetti il tuo wallet per iniziare lo staking",
    "dashboard.walletNotConnected": "Wallet non connesso.",
    "dashboard.connectPrompt": "Connetti il tuo wallet Solana per visualizzare le tue posizioni e iniziare lo staking.",

    // Stats Cards
    "stats.totalStaked": "Totale in Staking",
    "stats.dailyRewards": "Ricompense Giornaliere",
    "stats.totalEarned": "Totale Guadagnato",
    "stats.claimable": "Richiedibile",
    "stats.referralRewards": "Ricompense Referenze",
    "stats.activePositions": "posizioni attive",
    "stats.activePosition": "posizione attiva",
    "stats.connectWallet": "Connetti wallet",
    "stats.dailyRate": "tasso giornaliero",
    "stats.lifetimeRewards": "Ricompense totali",
    "stats.fromReferrals": "Da referenze",
    "stats.readyToClaim": "Pronto per il riscatto",

    // Tabs
    "tabs.staking": "Staking",
    "tabs.myStakes": "I Miei Stakes",
    "tabs.history": "Cronologia Prelievi",

    // Staking
    "staking.availableTokens": "Token Disponibili",
    "staking.selectToken":
      "Seleziona un token per iniziare lo staking con periodo di blocco di 90 giorni. APY attuale:",
    "staking.balance": "Saldo:",
    "staking.stake": "Stake",
    "staking.connectWallet": "Connetti Wallet",

    // Positions
    "positions.yourStakes": "I Tuoi Stakes",
    "positions.noActiveStakes": "Nessun Stake Attivo",
    "positions.startStaking": "Inizia lo staking per vedere le tue posizioni qui",
    "positions.startStakingButton": "Inizia Staking",
    "positions.walletNotConnected": "Wallet Non Connesso",
    "positions.connectPrompt": "Connetti il tuo wallet per visualizzare le tue posizioni di staking",

    // Common
    "common.apy": "APY",
    "common.sol": "SOL",
    "common.connectWallet": "Connetti Wallet",
  },
  es: {
    // Navigation
    "nav.dashboard": "Panel",
    "nav.mevTracker": "MEV Tracker",
    "nav.referrals": "Referencias",
    "nav.connectWallet": "Conectar Wallet",

    // Dashboard
    "dashboard.title": "Panel de Staking",
    "dashboard.subtitle": "Gestiona tus tokens en staking y rastrea recompensas",
    "dashboard.subtitleDisconnected": "Conecta tu wallet para comenzar el staking",
    "dashboard.walletNotConnected": "Wallet no conectado.",
    "dashboard.connectPrompt": "Conecta tu wallet de Solana para ver tus posiciones y comenzar el staking.",

    // Stats Cards
    "stats.totalStaked": "Total en Staking",
    "stats.dailyRewards": "Recompensas Diarias",
    "stats.totalEarned": "Total Ganado",
    "stats.claimable": "Reclamable",
    "stats.referralRewards": "Recompensas Referencias",
    "stats.activePositions": "posiciones activas",
    "stats.activePosition": "posición activa",
    "stats.connectWallet": "Conectar wallet",
    "stats.dailyRate": "tasa diaria",
    "stats.lifetimeRewards": "Recompensas totales",
    "stats.fromReferrals": "De referencias",
    "stats.readyToClaim": "Listo para reclamar",

    // Tabs
    "tabs.staking": "Staking",
    "tabs.myStakes": "Mis Stakes",
    "tabs.history": "Historial de Retiros",

    // Staking
    "staking.availableTokens": "Tokens Disponibles",
    "staking.selectToken":
      "Selecciona un token para comenzar el staking con período de bloqueo de 90 días. APY actual:",
    "staking.balance": "Saldo:",
    "staking.stake": "Stake",
    "staking.connectWallet": "Conectar Wallet",

    // Positions
    "positions.yourStakes": "Tus Stakes",
    "positions.noActiveStakes": "Sin Stakes Activos",
    "positions.startStaking": "Comienza el staking para ver tus posiciones aquí",
    "positions.startStakingButton": "Comenzar Staking",
    "positions.walletNotConnected": "Wallet No Conectado",
    "positions.connectPrompt": "Conecta tu wallet para ver tus posiciones de staking",

    // Common
    "common.apy": "APY",
    "common.sol": "SOL",
    "common.connectWallet": "Conectar Wallet",
  },
  pt: {
    // Navigation
    "nav.dashboard": "Painel",
    "nav.mevTracker": "MEV Tracker",
    "nav.referrals": "Referências",
    "nav.connectWallet": "Conectar Carteira",

    // Dashboard
    "dashboard.title": "Painel de Staking",
    "dashboard.subtitle": "Gerencie seus tokens em staking e acompanhe recompensas",
    "dashboard.subtitleDisconnected": "Conecte sua carteira para começar o staking",
    "dashboard.walletNotConnected": "Carteira não conectada.",
    "dashboard.connectPrompt": "Conecte sua carteira Solana para visualizar suas posições e começar o staking.",

    // Stats Cards
    "stats.totalStaked": "Total em Staking",
    "stats.dailyRewards": "Recompensas Diárias",
    "stats.totalEarned": "Total Ganho",
    "stats.claimable": "Resgatável",
    "stats.referralRewards": "Recompensas Referências",
    "stats.activePositions": "posições ativas",
    "stats.activePosition": "posição ativa",
    "stats.connectWallet": "Conectar carteira",
    "stats.dailyRate": "taxa diária",
    "stats.lifetimeRewards": "Recompensas totais",
    "stats.fromReferrals": "De referências",
    "stats.readyToClaim": "Pronto para resgatar",

    // Tabs
    "tabs.staking": "Staking",
    "tabs.myStakes": "Meus Stakes",
    "tabs.history": "Histórico de Saques",

    // Staking
    "staking.availableTokens": "Tokens Disponíveis",
    "staking.selectToken": "Selecione um token para começar o staking com período de bloqueio de 90 dias. APY atual:",
    "staking.balance": "Saldo:",
    "staking.stake": "Stake",
    "staking.connectWallet": "Conectar Carteira",

    // Positions
    "positions.yourStakes": "Seus Stakes",
    "positions.noActiveStakes": "Sem Stakes Ativos",
    "positions.startStaking": "Comece o staking para ver suas posições aqui",
    "positions.startStakingButton": "Começar Staking",
    "positions.walletNotConnected": "Carteira Não Conectada",
    "positions.connectPrompt": "Conecte sua carteira para visualizar suas posições de staking",

    // Common
    "common.apy": "APY",
    "common.sol": "SOL",
    "common.connectWallet": "Conectar Carteira",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
