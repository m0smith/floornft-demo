import axios from 'axios'

import { Collection, OpenSeaCollection, OpenSeasCollectionResponse } from "./nft";

const API = process.env.OPENSEA_API

const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': 'demo'
    }
  }



interface Asset{
    name:string,
    image_url: string,
    token_id: string
}

interface AssetResponse {
    assets: Asset[]    
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

export const fetchOwnCollection = async (coll:Collection):Promise<Collection> => {
    if(!coll) {
        return coll
    }
    
    const {data, status} = await axios.get<AssetContractResponse>(
        `${API}/asset_contract/${coll.collection_address}`,
        options)

        const {data: openSeaCollection , status: collectionStatus} = await axios.get<OpenSeasCollectionResponse>(
        `${API}/collection/${data.collection.slug}`,
        options)

    const {collection} = openSeaCollection
    console.log(collection)

    coll.slug = collection.slug
    coll.created_date = collection.created_date
    
    return coll
  };
  
