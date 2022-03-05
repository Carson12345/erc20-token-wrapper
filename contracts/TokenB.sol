
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Token B is a wrapped Token A
contract TokenB is ERC20 {
    ERC20 underlying;

    constructor(address underlyingTokenContractAddress) ERC20("Token B", "TKB") {
        underlying = ERC20(underlyingTokenContractAddress);
    }

    // Give an amount of Token B to sender
    // amount is in the unit of Token B
    function requestWrappedToken(uint amount) external payable {
        underlying.transferFrom(msg.sender, address(this), amount * 2);
        _mint(msg.sender, amount);
    }

    // Give back underlying to sender
    // amount is in the unit of Token B
    function unwrapTokenForUnderlying(uint amount) external {
        underlying.transfer(msg.sender, amount * 2);
        _burn(msg.sender, amount);
    }
}

// ERC20 Token Reference https://solidity-by-example.org/app/erc20/
// Wrapping Reference https://www.youtube.com/watch?v=CHLgAgWoUvo