const ResourceTrading = artifacts.require("ResourceTrading");

module.exports = function (deployer) {
    deployer.deploy(ResourceTrading);
};