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
exports.NFTsService = void 0;
const alchemyService_1 = require("./alchemyService");
const openSeaService_1 = require("./openSeaService");
class NFTsService {
    get(wallet, collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const walletValue = yield new alchemyService_1.AlchemyService().getNfts(wallet, collection);
            for (let coll of walletValue.collections) {
                yield (0, openSeaService_1.fetchOwnCollection)(coll);
            }
            return walletValue;
        });
    }
}
exports.NFTsService = NFTsService;
