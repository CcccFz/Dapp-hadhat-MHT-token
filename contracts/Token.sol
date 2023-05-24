// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract Token {
    string public name = 'My Hardhat Token';
    string public symbol = "MHT";

    address public owner;
    uint256 public supply = 10000;

    mapping(address => uint256) balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _amount);
    event ReceiveETH(address indexed _from, uint256 _amount);

    constructor() {
        owner = msg.sender;
        balances[msg.sender] = supply;
    }

    // receive() external payable {
    //     emit ReceiveETH(msg.sender, msg.value);
    // }

    fallback() external payable {
        emit ReceiveETH(msg.sender, msg.value);
    }

    function transfer(address _to, uint256 _amount) external {
        require(balances[msg.sender] >= _amount, "Not enough tokens");

        console.log(
            'Transferring from %s to %s %s tokens',
            msg.sender,
            _to,
            _amount
        );

        balances[msg.sender] -= _amount;
        balances[_to] += _amount;

        emit Transfer(msg.sender, _to, _amount);
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}