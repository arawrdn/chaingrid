// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SessionManager {
    struct Session {
        address sessionKey;
        uint256 expiration;
        bool isActive;
    }

    mapping(address => Session) public userSessions;

    event SessionCreated(address indexed user, address sessionKey, uint256 expiration);
    event SessionRevoked(address indexed user);

    function createSession(address _sessionKey, uint256 _duration) external {
        userSessions[msg.sender] = Session({
            sessionKey: _sessionKey,
            expiration: block.timestamp + _duration,
            isActive: true
        });
        emit SessionCreated(msg.sender, _sessionKey, block.timestamp + _duration);
    }

    function isSessionValid(address _user, address _sessionKey) public view returns (bool) {
        Session memory s = userSessions[_user];
        return (s.isActive && s.sessionKey == _sessionKey && block.timestamp <= s.expiration);
    }

    function revokeSession() external {
        delete userSessions[msg.sender];
        emit SessionRevoked(msg.sender);
    }
}
