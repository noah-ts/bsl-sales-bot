import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'
import fetch from 'node-fetch'
import { setTimeout } from 'timers/promises'
import http from 'http'
import { HeliusNftEventResponseType } from './HeliusNftEventResType'
import * as dotenv from 'dotenv'
dotenv.config()

const prisma = new PrismaClient()

const API_KEY = process.env.HELIUS_API_KEY
// const address = '8m2b8ar9BNZErJQgSBwY3eCe73yR4k9qHUxxGffxyw2d'
const LAMPORTS_PER_SOL = 1000000000

// let mostRecentTxn = ''

console.log('Server started')

const main = async () => {
  let count = 0
  const nfts = await prisma.nft.findMany({ orderBy: { mint: 'asc' }, skip: 3260 })
  for (const nft of nfts) {
      // 10 seconds
      // await setTimeout(10000)
      count++
      console.log(count)
      const res = await fetch(`https://api.helius.xyz/v0/addresses/${nft.mint}/nft-events?api-key=${API_KEY}&type=NFT_SALE`)
      const data = await res.json() as HeliusNftEventResponseType[]
      if (!data.length) continue
      const event = data[0]
      const updatedNft = await prisma.nft.update({
          where: { mint: nft.mint },
          data: {
              lastSaleAmountSol: Number(event.amount) / LAMPORTS_PER_SOL,
              lastSaleDate: dayjs.unix(event.timestamp).format()
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

process.on('uncaughtException', async err => {
  console.error('Uncaught Exception: ', err)
  // console.log('Most Recent Transaction: ', mostRecentTxn)
  await prisma.$disconnect()
  process.exit(1)
})

http.createServer((req, res) => {
  res.write('Hello')
  res.end()
}).listen(8080)