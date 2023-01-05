import { AlchemyService } from "./alchemyService";
import {  Wallet, Collection } from "./nft";


export class NFTsService {
  public async get(wallet: string, collection?: string): Promise<Wallet> {
    return new AlchemyService().getNfts(wallet, collection)
  }
}
