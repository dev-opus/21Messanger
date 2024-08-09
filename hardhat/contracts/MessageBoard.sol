// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MessageBoard {
    struct Message {
        uint timestamp;
        address creator;
        string text;
        bool isSpam;
        uint claps;
        uint messageId;
    }

    Message[] messages;
    uint nextTokenId;
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function create(string memory _text) external returns (uint) {
        Message memory message = Message({
            timestamp: block.timestamp,
            creator: msg.sender,
            isSpam: false,
            text: _text,
            claps: 0,
            messageId: nextTokenId++
        });

        messages.push(message);
        return message.messageId;
    }

    function clap(uint _messageId, uint _clap) external {
        Message memory message = messages[_messageId];

        require(
            message.creator != msg.sender,
            "cannot clap for your own message"
        );

        require(
            message.isSpam == false,
            "cannot clap for a message marked as spam"
        );

        message.claps += _clap;
        messages[_messageId] = message;
    }

    function markAsSpam(uint _messageId) external returns (uint) {
        Message memory message = messages[_messageId];

        require(
            msg.sender == owner,
            "you do not have sufficient privillages to make this call"
        );

        require(message.isSpam == false, "message is already marked as spam");

        message.isSpam = true;
        messages[_messageId] = message;

        return message.messageId;
    }

    function unMarkAsSpam(uint _messageId) external returns (uint) {
        Message memory message = messages[_messageId];

        require(
            msg.sender == owner,
            "you do not have sufficient privillages to make this call"
        );

        require(
            message.isSpam == true,
            "message is already marked as non-spam"
        );

        message.isSpam = false;
        messages[_messageId] = message;

        return message.messageId;
    }

    function get() external view returns (Message[] memory) {
        return messages;
    }
}
