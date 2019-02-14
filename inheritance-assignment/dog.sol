pragma solidity 0.5.1;

import "./animal.sol";

contract DogContract is AnimalContract{

    function addDog(string memory _name, uint _age) public onlyOwner returns (uint) {
        return _addAnimal(_name, _age, AnimalType.DOG);
    }
}
