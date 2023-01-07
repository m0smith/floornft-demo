import * as fc from 'fast-check' 
import { Collection, NFT, OpenSeaCollection, PrimaryAssetContracts  } from '../../src/nfts/nft'
import { addOpenSeaInfo } from  '../../src/nfts/openSeaService'

const nftArbitrary: fc.Arbitrary<NFT> = fc.record({
    address: fc.string(),
    title: fc.string(),
    description: fc.string()
})

const collectionArbitrary: fc.Arbitrary<Collection> = fc.record({
    name: fc.string(),
    nfts: fc.array(nftArbitrary),
    assets_held: fc.integer(),
    floor_price: fc.float(),
    total_supply: fc.string()
    
})

const primaryAssetContractsArbitrary: fc.Arbitrary<PrimaryAssetContracts> = fc.record({
    address: fc.string() 
})

const openSeaCollectionArbitratry: fc.Arbitrary<OpenSeaCollection> = fc.record({
    banner_image_url: fc.string(),
    chat_url: fc.string(),
    created_date: fc.string(),
    default_to_fiat: fc.boolean(),
    description: fc.string(),
    dev_buyer_fee_basis_points: fc.string(),
    dev_seller_fee_basis_points: fc.string(),
    slug: fc.string(),
    name: fc.string(),
    primary_asset_contracts: fc.array(primaryAssetContractsArbitrary)
})

describe('addOpenSeaInfo function', () => {
   
    it('should add opensea data', () =>
      fc.assert(
         fc.property(collectionArbitrary, openSeaCollectionArbitratry, (coll, openSeaColl) => {
            addOpenSeaInfo(coll, openSeaColl)
            expect(coll.slug).toEqual(openSeaColl.slug)
         })
      ))
  })