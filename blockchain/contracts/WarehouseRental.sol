// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title WarehouseRental
/// @notice Quản lý deposit & thanh toán cho thuê kho. Metadata (mô tả, ảnh, vị trí, v.v.) lưu ở backend.
/// Flow:
/// 1) Owner register (claim) warehouseId và set price/deposit on-chain.
/// 2) Renter gọi `rent` gửi (pricePerDay * days + deposit).
/// 3) Khi hết hạn, bất kỳ ai cũng có thể gọi `endLease` để chuyển tiền: price -> owner, deposit -> renter.
contract WarehouseRental {
    // -------------------------
    // Data structures
    // -------------------------
    struct Warehouse {
        address owner;        // wallet owner (on-chain)              <-- (1)
        uint256 pricePerDay;  // wei per day                          <-- (2)
        uint256 deposit;      // wei deposit amount                   <-- (2)
        bool exists;          // marker that warehouse was registered
    }

    struct Rental {
        address renter;
        uint256 pricePaid;      // total price paid for duration (wei)
        uint256 depositAmount;  // deposit (wei)
        uint256 startTime;      // block.timestamp when rent started
        uint256 durationDays;   // rental duration in days (uint)
        bool active;
    }

    // warehouseId (from backend) => Warehouse
    mapping(uint256 => Warehouse) public warehouses;

    // warehouseId => current Rental (if any)
    mapping(uint256 => Rental) public rentals;

    // -------------------------
    // Events (for backend to listen)
    // -------------------------
    event WarehouseRegistered(
        uint256 indexed warehouseId,
        address indexed owner,
        uint256 pricePerDay,
        uint256 deposit
    );

    event WarehouseUpdated(
        uint256 indexed warehouseId,
        address indexed owner,
        uint256 pricePerDay,
        uint256 deposit
    );

    event Rented(
        uint256 indexed warehouseId,
        address indexed renter,
        uint256 pricePaid,
        uint256 depositAmount,
        uint256 startTime,
        uint256 durationDays
    );

    event LeaseEnded(
        uint256 indexed warehouseId,
        address indexed owner,
        address indexed renter,
        uint256 pricePaid,
        uint256 depositAmount,
        uint256 endTime
    );

    event RefundIssued(
        uint256 indexed warehouseId,
        address indexed to,
        uint256 amount
    );

    // -------------------------
    // Simple reentrancy guard
    // -------------------------
    bool private locked;

    modifier nonReentrant() {
        require(!locked, "Reentrant");
        locked = true;
        _;
        locked = false;
    }

    // -------------------------
    // Registration / owner functions
    // -------------------------

    /// @notice Register a warehouse on-chain (claim ownership) or update parameters if caller is owner.
    /// @param warehouseId The ID coming from your backend (must be consistent).
    /// @param pricePerDay Wei amount charged per day.
    /// @param deposit Wei deposit required.
    function registerWarehouse(
        uint256 warehouseId,
        uint256 pricePerDay,
        uint256 deposit
    ) external {
        Warehouse storage w = warehouses[warehouseId];

        if (!w.exists) {
            // first-time registration: caller becomes owner
            w.owner = msg.sender;                       // (1)
            w.pricePerDay = pricePerDay;                // (2)
            w.deposit = deposit;                        // (2)
            w.exists = true;
            emit WarehouseRegistered(warehouseId, msg.sender, pricePerDay, deposit);
        } else {
            // update: only owner can update on-chain params
            require(w.owner == msg.sender, "Not owner");
            w.pricePerDay = pricePerDay;
            w.deposit = deposit;
            emit WarehouseUpdated(warehouseId, msg.sender, pricePerDay, deposit);
        }
    }

    /// @notice Owner can change price and deposit later.
    function updatePricing(uint256 warehouseId, uint256 pricePerDay, uint256 deposit) external {
        Warehouse storage w = warehouses[warehouseId];
        require(w.exists, "Warehouse not registered");
        require(w.owner == msg.sender, "Not owner");
        w.pricePerDay = pricePerDay;
        w.deposit = deposit;
        emit WarehouseUpdated(warehouseId, msg.sender, pricePerDay, deposit);
    }

    // -------------------------
    // Renting / deposit / payment
    // -------------------------

    /// @notice Renter starts rental by sending (pricePerDay * durationDays + deposit) in msg.value.
    /// @param warehouseId ID of warehouse to rent.
    /// @param durationDays Number of days to rent (uint, >0).
    function rent(uint256 warehouseId, uint256 durationDays) external payable nonReentrant {
        require(durationDays > 0, "duration must be > 0");
        Warehouse storage w = warehouses[warehouseId];
        require(w.exists, "Warehouse not registered");

        Rental storage r = rentals[warehouseId];
        require(!r.active, "Already rented");

        // compute required amounts (Solidity 0.8 has overflow checks)
        uint256 price = w.pricePerDay * durationDays;          // (3)
        uint256 requiredTotal = price + w.deposit;             // (4)

        require(msg.value == requiredTotal, "Incorrect payment amount");

        // record rental (effects before interactions)
        r.renter = msg.sender;
        r.pricePaid = price;
        r.depositAmount = w.deposit;
        r.startTime = block.timestamp;
        r.durationDays = durationDays;
        r.active = true;

        emit Rented(warehouseId, msg.sender, price, w.deposit, r.startTime, durationDays);
    }

    /// @notice End the lease once duration has passed. Anyone can call to settle funds.
    /// Transfers price -> owner and deposit -> renter.
    /// Uses checks-effects-interactions pattern and nonReentrant guard.
    function endLease(uint256 warehouseId) external nonReentrant {
        Rental storage r = rentals[warehouseId];
        require(r.active, "No active rental");

        uint256 endTime = r.startTime + (r.durationDays * 1 days); // (5)
        require(block.timestamp >= endTime, "Lease still active");

        // effects: mark inactive and snapshot values to local variables
        r.active = false;
        uint256 pricePaid = r.pricePaid;
        uint256 depositAmount = r.depositAmount;
        address renter = r.renter;
        address owner = warehouses[warehouseId].owner;
        // zero storage amounts to be safe
        r.pricePaid = 0;
        r.depositAmount = 0;
        r.renter = address(0);
        r.startTime = 0;
        r.durationDays = 0;

        // interactions: transfer funds
        // (use call to forward gas and handle more complex recipients)
        if (pricePaid > 0) {
            (bool okOwner, ) = owner.call{value: pricePaid}("");
            require(okOwner, "Payment to owner failed");
        }

        if (depositAmount > 0) {
            (bool okRenter, ) = renter.call{value: depositAmount}("");
            require(okRenter, "Refund to renter failed");
            emit RefundIssued(warehouseId, renter, depositAmount);
        }

        emit LeaseEnded(warehouseId, owner, renter, pricePaid, depositAmount, block.timestamp);
    }

    // -------------------------
    // Views / helpers
    // -------------------------

    function getWarehouse(uint256 warehouseId)
        external
        view
        returns (address owner, uint256 pricePerDay, uint256 deposit, bool exists)
    {
        Warehouse storage w = warehouses[warehouseId];
        return (w.owner, w.pricePerDay, w.deposit, w.exists);
    }

    function getRental(uint256 warehouseId)
        external
        view
        returns (
            address renter,
            uint256 pricePaid,
            uint256 depositAmount,
            uint256 startTime,
            uint256 durationDays,
            bool active
        )
    {
        Rental storage r = rentals[warehouseId];
        return (r.renter, r.pricePaid, r.depositAmount, r.startTime, r.durationDays, r.active);
    }

    /// @notice Returns seconds remaining until lease end. If not rented, returns 0.
    function timeLeft(uint256 warehouseId) external view returns (uint256) {
        Rental storage r = rentals[warehouseId];
        if (!r.active) return 0;
        uint256 endTime = r.startTime + (r.durationDays * 1 days);
        if (block.timestamp >= endTime) return 0;
        return endTime - block.timestamp;
    }

    // -------------------------
    // Emergency: admin style helper (OPTIONAL)
    // -------------------------
    // NOTE: For production you might add admin functions to recover stuck funds
    // or better integrate a multisig / dispute resolution flow. Left out for clarity.
}
