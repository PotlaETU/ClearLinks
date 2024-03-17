// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Donation {
    event NewMessageFromDonor(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    struct MessageFromDonor {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
}
