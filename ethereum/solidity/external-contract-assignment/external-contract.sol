pragma solidity 0.5.1;

contract DogContract{

    function addDog(string memory _name, uint _age) public payable returns (uint);

    function getBalance() public view returns (uint);

    function getAnimal(uint _id) public view returns (string memory);
}

contract ExternalContract {

    DogContract dc = DogContract(0x8046085fb6806cAa9b19a4Cd7b3cd96374dD9573);

    function addExternalDog(string memory _name, uint _age) public payable returns (uint){
        return dc.addDog.value(msg.value)(_name, _age);
    }

    function getExternalBalance() public view returns (uint){
        return dc.getBalance();
    }
    function getAnimal(uint _id) public view returns (string memory) {
        return dc.getAnimal(_id);
    }
}
