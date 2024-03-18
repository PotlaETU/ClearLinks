// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract Donation {
    event NewMessageFromDonor(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    // Message donateur type
    struct MessageFromDonor {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }

    // Créateur type
    struct Creator{
        string name;
        string description;
        uint256 balance;
    }

    // Liste des donations (avec message) reçues
    MessageFromDonor[] messagesFromDonors;

    mapping (address=>Creator) creators;

    /*Adresse vers laquelle on donne*/
    address payable owner;

    constructor(){
        owner = payable(msg.sender);
    }

    /**
    @dev Fonction qui permet de faire une donation
    @param _name Nom du donateur 
    @param _msg Message du donateur
     */
    function name(string memory _name, string memory _msg, address creatorAddress) public payable {
        require(msg.value >0, "No donation are free !");

        messagesFromDonors.push(MessageFromDonor(
            msg.sender,block.timestamp,
            _name,_msg)
            );  
    }
}
