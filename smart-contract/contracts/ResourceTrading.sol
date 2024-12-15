// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ResourceTrading {
    address public owner;
    uint256 public resourceCounter;

    struct Resource {
        uint256 id;
        string title;
        string description;
        uint256 price; // Price in Wei
        address seller;
        uint256 quantity;
    }

    mapping(uint256 => Resource) public resources;

    event ResourceAdded(uint256 id, string title, uint256 price, uint256 quantity, address seller);
    event ResourcePurchased(uint256 id, uint256 quantity, address buyer, uint256 totalPrice);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addResource(
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _quantity
    ) public {
        require(_price > 0, "Price must be greater than zero");
        require(_quantity > 0, "Quantity must be greater than zero");

        resourceCounter++;
        resources[resourceCounter] = Resource(resourceCounter, _title, _description, _price, msg.sender, _quantity);

        emit ResourceAdded(resourceCounter, _title, _price, _quantity, msg.sender);
    }

    function purchaseResource(uint256 _id, uint256 _quantity) public payable {
        Resource storage resource = resources[_id];
        require(resource.id != 0, "Resource does not exist");
        require(_quantity > 0, "Quantity must be greater than zero");
        uint256 totalPrice = resource.price * _quantity;
        require(msg.value == totalPrice, "Incorrect Ether sent");

        resource.quantity -= _quantity;
        payable(resource.seller).transfer(totalPrice);

        emit ResourcePurchased(_id, _quantity, msg.sender, totalPrice);
    }
}