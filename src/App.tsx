// from https://avinashvazratkar446022.medium.com/how-to-fetch-all-collectibles-from-phantom-wallet-connected-to-solana-network-62dffb70f26b
import React, { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
    getParsedNftAccountsByOwner,
    isValidSolanaAddress,
    createConnectionConfig,
} from "@nfteyez/sol-rayz";
console.log("hi");

//create a connection of devnet
const createConnection = () => {
    return new Connection(clusterApiUrl("mainnet-beta"));
};

const getProvider = () => {
    if ("solana" in window) {
        const provider = window["solana"];
        if (provider.isPhantom) {
            return provider;
        }
    }
};

//get NFT
const connectData = true;
const getAllNftData = async () => {
    try {
        if (connectData === true) {
            const connect = createConnectionConfig(
                clusterApiUrl("mainnet-beta")
            );
            const provider = getProvider();
            console.log("provider", provider);
            let ownerToken = provider.publicKey;
            console.log("ownerToken");
            console.log(ownerToken);
            const result = isValidSolanaAddress(ownerToken);
            console.log("result", result);
            console.log(await connect.getAccountInfo(provider.publicKey));
            const nfts = await getParsedNftAccountsByOwner({
                publicAddress: ownerToken,
                connection: connect,
                //serialization: true,
            });
            console.log("solana nfts");
            console.log(nfts);
            return nfts;
        }
    } catch (error) {
        console.log(error);
    }
};
//Function to get all nft data
const getNftTokenData = async () => {
    console.log("getting data");
    try {
        let nftData = await getAllNftData();
        var data = Object.keys(nftData).map((key) => nftData[key]);
        let arr = [];
        let n = data.length;
        for (let i = 0; i < n; i++) {
            console.log(data[i].data.uri);
            let val = await axios.get(data[i].data.uri);
            arr.push(val);
        }
        console.log("solana arr");
        console.log(arr);
        return arr;
    } catch (error) {
        console.log(error);
    }
};

window.onload = async function () {
    await window["solana"].connect();
    getNftTokenData();
};

function App() {
    const [nftData, setNftData] = useState([]);
    const [loading, setLoading] = useState(false);
    //Define createConnection function here
    //Define getProvider function here
    //Define getAllNftData function here
    useEffect(() => {
        async function data() {
            let res = await getAllNftData();
            setNftData(res);
            setLoading(true);
        }
        data();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {nftData &&
                        nftData.length > 0 &&
                        nftData.map((val, ind) => {
                            return (
                                <div className="col-4 mt-3" key={ind}>
                                    <div className="cart text-center">
                                        <div className="img mt-4 pt-3">
                                            <img
                                                src={val.data.image}
                                                alt="loading..."
                                            />
                                            <p className="mt-1">
                                                {val.data.name}
                                            </p>
                                            <p className="mt-1">
                                                {val.data.uri}
                                            </p>
                                            <h6 className=" mt-2">
                                                {val.data.description}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                </a>
            </header>
        </div>
    );
}

export default App;
