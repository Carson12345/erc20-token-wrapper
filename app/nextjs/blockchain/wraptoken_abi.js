import Web3 from "web3";
import TokenAContract from "../../../build/contracts/Rinkeby_TokenA.json";
import TokenBContract from "../../../build/contracts/Rinkeby_TokenB.json";

// const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/33ff9656df9c4eb39e4bf0f114cec86b');

// const web3 = new Web3(provider)

export const TokenAContractData = TokenAContract;
export const TokenBContractData = TokenBContract;

export const InitContract = (contractData, web3) => {
    return new web3.eth.Contract(
        contractData.abi,
        contractData.networks[4].address
    )
}