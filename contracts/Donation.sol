// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;


contract Donation {
        event NewMessageFromDonor(
            address indexed from,
            uint256 timestamp,
            string name,
            string message
        );

        event CreatorRegistered(
            address indexed from,
            string name,
            string description
        );

        event Withdraw(
            address indexed from,
            uint256 amount
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

        mapping(address=>Creator) creators;
        
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
    function donation(string memory _name, string memory _msg, address creatorAddress) public payable {
        require(msg.value >0, "No donation are free !");

        messagesFromDonors.push(MessageFromDonor(
            msg.sender,
            block.timestamp,
            _name,
            _msg));  
                
        emit NewMessageFromDonor(
            msg.sender, 
            block.timestamp, 
            _name, 
            _msg);

        creators[creatorAddress].balance += msg.value;
    }

    /**
    @dev Fonction qui enregistre un nouveau créateur
    @param _name Nom du créateur (voir struct Creator)
    @param _description Description du créateur (voir struct Creator)
     */
    function registerCreator(string memory _name, string memory _description) public {
        require(bytes(_name).length > 0, "Name must be defined");
        require(bytes(_description).length > 0, "Description must be defined");

        creators[msg.sender] = Creator(_name, _description, 0);
        emit CreatorRegistered(msg.sender, _name, _description);
    }

    /**
    @dev Le créateur récupère ses donations
     */
    function withdraw() public {
        uint256 amount = creators[msg.sender].balance;

        require(amount>0, "Can't withdraw 0 ETH !");

        require(address(this).balance>=amount, "Not enough to withdraw");

        creators[msg.sender].balance -= amount;
        payable(msg.sender).transfer(amount);

        emit Withdraw(msg.sender, amount);
    }

    /**
    @dev Récupère tous les messages des donateurs
     */
    function getMessages() public view returns(MessageFromDonor[] memory) {
        return messagesFromDonors;
    }

}
