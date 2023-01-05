import { Alchemy, Nft, NftContract, OwnedBaseNft, OwnedBaseNftsResponse } from 'alchemy-sdk';
import { format } from 'path';
import { stringify } from 'querystring';
import { Wallet, Collection, BaseCollection, NFT } from "./nft";

const settings = {
  apiKey: process.env.API_KEY || "demo"
}

interface NftInCollection extends NFT, BaseCollection {}

// TODO: use dependency injection to make the connection so we can test it
const alchemy = new Alchemy(settings);

const getNftInfo = async (nft:OwnedBaseNft):Promise<NftInCollection> => {
    const { contract: {address}, tokenId} = nft
    const metadata = await alchemy.nft.getNftMetadata(address, tokenId)
    const [media] = metadata?.media
    const {description, title} = metadata

    const contractMetadata:NftContract = await alchemy.nft.getContractMetadata(address)
    const { openSea, totalSupply  } = contractMetadata
   
    const rtnval: NftInCollection = {
        ...nft,
        name: openSea?.collectionName || "",
        floor_price: openSea?.floorPrice || 0,
        collection_address: address,
        assets_held: 1,
        total_supply: totalSupply || "",
        thumbnail: media?.thumbnail || "",
        address,
        title,
        description
    }
    // console.log(rtnval)
    return rtnval
}


const countAssets = (acc:Map<string, Collection>, collection:Collection):Map<string, Collection> => {
    const c = JSON.stringify(collection)
    console.log(`countAssets start: ${c}`)
    const {name} = collection
    if(acc == null) {
        acc = new Map<string,Collection>()
    }
    const coll = acc?.get(name)
    console.log("coll", coll)
    if(coll) {
        coll['assets_held']++
    } else {
        acc.set(name, collection)
    }
    console.log("countAssets end")
    return acc
}

// const gatherCollections = (rawCollections:Collection[], collectionName?:string):Collection[] => {
//    const countedCollectionMap = rawCollections.reduce<Map<string,Collection>>(countAssets, new Map<string,Collection>())
//     if( ! collectionName) {
//         return Array.from(countedCollectionMap.values())
//     } else {
//         const rtnval = countedCollectionMap.get(collectionName || "")
//         if(rtnval) {
//             return [ rtnval]
//         } else {
//             return []
//         }
//     }
// }

const gatherNftsIntoCollections = (nftsWithCollections:NftInCollection[]): Collection[] => {
    const rtnval = new Map<string, Collection>()
    console.log(nftsWithCollections)
    for(let nft of nftsWithCollections){
        
        if(! rtnval.has(nft.name)) {
            let newColl = {
                nfts: [nft],
                name: nft.name,
                assets_held: 1,
                total_supply: nft.total_supply,
                floor_price: nft.floor_price,
                collection_address: nft.collection_address
            }
            rtnval.set(nft.name, newColl)
                            
        } else {
            let coll = rtnval.get(nft.name);
            if(coll) {
                coll.nfts.push(nft) 
                coll.assets_held++
            }         
        } 

    }
    console.log(rtnval)
    return Array.from(rtnval.values())
}


export class AlchemyService {
    public async getNfts(wallet: string, collectionName?:string): Promise<Wallet> {
        const nftsForOwner:OwnedBaseNftsResponse = await alchemy.nft.getNftsForOwner(wallet);
        const { ownedNfts } = nftsForOwner;
        const allNfts = await Promise.all(ownedNfts.map<Promise<NftInCollection>>(getNftInfo))
        const nftsWithCollections = allNfts.filter((n) => (!collectionName || collectionName === n.name))
 
        //const nftsWithCollections = await Promise.all(nfts)
        const collections = gatherNftsIntoCollections(nftsWithCollections)
        return {
            wallet,
            collections:collections
        }
    }
}