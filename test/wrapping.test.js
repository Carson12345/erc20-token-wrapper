const TokenA = artifacts.require("TokenA");
const TokenB = artifacts.require("TokenB");

contract("TokenB", (accounts) => {
    it("Should get 100 Token A after first mint", async () => {
        const tkaInstance = await TokenA.deployed();
        const balance = await tkaInstance.balanceOf(accounts[0]);
        console.log("Balance of account 0: ", balance.toNumber());
        assert.equal(balance.toNumber(), 100);
    });

    it("After wrapping 10 Token B, should have 80 Token A left and 10 Token B left", async () => {
        const tkaInstance = await TokenA.deployed();
        const tkbInstance = await TokenB.deployed();
        await tkaInstance.approve(tkbInstance.address, 20, { from: accounts[0] });
        const allowance = await tkaInstance.allowance(accounts[0], tkbInstance.address);

        console.log("Allowance of account 0: ", allowance.toNumber());

        await tkbInstance.requestWrappedToken(10, {
            from: accounts[0]
        });

        const account1TokenBBalance = await tkbInstance.balanceOf(accounts[0]);
        const account1TokenABalance = await tkaInstance.balanceOf(accounts[0]);

        console.log("Account 0 Remaining token A: ", account1TokenABalance.toNumber());
        console.log("Account 0 remaining token B: ", account1TokenBBalance.toNumber());
        assert.equal(allowance.toNumber(), 20);
        assert.equal(account1TokenABalance.toNumber(), 80);
        assert.equal(account1TokenBBalance.toNumber(), 10);
    });

    it("After unwrapping 10 Token B, should have 100 Token A left and 0 Token B left", async () => {
        const tkaInstance = await TokenA.deployed();
        const tkbInstance = await TokenB.deployed();

        // wondering if approval is needed or not for burning too
        // await tkbInstance.approve(tkbInstance.address, 10, { from: accounts[0] });
        // const allowance = await tkbInstance.allowance(accounts[0], tkbInstance.address);

        // console.log("Allowance of account 0: ", allowance.toNumber());

        await tkbInstance.unwrapTokenForUnderlying(10, {
            from: accounts[0]
        });

        const account1TokenBBalance = await tkbInstance.balanceOf(accounts[0]);

        const account1TokenABalance = await tkaInstance.balanceOf(accounts[0]);

        console.log("Account 0 remaining token A: ", account1TokenABalance.toNumber());
        console.log("Account 0 remaining token B: ", account1TokenBBalance.toNumber());
        assert.equal(account1TokenABalance.toNumber(), 100);
        assert.equal(account1TokenBBalance.toNumber(), 0);
    });
});