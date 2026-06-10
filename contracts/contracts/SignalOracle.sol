// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SignalOracle {
    address public owner;
    
    struct MarketSignal {
        string symbol;
        string recommendation; // BUY, SELL, HOLD
        uint256 confidence; // 0-100
        uint256 timestamp;
        uint256 rsi;
        int256 macd;
    }
    
    mapping(string => MarketSignal) public signals;
    mapping(address => bool) public signalers;
    
    event SignalUpdated(string indexed symbol, string recommendation, uint256 confidence);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    modifier onlySignaler() {
        require(signalers[msg.sender], "Not a signaler");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        signalers[msg.sender] = true;
    }
    
    function updateSignal(
        string memory symbol,
        string memory recommendation,
        uint256 confidence,
        uint256 rsi,
        int256 macd
    ) public onlySignaler {
        require(confidence <= 100, "Invalid confidence");
        require(
            keccak256(abi.encodePacked(recommendation)) == keccak256(abi.encodePacked("BUY")) ||
            keccak256(abi.encodePacked(recommendation)) == keccak256(abi.encodePacked("SELL")) ||
            keccak256(abi.encodePacked(recommendation)) == keccak256(abi.encodePacked("HOLD")),
            "Invalid recommendation"
        );
        
        signals[symbol] = MarketSignal({
            symbol: symbol,
            recommendation: recommendation,
            confidence: confidence,
            timestamp: block.timestamp,
            rsi: rsi,
            macd: macd
        });
        
        emit SignalUpdated(symbol, recommendation, confidence);
    }
    
    function getSignal(string memory symbol) public view returns (MarketSignal memory) {
        return signals[symbol];
    }
    
    function addSignaler(address signaler) public onlyOwner {
        signalers[signaler] = true;
    }
    
    function removeSignaler(address signaler) public onlyOwner {
        signalers[signaler] = false;
    }
}
