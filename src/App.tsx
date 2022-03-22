import React from "react";
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
    return new Connection(clusterApiUrl("devnet"));
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
            const connect = createConnectionConfig(clusterApiUrl());
            const provider = getProvider();
            console.log("provider", provider);
            let ownerToken = provider.publicKey;
            console.log("ownerToken");
            console.log(ownerToken);
            const result = isValidSolanaAddress(ownerToken);
            console.log("result", result);
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
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
