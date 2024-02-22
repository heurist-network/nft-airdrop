// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./BaseScript.sol";
import "../src/HeuristImaginaries.sol";

contract DeploySepolia is BaseScript {

    constructor() BaseScript() {}

    function run() external {
        deploy(_chainId());
    }

    function deploy(uint256 chainId) public {
        string memory chain = loadChainName(chainId);
        if (tryLoadDeployment(chain, "HeuristImaginaries") == address(0)) {
            vm.startBroadcast(broadcasterPK);
            HeuristImaginaries nft = new HeuristImaginaries(
                "Heurist Imaginaries",
                "HUE-IMG",
                "https://imaginaries.heurist.ai/"
            );
            vm.stopBroadcast();
            saveDeployment(
                chain,
                "HeuristImaginaries",
                "HeuristImaginariesSepolia",
                address(nft)
            );
        }
    }
}

contract DeployMainnet is BaseScript {
    constructor() BaseScript() {}

    function run() external {
        deploy(_chainId());
    }

    function deploy(uint256 chainId) public {
        string memory chain = loadChainName(chainId);
        if (tryLoadDeployment(chain, "HeuristImaginaries") == address(0)) {
            vm.startBroadcast(broadcasterPK);
            HeuristImaginaries nft = new HeuristImaginaries(
                "Heurist Imaginaries",
                "HUE-IMG",
                "https://imaginaries.heurist.ai/"
            );
            vm.stopBroadcast();
            saveDeployment(
                chain,
                "HeuristImaginaries",
                "HeuristImaginariesMainnet",
                address(nft)
            );
        }
    }
}