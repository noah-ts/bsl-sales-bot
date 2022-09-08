import { PrismaClient, User } from '@prisma/client'
import dayjs from 'dayjs'
import fetch from 'node-fetch'
import { setTimeout } from 'timers/promises'
import http from 'http'
import { HeliusNftEventResponseType } from './HeliusNftEventResType'
import * as dotenv from 'dotenv'
import { NotFoundError } from '@prisma/client/runtime/index.js'
dotenv.config()

const prisma = new PrismaClient()

const API_KEY = process.env.HELIUS_API_KEY
const address = '8m2b8ar9BNZErJQgSBwY3eCe73yR4k9qHUxxGffxyw2d'
const LAMPORTS_PER_SOL = 1000000000

let mostRecentTxn = ''

console.log('Server started')

// const salesBot = async () => {
//   while (true) {
//     try {
//       // 5 minutes
//       await setTimeout(300000)
//       const res = await fetch(`https://api.helius.xyz/v0/addresses/${address}/nft-events?type=NFT_SALE&api-key=${API_KEY}&until=${mostRecentTxn}`)
//       const data = await res.json() as HeliusNftEventResponseType[]
//       if (!data.length) continue
    
//       for (let i = data.length - 1; i >= 0; i--) {
//         const event = data[i]
//         let user: User

//         try {
//           user = await prisma.user.findFirstOrThrow({ where: { walletAddress: event.buyer } })
//         } catch (error) {
//           if (error instanceof NotFoundError) {
//             user = await prisma.user.create({
//               data: { walletAddress: event.buyer }
//             })
//           } else {
//             console.error(error)
//             continue
//           }
//         }

//         const n = await prisma.nft.update({
//           where: { mint: event.nfts[0].mint },
//           data: {
//             ownerWalletAddress: user.walletAddress,
//             lastSaleDate: dayjs.unix(event.timestamp).format(),
//             lastSaleAmountSol: Number(event.amount) / LAMPORTS_PER_SOL
//           }
//         })
//         console.log(n)
//       }
    
//       mostRecentTxn = data[0].signature
//     } catch (err) {
//       console.error(err)
//       continue
//     }
//   }
// }

// salesBot()

process.on('uncaughtException', async err => {
  console.error('Uncaught Exception: ', err)
  console.log('Most Recent Transaction: ', mostRecentTxn)
  await prisma.$disconnect()
  process.exit(1)
})

http.createServer((req, res) => {
  res.write('Hello')
  res.end()
}).listen(8080)