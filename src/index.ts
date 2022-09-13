import { PrismaClient } from '@prisma/client'
import { setTimeout } from 'timers/promises'
import { readFile } from 'fs/promises'
import http from 'http'
import { getMintData } from './getMintData'

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
        const updatedNft = await prisma.nft.update({
            where: { mint },
            data: {
                ownerWalletAddress: mintData.userWalletAddress,
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