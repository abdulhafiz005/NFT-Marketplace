// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

library SafeMath {
    // build functions to perform safe math operations that would otherwise replace intuitive preventation measure.

    // function add r = x + y
    function add(uint256 x, uint256 y) internal pure returns(uint256) {
        uint256 r = x + y;
        require( r >= x, "SafeMath: Addition overflow");
        return r;
    }

    // function subtract r = x - y
    function subtract(uint256 x, uint256 y) internal pure returns(uint256) {
        require(y <= x, "SafeMath: Subtraction overflow");
        uint256 r = x - y;
        return r;
    }

    // function multiply r = x * y
    function multiply(uint256 x, uint256 y) internal pure returns(uint256) {
        // gas optimization
        if(x == 0) {
            return 0;
        }

        uint256 r = x * y;
        require( r / x == y, "SafeMath: Multiplication overflow");
        return r;
    }

    // function divide r = x / y
    function divide(uint256 x, uint256 y) internal pure returns(uint256) {
        require( y > 0, "SafeMath: Division by zero");
        uint256 r = x / y;
        return r;
    }

    // gas spending remains untouched
    // function modulo r = x % y
    function modulo(uint256 x, uint256 y) internal pure returns(uint256) {
        require( y != 0, "SafeMath: Modulo by zero");
        uint256 r = x % y;
        return r;
    }
}