
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenA is ERC20 {
    constructor() ERC20("Token A", "TKA") {
        // Mint 100 tokens to msg.sender
        _mint(msg.sender, 100);
    }
}

// ERC20 Token Reference https://solidity-by-example.org/app/erc20/