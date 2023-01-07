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


interface AssetContractResponse {
    collection: OpenSeaCollection,
    address: string,
    slug: string
}

export const addOpenSeaInfo = (coll: Collection, openSeaColl: OpenSeaCollection):void => {
    coll.slug = openSeaColl.slug
    coll.created_date = openSeaColl.created_date
}

export const mergeOpenseaCollectionInfo = async (coll:Collection):Promise<Collection> => {
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
    
    return coll
  };
  
