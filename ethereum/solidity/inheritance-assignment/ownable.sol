pragma solidity 0.5.1;

contract Ownable{

    address public owner;

    modifier onlyOwner(){
        require(msg.sender == owner, "you are not the owner");
        _;
    }

    constructor() public{
        owner = msg.sender;
    }
    
    function transferContract(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "uncorrect address");
        owner = _newOwner;
    }
}
