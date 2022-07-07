// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract KryptoBird is ERC721Connector {

    string[] public kryptoBirdz;
    mapping(string => bool) _kryptoBirdExists;

    function mint(string memory _kryptoBird, string memory token_name, string memory token_description, string memory token_cost) public {

        require(!_kryptoBirdExists[_kryptoBird], 'Error: kryptoBird already exists.');

        //.push function is depricated uint256 _id = KryptoBirdz.push(_kryptoBird);
        //.push no longer returns the length. it returns reference after version 6.
        kryptoBirdz.push(_kryptoBird);
        uint256 _id = kryptoBirdz.length - 1;
        _mint(msg.sender, _id);
        _setTokenName(_id, token_name);
        _setTokenDescription(_id, token_description);
        _setTokenCost(_id, token_cost);
        _kryptoBirdExists[_kryptoBird] = true;
    }

    constructor() ERC721Connector('KryptoBird', 'KBIRDZ'){
    }

}