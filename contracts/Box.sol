// Implementation Contract
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Box {
  uint256 internal s_value;
  uint256 constant version = 1;

  event valueUpdated(uint256 indexed newValue);

  function setValue(uint256 newValue) public {
    s_value = newValue;
    emit valueUpdated(newValue);
  }

  function retrive() public view returns (uint256) {
    return s_value;
  }

  function getVersion() public pure returns (uint256) {
    return version;
  }
}
