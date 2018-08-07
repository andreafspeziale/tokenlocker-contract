pragma solidity ^0.4.24;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract TokenLocker is Ownable {
    
    mapping(address => uint256) public balance;
    mapping(address => uint256) public expireLockTimestamp;

    event LogRelease(address indexed holder, uint256 expireLockTimestamp, uint256 amount);
    event LogWithdraw(address from, address indexed token, uint amount);

    ERC20 public token;
    
    constructor(
        address[] _holders,
        uint256[] _amounts,
        uint256[] _expireLockTimestamps,
        ERC20 _token
    ) public {
        // revert if token address = 0
        require(address(_token) != 0);
        // revert if holders array is empty
        require(_holders.length != 0);
        // revert if amount array is empty                            
        require(_amounts.length != 0);
        // revert if unlockTimeStamps array is empty
        require(_expireLockTimestamps.length != 0);
        // revert if holders array shorter or longer than amounts array
        require(_holders.length == _amounts.length);
        // revert if amounts array shorter or longer than unlockTimeStamps array
        require(_amounts.length == _expireLockTimestamps.length);
        
        token = _token;
        
        for(uint i = 0; i < _holders.length; i++) {
            // revert if one of the holders address is 0
            require(_holders[i] != 0);
            // revert if one of the amounts is 0
            require(_amounts[i] != 0);
            // revert if one of the expiration date is not in the future
            require(_expireLockTimestamps[i] > block.timestamp);
            balance[_holders[i]] = _amounts[i];
            expireLockTimestamp[_holders[i]] = _expireLockTimestamps[i];
        }
    }

    function release(address _to) 
        internal 
        returns(bool) 
    {
        // revert if to = 0
        require(_to != 0);
        // revert if the expire lock timestamp is not met
        require(block.timestamp >= expireLockTimestamp[_to]);
        uint256 amount = balance[_to];
        // revert if the claimer holder does not have any balance assigned
        require(amount != 0);                                  
        uint256 contractTokenBalance = token.balanceOf(this);
        // revert if the token contract balance is >= to the total amount to be distributed
        require(contractTokenBalance >= amount);
        balance[_to] = 0;
        token.transfer(_to, amount);
        emit LogRelease(_to, block.timestamp, amount);
        return true;
    }

    function withdraw(address _to, ERC20 _token)
        onlyOwner 
        public 
        returns(bool)
    {
        // revert if the passed token is 0
        require(address(_token) != 0);
        // revert if owner attempt to withdraw the locked tokens 
        require(_token != token);
        // revert if recipient = 0
        require(_to != 0);
        uint256 airdroppedTokenAmount = _token.balanceOf(this);
        require(airdroppedTokenAmount > 0);                      // revert if contract does not have any balance of the required token
        _token.transfer(_to, airdroppedTokenAmount);
        emit LogWithdraw(msg.sender, _token, airdroppedTokenAmount);
        return true;
    }

    function() public {
        release(msg.sender);
    }
}