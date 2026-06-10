// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPancakeSwapRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);

    function swapExactETHForTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable returns (uint[] memory amounts);
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract TradingAgent {
    address public owner;
    IPancakeSwapRouter public router;
    address constant WBNB = 0xbb4CdB9CBd36B01bD1cbaAedF2c578Cc89C8fb4A; // BSC mainnet
    address constant USDT = 0x55d398326f99059fF775485246999027B3197955; // BSC mainnet
    
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public tradeCount;
    
    event TradeExecuted(address indexed token, uint256 amount, string side);
    event SignalReceived(string signal, uint256 confidence);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor(address _router) {
        owner = msg.sender;
        router = IPancakeSwapRouter(_router);
        whitelist[msg.sender] = true;
    }

    function executeSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) public returns (uint256[] memory amounts) {
        require(whitelist[msg.sender], "Not whitelisted");
        
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenIn).approve(address(router), amountIn);
        
        address[] memory path = new address[](2);
        path[0] = tokenIn;
        path[1] = tokenOut;
        
        amounts = router.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            msg.sender,
            block.timestamp + 300
        );
        
        emit TradeExecuted(tokenIn, amountIn, "SWAP");
        tradeCount[msg.sender]++;
        
        return amounts;
    }

    function receiveSignal(string memory signal, uint256 confidence) public onlyOwner {
        require(confidence <= 100, "Invalid confidence");
        emit SignalReceived(signal, confidence);
    }

    function addToWhitelist(address account) public onlyOwner {
        whitelist[account] = true;
    }

    function removeFromWhitelist(address account) public onlyOwner {
        whitelist[account] = false;
    }

    function getTradeCount(address account) public view returns (uint256) {
        return tradeCount[account];
    }
}
