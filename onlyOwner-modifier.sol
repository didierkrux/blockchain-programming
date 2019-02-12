pragma solidity 0.5.1;

contract DogContract{

    struct Dog {
        string name;
        uint age;
    }

    address owner;

    modifier onlyNewOwners(){
        require(bytes(ownerToDog[msg.sender].name).length == 0, "you already have a dog");
        _;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "you are not the owner");
        _;
    }

    mapping(address => Dog) ownerToDog;

    constructor() public{
        owner = msg.sender;
    }

    function addDog(string memory _name, uint _age) public onlyNewOwners{
        require(bytes(_name).length > 0, "please provide a name");
        ownerToDog[msg.sender] = Dog(_name, _age);
        assert(ownerToDog[msg.sender].age == _age);
    }

    function getDog() public view returns (string memory) {
        return ownerToDog[msg.sender].name;
    }

    function deleteDog(address _address) public onlyOwner {
        delete ownerToDog[_address];
    }

}
