const Web3 = require("web3");
const TokenAContract = require("../build/contracts/Rinkeby_TokenA.json");
const TokenBContract = require("../build/contracts/Rinkeby_TokenB.json");

const secrets = require("../secrets.json")
const address = '0xc6169D5224558B97fD7cec848596b6cCfD84C596';
const privateKey = secrets.mnemonic;
const HDWalletProvider = require('@truffle/hdwallet-provider');

const init = async () => {
    // const web3 = new Web3('http://localhost:7545');

    const provider = new HDWalletProvider(privateKey, `https://rinkeby.infura.io/v3/${secrets.projectId}`);
    const web3 = new Web3(provider);

    const id = await web3.eth.net.getId();

    const deployedNetworkA = TokenAContract.networks[id];
    const deployedNetworkB = TokenBContract.networks[id];

    const tokenAContractInstance = new web3.eth.Contract(
        TokenAContract.abi,
        deployedNetworkA.address
    );

    const tokenBContractInstance = new web3.eth.Contract(
        TokenBContract.abi,
        deployedNetworkB.address
    );

    let bal = await tokenAContractInstance.methods.balanceOf(address).call().then();

    console.log("Balance: ", bal);

    // If run following will use your real / test ether, so commented first

    // await tokenAContractInstance.methods.approve(tokenBContractInstance.options.address, 20).send({
    //     from: address
    // });
    // const allowance = await tokenAContractInstance.methods.allowance(address, tokenBContractInstance.options.address).call().then();

    // console.log("Allowance of account 0: ", allowance);

    // Wrap

    // await tokenBContractInstance.methods.requestWrappedToken(10).send({
    //     from: address
    // });

    // bal = await tokenAContractInstance.methods.balanceOf(address).call().then();

    // console.log("Balance after wrapping 20 Token A for 10 Token B: ", bal);

    // Unwrap

    // await tokenBContractInstance.methods.unwrapTokenForUnderlying(2).send({
    //     from: address
    // });

    // bal = await tokenAContractInstance.methods.balanceOf(address).call().then();

    // console.log("Balance after unwrapping 2 Token B for 4 Token A: ", bal);
}

init();