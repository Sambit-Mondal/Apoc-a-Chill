const ResourceTrading = artifacts.require("ResourceTrading");

contract("ResourceTrading", (accounts) => {
    it("should add and purchase a resource", async () => {
        const instance = await ResourceTrading.deployed();

        await instance.addResource("Test Resource", "Description", web3.utils.toWei("1", "ether"), 5, { from: accounts[0] });

        const resource = await instance.resources(1);
        assert.equal(resource.title, "Test Resource");

        await instance.purchaseResource(1, 2, { from: accounts[1], value: web3.utils.toWei("2", "ether") });

        const updatedResource = await instance.resources(1);
        assert.equal(updatedResource.quantity, 3);
    });
});