import { PrismaClient, Status, User } from '@prisma/client'
import { setTimeout } from 'timers/promises'
import { readFile } from 'fs/promises'
import http from 'http'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import dayjs from 'dayjs'
import * as dotenv from 'dotenv'
import { NotFoundError } from '@prisma/client/runtime/index.js'
dotenv.config()

const SOL_CLUSTER_URL = process.env.SOL_CLUSTER_URL
const connection = new Connection(SOL_CLUSTER_URL)

// <mint, until>
const untilMap: Map<string, string> = new Map()

type MintData = {
    status: Status
    userWalletAddress: string
    lastSaleAmountSol?: number
    lastSaleDate?: string
}

const getMintData = async (mint: string): Promise<MintData> => {
    try {
        const mintPubKey = new PublicKey(mint)

        const signatures = await connection.getSignaturesForAddress(mintPubKey, { until: untilMap.get(mint) })
        if (!signatures?.length) return null
        untilMap.set(mint, signatures[0].signature)

        const transactions = await connection.getParsedTransactions(signatures.map(s => s.signature))

        for (const transaction of transactions) {
            if (!transaction
                || !transaction.meta
                || !transaction.meta.logMessages?.length
                || !transaction.meta.postTokenBalances?.length
                || !transaction.meta.preTokenBalances?.length
            ) continue

            const postTokenBalances = transaction.meta.postTokenBalances
            const preTokenBalances = transaction.meta.preTokenBalances
            const userWalletAddress = postTokenBalances[postTokenBalances.length - 1]?.owner
            const listedUserWalletAddress = preTokenBalances[preTokenBalances.length - 1]?.owner

            const logMessages = transaction.meta.logMessages

            for (const logMessage of logMessages) {
                if (logMessage === 'Program log: Instruction: Buy') {
                    return {
                        status: 'HELD_BY_OWNER',
                        userWalletAddress,
                        lastSaleAmountSol: getPrice(logMessages),
                        lastSaleDate: dayjs.unix(transaction.blockTime).format()
                    }
                }

                if (logMessage === 'Program log: unstake' || logMessage === 'Program log: Instruction: CancelSell') {
                    return { status: 'HELD_BY_OWNER', userWalletAddress }
                }

                if (logMessage === 'Program log: stake' || logMessage.includes('Program log: 1 gems deposited into') || logMessage.includes('Program log: Instruction: InitializeAccount')) {
                    return { status: 'STAKED', userWalletAddress }
                }

                if (logMessage === 'Program log: Instruction: Sell') {
                    return { status: 'LISTED', userWalletAddress: listedUserWalletAddress }
                }
            }
        }

        return null
    } catch (error) {
        console.error(error)
        return null
    }
}

const getPrice = (logs: string[]): number => {
    for (const log of logs) {
        const arr = log.split(' ')
        if (arr.length !== 3) continue

        const json = arr[2]
        if (json[0] !== '{' && json[json.length - 1] !== '}') continue

        const obj = JSON.parse(json)
        return obj.price / LAMPORTS_PER_SOL
    }
    return null
}

const prisma = new PrismaClient()

const main = async () => {
    // 2 minutes
    await setTimeout(120000)

    const json = await readFile('./collection_mints/blocksmith_labs_mints.json', { encoding: 'utf-8' })
    const data = JSON.parse(json)
    const mints: string[] = data.mints.map(m => m.mint)

    for (const mint of mints) {
        const mintData = await getMintData(mint)
        if (!mintData) continue

        let user: User
        try {
            user = await prisma.user.findUniqueOrThrow({ where: { walletAddress: mintData.userWalletAddress } })
        } catch (error) {
            if (error instanceof NotFoundError) {
                user = await prisma.user.create({
                    data: { walletAddress: mintData.userWalletAddress }
                })
            } else {
                console.error(error)
                continue
            }
        }

        const updatedNft = await prisma.nft.update({
            where: { mint },
            data: {
                ownerWalletAddress: user.walletAddress,
                status: mintData.status,
                lastSaleDate: mintData.lastSaleDate ? mintData.lastSaleDate : undefined,
                lastSaleAmountSol: mintData.lastSaleAmountSol ? mintData.lastSaleAmountSol : undefined
            }
        })
        console.log(updatedNft)
    }
}

main()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

process.on('uncaughtException', async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})

process.on('unhandledRejection', async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})

http.createServer((req, res) => {
  res.write('Hello')
  res.end()
}).listen(8080)