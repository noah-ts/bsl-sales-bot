export type HeliusNftEventResponseType = {
    description: string
    type: 'NFT_SALE'
    source: string
    amount: BigInt
    fee: number
    feePayer: string
    signature: string
    slot: number
    timestamp: number
    saleType: string
    buyer: string
    seller: string
    staker: string
    nfts: NftType[]
}

type NftType = {
    mint: string
    tokenStandard: string
}