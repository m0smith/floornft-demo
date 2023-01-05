"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemyService = void 0;
const alchemy_sdk_1 = require("alchemy-sdk");
const settings = {
    apiKey: process.env.API_KEY || "demo"
};
// TODO: use dependency injection to make the connection so we can test it
const alchemy = new alchemy_sdk_1.Alchemy(settings);
const getNftInfo = (nft) => __awaiter(void 0, void 0, void 0, function* () {
    const { contract: { address }, tokenId } = nft;
    const metadata = yield alchemy.nft.getNftMetadata(address, tokenId);
    const [media] = metadata === null || metadata === void 0 ? void 0 : metadata.media;
    const { description, title } = metadata;
    const contractMetadata = yield alchemy.nft.getContractMetadata(address);
    const { openSea, totalSupply } = contractMetadata;
    const rtnval = Object.assign(Object.assign({}, nft), { name: (openSea === null || openSea === void 0 ? void 0 : openSea.collectionName) || "", floor_price: (openSea === null || openSea === void 0 ? void 0 : openSea.floorPrice) || 0, collection_address: address, assets_held: 1, total_supply: totalSupply || "", thumbnail: (media === null || media === void 0 ? void 0 : media.thumbnail) || "", address,
        title,
        description });
    // console.log(rtnval)
    return rtnval;
});
const countAssets = (acc, collection) => {
    const c = JSON.stringify(collection);
    console.log(`countAssets start: ${c}`);
    const { name } = collection;
    if (acc == null) {
        acc = new Map();
    }
    const coll = acc === null || acc === void 0 ? void 0 : acc.get(name);
    console.log("coll", coll);
    if (coll) {
        coll['assets_held']++;
    }
    else {
        acc.set(name, collection);
    }
    console.log("countAssets end");
    return acc;
};
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
const gatherNftsIntoCollections = (nftsWithCollections) => {
    const rtnval = new Map();
    console.log(nftsWithCollections);
    for (let nft of nftsWithCollections) {
        if (!rtnval.has(nft.name)) {
            let newColl = {
                nfts: [nft],
                name: nft.name,
                assets_held: 1,
                total_supply: nft.total_supply,
                floor_price: nft.floor_price,
                collection_address: nft.collection_address
            };
            rtnval.set(nft.name, newColl);
        }
        else {
            let coll = rtnval.get(nft.name);
            if (coll) {
                coll.nfts.push(nft);
                coll.assets_held++;
            }
        }
    }
    console.log(rtnval);
    return Array.from(rtnval.values());
};
class AlchemyService {
    getNfts(wallet, collectionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const nftsForOwner = yield alchemy.nft.getNftsForOwner(wallet);
            const { ownedNfts } = nftsForOwner;
            const allNfts = yield Promise.all(ownedNfts.map(getNftInfo));
            const nftsWithCollections = allNfts.filter((n) => (!collectionName || collectionName === n.name));
            //const nftsWithCollections = await Promise.all(nfts)
            const collections = gatherNftsIntoCollections(nftsWithCollections);
            return {
                wallet,
                collections: collections
            };
        });
    }
}
exports.AlchemyService = AlchemyService;
