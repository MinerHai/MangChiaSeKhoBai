const hre = require("hardhat");

async function main() {
  console.log("🚀 Bắt đầu deploy hợp đồng WarehouseRental...");

  const WarehouseRental = await hre.ethers.getContractFactory(
    "WarehouseRental"
  );
  const warehouseRental = await WarehouseRental.deploy();

  await warehouseRental.deployed(); // ✅ đúng với ethers v5

  console.log(
    `✅ Hợp đồng đã deploy thành công tại: ${warehouseRental.address}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Lỗi khi deploy:", error);
    process.exit(1);
  });
