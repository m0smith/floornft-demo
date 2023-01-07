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
    slug?: string,
    created_date?: string
  }
  export interface Collection extends BaseCollection {
    nfts: NFT[]
  }

  export interface Wallet {
    wallet: string,
    collections: Collection[]
  }

  export interface PrimaryAssetContracts {
    address: string
}
  export interface OpenSeaCollection {
    banner_image_url:string,
    chat_url: string, 
    created_date: string,
    default_to_fiat: boolean,
    description: string,
    dev_buyer_fee_basis_points: string,
    dev_seller_fee_basis_points: string,
    slug: string,
    name: string,
    primary_asset_contracts: PrimaryAssetContracts[]

}

export interface OpenSeasCollectionResponse {
    collection: OpenSeaCollection
}

  
  