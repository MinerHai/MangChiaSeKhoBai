require("dotenv").config();
require("@nomiclabs/hardhat-ethers");

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { API_URL, PRIVATE_KEY } = process.env;

if (!API_URL || !PRIVATE_KEY) {
  console.error("❌ Missing API_URL or PRIVATE_KEY in .env file");
  process.exit(1);
}

module.exports = {
  solidity: "0.8.24",
  defaultNetwork: "volta",
  networks: {
    hardhat: {},
    volta: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      gas: 2100000,
      gasPrice: 8000000000, // 8 Gwei là hợp lý
    },
  },
};
