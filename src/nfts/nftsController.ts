import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Route,
    SuccessResponse,
  } from "tsoa";
  import { Wallet, Collection } from "./nft";
  import { NFTsService } from "./nftsService";
  import { fetchOwnCollection  } from "./openSeaService";
  
  @Route("nfts")
  export class NFTsController extends Controller {
    @Get("{wallet}")
    public async getNFT(
      @Path() wallet: string,
      @Query() collection?: string
    ): Promise<Wallet> {
      // console.log(await fetchOwnCollection())
      console.log(`Calling NFTService ${wallet} ${collection}`)
      const walletValue = await new NFTsService().get(wallet, collection)
      for( let collectionValue of walletValue.collections) {
        fetchOwnCollection(collectionValue)
      }
      return walletValue;
    }
  

  }
  