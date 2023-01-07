import { AlchemyService } from "./alchemyService";
import {  Wallet, Collection } from "./nft";
import { mergeOpenseaCollectionInfo  } from "./openSeaService";


export class NFTsService {
  public async get(wallet: string, collection?: string): Promise<Wallet> {
    const walletValue = await new AlchemyService().getNfts(wallet, collection)
    for( let coll of walletValue.collections) {
      await mergeOpenseaCollectionInfo(coll)
    }
    return walletValue
  }
}
