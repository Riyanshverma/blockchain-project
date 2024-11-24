// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Upload {
    struct File {
        string name;
        string url;
    }

    struct Access {
        address user;
        bool access; // true or false
    }

    mapping(address => File[]) public files;
    mapping(address => Access[]) public accessList;
    mapping(address => mapping(address => bool)) public ownership;
    mapping(address => mapping(address => bool)) public previousData;

    function add(address _user, string memory name, string memory url) external {
        files[_user].push(File(name, url));
    }

    function allow(address user) external {
        ownership[msg.sender][user] = true;
        if (previousData[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousData[msg.sender][user] = true;
        }
    }

    function disallow(address user) public {
        ownership[msg.sender][user] = false;
        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    function display(address _user) external view returns (File[] memory) {
        require(_user == msg.sender || ownership[_user][msg.sender], "You don't have access");
        return files[_user];
    }

    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }
}