const LendingAgency = artifacts.require("LendingAgency");

module.exports = function (deployer) {
  deployer.deploy(LendingAgency);
};
