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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOwnCollection = void 0;
const axios_1 = __importDefault(require("axios"));
const API = process.env.OPENSEA_API;
const options = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        'X-API-KEY': 'demo'
    }
};
const fetchOwnCollection = (coll) => __awaiter(void 0, void 0, void 0, function* () {
    if (!coll) {
        return coll;
    }
    const { data, status } = yield axios_1.default.get(`${API}/asset_contract/${coll.collection_address}`, options);
    const { data: openSeaCollection, status: collectionStatus } = yield axios_1.default.get(`${API}/collection/${data.collection.slug}`, options);
    const { collection } = openSeaCollection;
    console.log(collection);
    coll.slug = collection.slug;
    coll.created_date = collection.created_date;
    return coll;
});
exports.fetchOwnCollection = fetchOwnCollection;
