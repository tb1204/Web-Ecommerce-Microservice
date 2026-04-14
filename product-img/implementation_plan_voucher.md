# Implementation Plan - Voucher Validation Fix

Fixing the bug where numeric fields (discount value, usage limit, min spend, etc.) accept negative values during voucher creation and update.

## User Review Required

> [!IMPORTANT]
> The validation will follow these rules:
> - **Discount Value**: Minimum 1 (to ensure vouchers actually provide a benefit).
> - **Max Discount Amount**: Minimum 0.
> - **Min Order Amount**: Minimum 0.
> - **Total Usage Limit**: Minimum 1.
> - **Per User Limit**: Minimum 1.
> - **Date Check**: End date must be after start date.

## Proposed Changes

### Backend (Voucher Service)

#### [MODIFY] [UpdateVoucherRequest.java](file:///d:/luanvanhk2dvb/backend/voucherservice/src/main/java/com/b2204925/voucherservice/dto/req/UpdateVoucherRequest.java)
- Add `@Min` and `@NotNull` annotations to all numeric fields.
- Add validations to inner `UsageLimitDto` and `ValidityDto`.

#### [MODIFY] [AdminVoucherController.java](file:///d:/luanvanhk2dvb/backend/voucherservice/src/main/java/com/b2204925/voucherservice/controller/AdminVoucherController.java)
- Add `@Valid` annotation to the `update` method to trigger DTO validation.

### Frontend (Admin UI)

#### [MODIFY] [AdminVoucherAddModal.tsx](file:///d:/luanvanhk2dvb/frontend/src/components/Admin/AdminVoucherAddModal.tsx)
- Add `min={0}` or `min={1}` to all numeric `<input type="number">`.
- Enhance `handleSubmit` to perform a final check on numeric values and date ranges.
- Use `toast.error` for validation feedback.

#### [MODIFY] [AdminVoucherEditModal.tsx](file:///d:/luanvanhk2dvb/frontend/src/components/Admin/AdminVoucherEditModal.tsx)
- Same improvements as the Add Modal.
- Ensure `handleDiscountValueChange` and other handlers prevent invalid state.

## Verification Plan

### Automated Tests
- None planned (manual testing via UI).

### Manual Verification
1. **Create Voucher**: Try to enter negative values in "Add Voucher" modal. Verify inputs don't allow it/show error.
2. **Edit Voucher**: Try to update an existing voucher with negative values. Verify the request is either blocked by the UI or rejected by the Backend with a 400 Bad Request.
3. **Date Validation**: Test setting an end date earlier than the start date.
