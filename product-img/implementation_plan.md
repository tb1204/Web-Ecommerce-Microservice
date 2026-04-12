# Fixing User Profile And Membership Sync

The root cause of the membership features not working is that the system currently does not calculate the member discount in the frontend checkout logic, and the `order-service` doesn't communicate with the `user-service` to update the membership `totalSpent` amount when orders are completed.

## User Review Required
> [!IMPORTANT]
> The member discount is applied to the **subtotal** (before shipping fees and other logic).
> The `totalSpent` (and therefore membership tier upgrades) will only be updated when an order's status reaches **"DELIVERED"**. This prevents users from placing huge dummy orders just to upgrade their VIP tier before canceling them. Is this logic acceptable?

## Proposed Changes

---

### Frontend

#### [MODIFY] [CheckOutPage.tsx](file:///d:/luanvanhk2dvb/frontend/src/pages/CheckOutPage.tsx)
- Fetch the `membership` status from the user profile data.
- Determine the discount rate (Silver: 3%, Gold: 7%, Diamond: 12%).
- Calculate `memberDiscountAmount` and deduct it from the `totalPayment`.
- Display a new row in the checkout summary: "Hội viên giảm giá" to show the deducted amount visually.

---

### Backend: user-service

#### [MODIFY] [UserController.java](file:///d:/luanvanhk2dvb/backend/userservice/src/main/java/com/b2204925/userservice/controller/UserController.java)
- Add a new endpoint `PUT /api/users/{clerkId}/add-spending` to accept a direct spending increase.

#### [MODIFY] [UserService.java](file:///d:/luanvanhk2dvb/backend/userservice/src/main/java/com/b2204925/userservice/service/UserService.java)
- Add a method `addSpending(String clerkId, double amount)` that finds the user, calls the existing `user.addOrder(amount)` method, and saves the entity.

---

### Backend: order-service

#### [MODIFY] [OrderServiceImpl.java](file:///d:/luanvanhk2dvb/backend/order-service/src/main/java/com/b2204922/orderservice/service/OrderServiceImpl.java)
- Inside `updateOrderStatus(String id, String status)`, add logic that detects if the new status is `"DELIVERED"`.
- If `"DELIVERED"`, use `RestTemplate` to call the `user-service`'s new `add-spending` endpoint, passing the `clerkId` and the `totalAmount` of the order. This ensures the user's membership ranks up upon completing large orders.

## Verification Plan
### Automated Tests
- No automated tests required for these specific integrations, but we can verify using `cURL` or Postman.

### Manual Verification
- Log in to the Frontend, add a 20+ million order to cart.
- Verify checkout dynamically shows a large member discount.
- Place the order and manually trigger the "DELIVERED" status.
- Verify the user's `totalSpent` and `membership` field correctly upgrades to GOLD or DIAMOND in the database / user profile page.
