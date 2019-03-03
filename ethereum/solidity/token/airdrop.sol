pragma solidity ^0.4.16;


interface AlsaceHongKongToken {
    function transferFrom(address from, address to, uint tokens);
}

contract Airdrop {

    AlsaceHongKongToken public token;
    address tokenHolder;
    uint dropAmount;


    function Airdrop(address addressOfToken, address addressOfHolder, uint fixedAmount){
        token = AlsaceHongKongToken(addressOfToken);
        tokenHolder = addressOfHolder;
        dropAmount = fixedAmount;

    }

    function drop() public {
        token.transferFrom(tokenHolder,msg.sender, dropAmount);
    }
}
