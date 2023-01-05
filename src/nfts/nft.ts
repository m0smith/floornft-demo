  export interface NFT {
    address: string,
    title: string,
    description: string

  }
  
  export interface BaseCollection {
    name: string,
    assets_held: number,
    total_supply: string,
    thumbnail?: string, // URL
    floor_price: number,
    collection_address?: string,
    slug?: string
  }
  export interface Collection extends BaseCollection {
    nfts: NFT[]
  }

  export interface Wallet {
    wallet: string,
    collections: Collection[]
  }

  
  