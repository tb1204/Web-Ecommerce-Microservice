# 📦 Product Service — Tài liệu chi tiết

**Port:** 8082 | **Database:** MongoDB — `productdb` | **Eureka:** ✅

---

## Nhiệm vụ

Quản lý toàn bộ dữ liệu sản phẩm: danh mục, biến thể (size/màu/độ dày), hình ảnh, tồn kho, giảm giá.

---

## Luồng hoạt động

### Luồng 1: Lấy danh sách sản phẩm

```
GET /api/products/all
         ↓
Truy vấn MongoDB productdb collection "products"
Hỗ trợ filter: category, price range, search term
         ↓
Trả về List<ProductResponse> với thông tin cơ bản
(không include variants chi tiết để tối ưu bandwidth)
```

### Luồng 2: Xem chi tiết sản phẩm

```
GET /api/products/detail/{id}
         ↓
Tìm product theo MongoDB _id
         ↓
Trả về ProductDetailResponse:
{
  id, name, description, images[],
  category: { code, name, parentCode },
  variants: [
    { variantId, size, thickness, color, price, stockQuantity }
  ],
  discountPercent, flashSaleEnd
}
```

### Luồng 3: Cập nhật tồn kho sau đặt hàng

```
order-service gọi:
PATCH /api/products/variants/{variantId}/stock
Body: { delta: -2 }   ← trừ 2 đơn vị
         ↓
product-service cập nhật stockQuantity
Nếu stockQuantity < 0 → throw InsufficientStockException
```

---

## API Endpoints

| Method | Path                                       | Mô tả                       |
| ------ | ------------------------------------------ | --------------------------- |
| GET    | `/api/products/all`                        | Tất cả sản phẩm (có filter) |
| GET    | `/api/products/detail/{id}`                | Chi tiết 1 sản phẩm         |
| GET    | `/api/products/discount`                   | Sản phẩm đang flash sale    |
| GET    | `/api/products/parent-category/{code}`     | SP theo danh mục cha        |
| POST   | `/api/products/add`                        | Thêm SP (admin)             |
| PUT    | `/api/products/update/{id}`                | Sửa SP (admin)              |
| DELETE | `/api/products/delete/{id}`                | Xóa SP (admin)              |
| PATCH  | `/api/products/variants/{variantId}/stock` | Cập nhật tồn kho            |
| GET    | `/api/categories/all`                      | Tất cả danh mục             |

---

## Cấu trúc MongoDB Document

```json
{
  "_id": "ObjectId(...)",
  "name": "Chăn lông vũ cao cấp",
  "description": "...",
  "sku": "CHAN-LV-001",
  "images": [{ "url": "https://...", "isPrimary": true }],
  "category": {
    "code": "chan-long-vu",
    "name": "Chăn lông vũ",
    "parentCode": "chan"
  },
  "variants": [
    {
      "variantId": "var_001",
      "size": "160x200",
      "thickness": "4cm",
      "color": "Trắng",
      "price": 1500000,
      "stockQuantity": 50
    }
  ],
  "discountPercent": 15,
  "flashSaleEnd": "2024-12-31T23:59:59Z"
}
```

---

---
