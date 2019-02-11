pragma solidity 0.5.1;

contract DogContract{

    struct Dog {
        string name;
        uint age;
    }

    mapping(address => Dog) ownerToDog;

    function addDog(string memory _name, uint _age) public {
        require(bytes(_name).length > 0, "please provide a name");
        require(bytes(ownerToDog[msg.sender].name).length == 0, "you already have a dog");

        ownerToDog[msg.sender] = Dog(_name, _age);

        assert(ownerToDog[msg.sender].age == _age);
    }

    function getDog() public view returns (string memory) {
        address owner = msg.sender;
        return ownerToDog[owner].name;
    }

}
