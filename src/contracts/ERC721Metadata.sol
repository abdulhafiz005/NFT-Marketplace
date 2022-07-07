// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './interfaces/IERC721Metadata.sol';
import './libraries/Strings.sol';
import './ERC165.sol';

contract ERC721Metadata is IERC721Metadata, ERC165 {

    string private _name;
    string private _symbol;
    mapping(uint256 => string) private _tokenName;
    mapping(uint256 => string) private _tokenDescription;
    mapping(uint256 => string) private _tokenCost;

    constructor(string memory named, string memory symbolified) {
        _name = named;
        _symbol = symbolified;

        _registerInterface(bytes4(
            keccak256('name(bytes4)')^
            keccak256('symbol(bytes4)')^
            keccak256('tokenURI(bytes4)')
        ));
    }

    function name() external view override returns (string memory) {
        return _name;
    }

    function symbol() external view override returns (string memory) {
        return _symbol;
    }

    function tokenName(uint256 tokenId) external view returns (string memory){
        return _tokenName[tokenId];
    }

    function _setTokenName(uint256 tokenId, string memory token_name) internal {
        _tokenName[tokenId] = token_name;
    }

    function tokenDescription(uint256 tokenId) external view returns (string memory){
        return _tokenDescription[tokenId];
    }

    function _setTokenDescription(uint256 tokenId, string memory token_description) internal {
        _tokenDescription[tokenId] = token_description;
    }

    function tokenCost(uint256 tokenId) external view returns (string memory){
        return _tokenCost[tokenId];
    }

    function _setTokenCost(uint256 tokenId, string memory token_cost) internal {
        _tokenCost[tokenId] = token_cost;
    }
    
    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

    /**
     * @dev Base URI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`. Empty
     * by default, can be overriden in child contracts.
     */
    function _baseURI() internal view virtual returns (string memory) {
        return "";
    }
}