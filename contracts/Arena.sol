// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title PlaygroundArena - On-chain betting for AI character races
/// @notice Deploy on Monad for near-instant race settlement
contract PlaygroundArena {
    address public owner;
    uint256 public raceCount;

    struct Race {
        uint256 pool;
        uint8 winner;
        bool active;
        bool settled;
    }

    mapping(uint256 => Race) public races;
    // raceId => bettor => racerIndex => amount
    mapping(uint256 => mapping(address => mapping(uint8 => uint256))) public bets;

    event RaceCreated(uint256 indexed raceId);
    event BetPlaced(uint256 indexed raceId, address indexed bettor, uint8 racer, uint256 amount);
    event RaceSettled(uint256 indexed raceId, uint8 winner, uint256 pool);
    event WinningsClaimed(uint256 indexed raceId, address indexed claimer, uint256 payout);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Create a new race for betting
    function createRace() external onlyOwner returns (uint256) {
        raceCount++;
        races[raceCount].active = true;
        emit RaceCreated(raceCount);
        return raceCount;
    }

    /// @notice Place a bet on a racer (1-4) for an active race
    function placeBet(uint256 raceId, uint8 racer) external payable {
        require(races[raceId].active, "Race not active");
        require(!races[raceId].settled, "Already settled");
        require(racer >= 1 && racer <= 4, "Invalid racer (1-4)");
        require(msg.value > 0, "Must send MON");

        bets[raceId][msg.sender][racer] += msg.value;
        races[raceId].pool += msg.value;

        emit BetPlaced(raceId, msg.sender, racer, msg.value);
    }

    /// @notice Settle race with the winning racer index (called by game server)
    function settleRace(uint256 raceId, uint8 winner) external onlyOwner {
        require(races[raceId].active, "Race not active");
        require(!races[raceId].settled, "Already settled");
        require(winner >= 1 && winner <= 4, "Invalid winner");

        races[raceId].winner = winner;
        races[raceId].settled = true;
        races[raceId].active = false;

        emit RaceSettled(raceId, winner, races[raceId].pool);
    }

    /// @notice Claim winnings from a settled race (3x payout)
    function claimWinnings(uint256 raceId) external {
        require(races[raceId].settled, "Not settled");

        uint8 winner = races[raceId].winner;
        uint256 betAmount = bets[raceId][msg.sender][winner];
        require(betAmount > 0, "No winning bet");

        bets[raceId][msg.sender][winner] = 0;

        uint256 payout = betAmount * 3;
        if (payout > address(this).balance) {
            payout = address(this).balance;
        }

        payable(msg.sender).transfer(payout);
        emit WinningsClaimed(raceId, msg.sender, payout);
    }

    /// @notice Fund the contract for payouts
    receive() external payable {}

    /// @notice Emergency withdraw (owner only)
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
