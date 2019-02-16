pragma solidity 0.5.1;

import "./animal.sol";

contract DogContract is AnimalContract{

    modifier costs(uint amount){
        require(msg.value >= amount, "please send at least 1000 gwei");
        _;
        if(msg.value > amount){
            msg.sender.transfer(msg.value - amount);
        }
    }
    
    function addDog(string memory _name, uint _age) public payable costs(1000) returns (uint) {
        return _addAnimal(_name, _age, AnimalType.DOG);
    }

    function getBalance() public view returns (uint){
        return address(this).balance;
    }
}
