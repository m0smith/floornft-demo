import axios from 'axios'

import { Collection } from "./nft";

const API = process.env.OPENSEA_API

const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': 'demo'
    }
  }

interface PrimaryAssetContracts {
    address: string
}

interface Asset{
    name:string,
    image_url: string,
    token_id: string
}

interface AssetResponse {
    assets: Asset[]    
}

interface OpenSeaCollection {
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

interface CollectionsResponse {
    collection: OpenSeaCollection[]
}

interface AssetContractResponse {
    collection: OpenSeaCollection,
    address: string,
    slug: string
}

interface CollectionSummary {
    details: string,
    slug: string,
    name: string,
    contractAddress: string,
    owned: Asset
}

export const fetchOwnCollection = async (coll:Collection) => {
    if(!coll) {
        return {}
    }
    console.log(coll)
    console.log(`Fetching asset ${API} ${coll.collection_address}`)
    
    const {data, status} = await axios.get<AssetContractResponse>(
        `${API}/asset_contract/${coll.collection_address}`,
        options)

    console.log("Fetching coll")
    const {data: collection , status: collectionStatus} = await axios.get<Collection>(
        `${API}/collection/${data.collection.slug}`,
        options)
  
    return collection
  };
  
