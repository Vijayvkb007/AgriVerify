// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract AgriVerify {
    
    address public owner;
    string public name;
    mapping(address => Farmer) public farmers;
    mapping(uint => Crop) public crops;
    uint public cropCount;

    struct Farmer {
        string name;
        uint16 age;
        address farmerAdd;
    }

    struct Crop {
        string name;
        uint id;
        string ctype;
        uint price;
        address farmerAdd;
        address verifierAdd;
        bool isVerified;
    }

    constructor() {
        owner = msg.sender;
        name = "AgriVerify";
    }

    event RegisterFarmer(
        string name,
        uint16 age,
        address farmerAdd
    );

    event RegisterCrop(
        string name,
        string ctype,
        uint price,
        address farmerAdd
    );

    event VerifiedCrop(
        uint id,
        address verifierAdd,
        bool isVerified
    );

    function addFarmer(string memory _name, uint16 _age) public {
        require(farmers[msg.sender].farmerAdd == address(0), "Farmer already registered");
        require(bytes(_name).length > 0, "Name is required");
        require(_age > 0, "Age is required");

        farmers[msg.sender] = Farmer(_name, _age, msg.sender);
        emit RegisterFarmer(_name, _age, msg.sender);
    }

    function addCrop(string memory _name, string memory _ctype, uint _price) public {
        require(_price > 0, "Price is required");
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_ctype).length > 0, "Type is required");
        cropCount++;
        crops[cropCount] = Crop(_name, cropCount, _ctype, _price, msg.sender, address(0), false);
        emit RegisterCrop(_name, _ctype, _price, msg.sender);
    }

    function verifyCrop(uint _id) public {
        require(_id > 0 && _id <= cropCount, "Invalid crop id");
        Crop memory crop = crops[_id];
        require(crop.isVerified == false, "Crop is already verified");
        require(msg.sender != crop.farmerAdd, "You can't verify your own crop");
        crop.isVerified = true;
        crop.verifierAdd = msg.sender;
        emit VerifiedCrop(_id, msg.sender, true);
    }
}