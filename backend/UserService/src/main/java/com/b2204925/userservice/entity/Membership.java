package com.b2204925.userservice.entity;

public enum Membership {

    MEMBER("Member", 0, 0, 0.0),
    SILVER("Silver", 3, 3_000_000, 0.03),
    GOLD("Gold", 20, 5_000_000, 0.07),
    DIAMOND("Diamond", 75, 15_000_000, 0.12);

    private final String tierName;
    private final int minPurchaseCount;
    private final double minTotalSpent;
    private final double discountRate;

    Membership(String tierName, int minPurchaseCount, double minTotalSpent, double discountRate) {
        this.tierName = tierName;
        this.minPurchaseCount = minPurchaseCount;
        this.minTotalSpent = minTotalSpent;
        this.discountRate = discountRate;
    }

    public String getTierName() {
        return tierName;
    }

    public int getMinPurchaseCount() {
        return minPurchaseCount;
    }

    public double getMinTotalSpent() {
        return minTotalSpent;
    }

    public double getDiscountRate() {
        return discountRate;
    }

    // tính hạng thành viên
    public static Membership getTier(int purchaseCount, double totalSpent) {

        if (purchaseCount >= DIAMOND.minPurchaseCount || totalSpent >= DIAMOND.minTotalSpent) {
            return DIAMOND;
        }

        if (purchaseCount >= GOLD.minPurchaseCount || totalSpent >= GOLD.minTotalSpent) {
            return GOLD;
        }

        if (purchaseCount >= SILVER.minPurchaseCount || totalSpent >= SILVER.minTotalSpent) {
            return SILVER;
        }

        return MEMBER;
    }
    // lấy % giảm giá trực tiếp

    public static double getDiscountRate(int purchaseCount, double totalSpent) {
        return getTier(purchaseCount, totalSpent).getDiscountRate();
    }

}
