import { 
  Connection, 
  PublicKey, 
  Transaction,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  Keypair
} from "@solana/web3.js"
import { 
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction
} from "@solana/spl-token"
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor"
import { 
  MevStaking,
  PROGRAM_ID,
  GlobalData,
  PoolInfo,
  UserStake,
  LockPeriod,
  StakePosition,
  GLOBAL_DATA_SEED,
  SOL_VAULT_SEED,
  POOL_AUTHORITY_SEED,
  USER_AUTHORITY_SEED,
  SUPPORTED_TOKENS,
  LOCK_PERIOD_CONFIG,
  getLockPeriodConfig
} from "./types"

export class MevStakingProgram {
  private program: Program<MevStaking>
  private connection: Connection
  private provider: AnchorProvider

  constructor(connection: Connection, wallet: any) {
    this.connection = connection
    this.provider = new AnchorProvider(connection, wallet, {
      commitment: "confirmed",
      preflightCommitment: "confirmed"
    })
    
    // Load the program using the IDL
    this.program = new Program(
      require("./idl/mev_staking.json") as MevStaking,
      this.provider
    )
  }

  // PDA derivation methods
  getGlobalDataPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(GLOBAL_DATA_SEED)],
      PROGRAM_ID
    )
  }

  getPoolInfoPDA(tokenMint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(POOL_AUTHORITY_SEED), tokenMint.toBytes()],
      PROGRAM_ID
    )
  }

  getUserStakePDA(user: PublicKey, poolId: number): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from(USER_AUTHORITY_SEED),
        user.toBuffer(),
        Buffer.from([poolId])
      ],
      PROGRAM_ID
    )
  }

  // Account fetching methods
  async getGlobalData(): Promise<GlobalData | null> {
    try {
      const [globalDataPDA] = this.getGlobalDataPDA()      
      // Check if account exists first
      const accountInfo = await this.connection.getAccountInfo(globalDataPDA)      
      if (!accountInfo) {
        console.log('Global data account does not exist - needs to be initialized')
        return null
      }      
      const globalData = await this.program.account.globalData.fetch(globalDataPDA)
      console.log('log->globalData fetched successfully', globalData.pools[0].toBase58())
      return globalData
    } catch (error) {
      console.error("Error fetching global data:", error)
      return null
    }
  }

  async getPoolInfo(tokenMint: PublicKey): Promise<PoolInfo | null> {
    try {
      const [poolInfoPDA] = this.getPoolInfoPDA(tokenMint)
      console.log('log-> mint', tokenMint.toBase58(), poolInfoPDA.toBase58())
      return await this.program.account.poolInfo.fetch(poolInfoPDA)
    } catch (error) {
      console.error("Error fetching pool info:", error)
      return null
    }
  }

  async getUserStake(user: PublicKey, poolId: number): Promise<UserStake | null> {
    try {
      const [userStakePDA] = this.getUserStakePDA(user, poolId)
      return await this.program.account.userStake.fetch(userStakePDA)
    } catch (error) {
      console.error("Error fetching user stake:", error)
      return null
    }
  }

  async getAllUserStakes(user: PublicKey): Promise<StakePosition[]> {
    try {
      const positions: StakePosition[] = []
      
      // Get all pools from global data
      const globalData = await this.getGlobalData()
      console.log('log->globalData', globalData)
      if (!globalData) return positions

      // Check each supported token for user stakes
      for (const [symbol, token] of Object.entries(SUPPORTED_TOKENS)) {
        if (token.poolId === undefined) continue
        
        const userStake = await this.getUserStake(user, token.poolId)
        console.log('log->userStake', userStake)
        const poolInfo = await this.getPoolInfo(token.mint)
        
        if (userStake && poolInfo && userStake.totalStaked.gt(new BN(0))) {
          const [userStakeAddress] = this.getUserStakePDA(user, token.poolId)
          const [poolInfoAddress] = this.getPoolInfoPDA(token.mint)
          
          const pendingRewards = await this.calculatePendingRewards(userStake, globalData)
          const canWithdraw = this.canWithdraw(userStake)
          const lockEndTime = this.getLockEndTime(userStake, globalData)
          const apy = this.calculateAPY(globalData, userStake)

          positions.push({
            userStake,
            poolInfo,
            userStakeAddress,
            poolInfoAddress,
            pendingRewards,
            canWithdraw,
            lockEndTime,
            apy
          })
        }
      }

      return positions
    } catch (error) {
      console.error("Error fetching user stakes:", error)
      return []
    }
  }

  // Transaction methods
  async stakeTokens(
    tokenMint: PublicKey,
    poolId: number,
    amount: BN,
    lockPeriod: LockPeriod,
    referrer?: PublicKey
  ): Promise<string> {
    const user = this.provider.wallet.publicKey
    if (!user) throw new Error("Wallet not connected")

    const [globalDataPDA] = this.getGlobalDataPDA()
    const [poolInfoPDA] = this.getPoolInfoPDA(tokenMint)
    const [userStakePDA] = this.getUserStakePDA(user, poolId)
    
    const userAta = await getAssociatedTokenAddress(tokenMint, user)
    const poolAta = await getAssociatedTokenAddress(tokenMint, poolInfoPDA, true)
    // Handle referrer logic: if no referrer provided, use PublicKey.default
    let finalReferrer = referrer || PublicKey.default
    let referrerStakePDA: PublicKey
    const [referrerPDA] = this.getUserStakePDA(finalReferrer, poolId)
    referrerStakePDA = referrerPDA
    
    console.log('log->finalReferrer', finalReferrer.toBase58())
    console.log('log->referrerStakePDA', referrerStakePDA.toBase58())
    // Determine if this is SOL or a token based on the mint
    const isSOL = tokenMint.equals(new PublicKey("So11111111111111111111111111111111111111112"))
    
    let accounts: any
    if (isSOL) {
      accounts = {
        user,
        globalData: globalDataPDA,
        poolInfo: poolInfoPDA,
        userStake: userStakePDA,
        referrerStake: referrerStakePDA,
        referrer: finalReferrer,
        systemProgram: SystemProgram.programId,
      }
    } else {
      accounts = {
        user,
        globalData: globalDataPDA,
        poolInfo: poolInfoPDA,
        tokenMint,
        userStake: userStakePDA,
        referrerStake: referrerStakePDA,
        referrer: finalReferrer,
        userAta,
        poolAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
    }

    // Referrer stake account (either actual referrer or PublicKey.default when no referrer)
    console.log('log->referrerStakePDA added', referrerStakePDA.toBase58())
    console.log('log->lockPeriod', lockPeriod)
    console.log('log->accounts', accounts)
    console.log('log->method args:', { 
      poolId, 
      amount: amount.toString(), 
      lockPeriod, 
      lockPeriodType: typeof lockPeriod,
      lockPeriodValue: Object.keys(LockPeriod)[lockPeriod],
      originalReferrer: referrer?.toBase58() || 'null',
      finalReferrer: finalReferrer.toBase58(),
      isDefaultReferrer: finalReferrer.equals(PublicKey.default)
    })
    
    try {
      // Convert enum to the format expected by Anchor
      const lockPeriodVariant = (() => {
        switch (lockPeriod) {
          case LockPeriod.FreeLock: return { freeLock: {} }
          case LockPeriod.OneWeek: return { oneWeek: {} }
          case LockPeriod.OneMonth: return { oneMonth: {} }
          case LockPeriod.ThreeMonths: return { threeMonths: {} }
          case LockPeriod.SixMonths: return { sixMonths: {} }
          default: return { freeLock: {} }
        }
      })()
      
      console.log('log->lockPeriodVariant', lockPeriodVariant)

      let tx: Transaction
      if (isSOL) {
        tx = await this.program.methods
          .stakeSol(poolId, amount, lockPeriod as number, finalReferrer)
          .accounts(accounts)
          .transaction()
      } else {
        tx = await this.program.methods
          .stakeToken(poolId, amount, lockPeriod as number, finalReferrer)
          .accounts(accounts)
          .transaction()
      }
      
      console.log('log->transaction created successfully')

      // Check if user ATA exists, create if not
      const userAtaInfo = await this.connection.getAccountInfo(userAta)
      if (!userAtaInfo) {
        const createAtaIx = createAssociatedTokenAccountInstruction(
          user,
          userAta,
          user,
          tokenMint
        )
        tx.instructions.unshift(createAtaIx)
        console.log('log->added create ATA instruction')
      }

      const signature = await this.provider.sendAndConfirm(tx)
      console.log('log->transaction confirmed:', signature)
      return signature
    } catch (error) {
      console.error('Error creating stake transaction:', error)
      throw error
    }
  }

  async withdrawTokens(
    tokenMint: PublicKey,
    poolId: number,
    amount: BN,
    lockPeriod: LockPeriod
  ): Promise<string> {
    const user = this.provider.wallet.publicKey
    if (!user) throw new Error("Wallet not connected")

    const [globalDataPDA] = this.getGlobalDataPDA()
    const [poolInfoPDA] = this.getPoolInfoPDA(tokenMint)
    const [userStakePDA] = this.getUserStakePDA(user, poolId)
    
    // Determine if this is SOL or a token based on the mint
    const isSOL = tokenMint.equals(new PublicKey("So11111111111111111111111111111111111111112"))
    
    let accounts: any
    let tx: Transaction
    
    if (isSOL) {
      accounts = {
        user,
        globalData: globalDataPDA,
        poolInfo: poolInfoPDA,
        userStake: userStakePDA,
        systemProgram: SystemProgram.programId,
      }
      tx = await this.program.methods
        .withdrawSol(amount, lockPeriod as number)
        .accounts(accounts)
        .transaction()
    } else {
      const userAta = await getAssociatedTokenAddress(tokenMint, user)
      const poolAta = await getAssociatedTokenAddress(tokenMint, poolInfoPDA, true)
      
      accounts = {
        user,
        globalData: globalDataPDA,
        poolInfo: poolInfoPDA,
        tokenMint,
        userStake: userStakePDA,
        userAta,
        poolAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
      tx = await this.program.methods
        .withdrawToken(poolId, amount, lockPeriod as number)
        .accounts(accounts)
        .transaction()
    }

    const signature = await this.provider.sendAndConfirm(tx)
    return signature
  }

  async claimRewards(tokenMint: PublicKey, poolId: number): Promise<string> {
    const user = this.provider.wallet.publicKey
    if (!user) throw new Error("Wallet not connected")

    const [globalDataPDA] = this.getGlobalDataPDA()
    const [poolInfoPDA] = this.getPoolInfoPDA(tokenMint)
    const [userStakePDA] = this.getUserStakePDA(user, poolId)
    
    // Determine if this is SOL or a token based on the mint
    const isSOL = tokenMint.equals(new PublicKey("So11111111111111111111111111111111111111112"))
    
    let accounts: any
    let tx: Transaction
    
    if (isSOL) {
      accounts = {
        user,
        globalData: globalDataPDA,
        poolInfo: poolInfoPDA,
        userStake: userStakePDA,
        systemProgram: SystemProgram.programId,
      }
      tx = await this.program.methods
        .claimSol(poolId)
        .accounts(accounts)
        .transaction()
    } else {
      const userAta = await getAssociatedTokenAddress(tokenMint, user)
      const poolAta = await getAssociatedTokenAddress(tokenMint, poolInfoPDA, true)
      
      accounts = {
        user,
        globalData: globalDataPDA,
        poolInfo: poolInfoPDA,
        tokenMint,
        userStake: userStakePDA,
        userAta,
        poolAta,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      }
      tx = await this.program.methods
        .claimToken(poolId)
        .accounts(accounts)
        .transaction()
    }

    const signature = await this.provider.sendAndConfirm(tx)
    return signature
  }

  // Helper methods
  private async calculatePendingRewards(userStake: UserStake, globalData: GlobalData): Promise<number> {
    const currentTime = Math.floor(Date.now() / 1000)
    const timeSinceLastClaim = currentTime - userStake.lastClaimTime.toNumber()
    const daysSinceLastClaim = timeSinceLastClaim / (24 * 60 * 60)

    let totalRewards = 0

    // Calculate rewards for each tier
    const tiers = [
      { amount: userStake.tier0Amount, rate: globalData.tier0Reward },
      { amount: userStake.tier1Amount, rate: globalData.tier1Reward },
      { amount: userStake.tier2Amount, rate: globalData.tier2Reward },
      { amount: userStake.tier3Amount, rate: globalData.tier3Reward },
      { amount: userStake.tier4Amount, rate: globalData.tier4Reward },
    ]

    for (const tier of tiers) {
      if (tier.amount.gt(new BN(0))) {
        const stakeAmount = tier.amount.toNumber() / Math.pow(10, 9) // Convert from lamports
        const dailyRate = tier.rate / 10000 // Convert from basis points (now number instead of BN)
        const tierRewards = stakeAmount * dailyRate * daysSinceLastClaim
        totalRewards += tierRewards
      }
    }

    return totalRewards
  }

  private canWithdraw(userStake: UserStake): boolean {
    // For simplicity, assuming FreeLock can always withdraw
    // You might need to track lock end times per tier
    return userStake.tier0Amount.gt(new BN(0))
  }

  private getLockEndTime(userStake: UserStake, globalData?: GlobalData): Date {
    // This is simplified - you might need to track individual lock end times
    const lastClaimTime = userStake.lastClaimTime.toNumber() * 1000
    const config = getLockPeriodConfig(LockPeriod.SixMonths, globalData)
    const maxLockDuration = config.duration * 1000
    return new Date(lastClaimTime + maxLockDuration)
  }

  private calculateAPY(globalData: GlobalData, userStake: UserStake): number {
    // Calculate weighted average APY based on stake distribution
    let totalStaked = 0
    let weightedRewards = 0

    const tiers = [
      { amount: userStake.tier0Amount, rate: globalData.tier0Reward },
      { amount: userStake.tier1Amount, rate: globalData.tier1Reward },
      { amount: userStake.tier2Amount, rate: globalData.tier2Reward },
      { amount: userStake.tier3Amount, rate: globalData.tier3Reward },
      { amount: userStake.tier4Amount, rate: globalData.tier4Reward },
    ]

    for (const tier of tiers) {
      const amount = tier.amount.toNumber()
      const rate = tier.rate / 10000 // Convert from basis points (now number instead of BN)
      totalStaked += amount
      weightedRewards += amount * rate
    }

    if (totalStaked === 0) return 0
    
    const dailyRate = weightedRewards / totalStaked
    return dailyRate * 365 * 100 // Convert to annual percentage
  }

  // Utility methods
  getLockPeriodFromTier(userStake: UserStake): LockPeriod {
    // Determine primary lock period based on largest stake
    const amounts = [
      userStake.tier0Amount.toNumber(),
      userStake.tier1Amount.toNumber(),
      userStake.tier2Amount.toNumber(),
      userStake.tier3Amount.toNumber(),
      userStake.tier4Amount.toNumber(),
    ]
    
    const maxIndex = amounts.indexOf(Math.max(...amounts))
    return maxIndex as LockPeriod
  }

  formatAmount(amount: BN, decimals: number = 9): number {
    return amount.toNumber() / Math.pow(10, decimals)
  }

  parseAmount(amount: number, decimals: number = 9): BN {
    return new BN(amount * Math.pow(10, decimals))
  }
}
