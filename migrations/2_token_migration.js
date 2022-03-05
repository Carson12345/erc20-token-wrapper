const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");

module.exports = async function (deployer) {
    await deployer.deploy(TokenA, "Token A", "TKA");
    const instanceA = await TokenA.deployed();
    await deployer.deploy(TokenB, instanceA.address);
};

// Reference https://trufflesuite.com/docs/truffle/getting-started/running-migrations.html