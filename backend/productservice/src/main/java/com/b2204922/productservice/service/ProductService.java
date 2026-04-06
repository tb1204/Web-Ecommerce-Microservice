package com.b2204922.productservice.service;

import com.b2204922.productservice.entity.Product;
import com.b2204922.productservice.repository.ProductRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.InputStreamSource;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service //danh dau la service de spring quan ly
@RequiredArgsConstructor //tu dong them repository vao qua constructor
@Slf4j //de dung log.info() in thong bao ra man hinh
public class ProductService {

    private final ProductRepository productRepository;
    private final Cloudinary cloudinary;

    public List<Product> getAllProducts() {
        // Sắp xếp theo thời gian mới nhất lên đầu để Admin dễ quản lý
        return productRepository.findAll();
    }

    public Product getProductById(String id) {
        log.info("🔍 Đang tìm sản phẩm có ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm với ID: " + id));
    }

    public Product findById(String id) {
        return productRepository.findById(id).orElse(null);
    }

    //Ham them san pham moi
    public Product addProduct(Product product, List<MultipartFile> imageFiles) {
        // 1. Kiểm tra logic cơ bản
        if (product.getCategory() == null || product.getCategory().getName() == null) {
            throw new RuntimeException("Lỗi: Vui lòng chọn danh mục cho sản phẩm");
        }

        // 2. Chuẩn hóa dữ liệu (Trim các chuỗi dư thừa)
        trimProductData(product);

        // 3. Tự động sinh Product Code (VD: N001, G002)
        String categoryForPrefix = (product.getCategory().getParentName() != null && !product.getCategory().getParentName().isEmpty())
                ? product.getCategory().getParentName()
                : product.getCategory().getName();

        String prefix = categoryForPrefix.substring(0, 1).toUpperCase();
        long count = productRepository.count();
        String newCode = prefix + String.format("%03d", count + 1);
        product.setProductCode(newCode);

        // 4. XỬ LÝ BIẾN THỂ (VARIANTS)

        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            int totalStock = 0;
            Double minPrice = Double.MAX_VALUE;
            // Double minOriginalPrice = Double.MAX_VALUE; Nếu muốn lưu giá gốc đại diện bên ngoài (tùy chọn)
            for (Product.ProductVariant variant : product.getVariants()) {
                // Tự sinh variantId nếu trống
                if (variant.getVariantId() == null || variant.getVariantId().isEmpty()) {
                    variant.setVariantId(UUID.randomUUID().toString());
                }
                // Tự sinh SKU
                if (variant.getSku() == null || variant.getSku().isEmpty()) {
                    String sizeClean = variant.getSize().replaceAll("\\s+", "").toUpperCase();
                    variant.setSku(newCode + "-" + sizeClean);
                }
                // Cộng dồn tồn kho
                totalStock += (variant.getStockQuantity() != null) ? variant.getStockQuantity() : 0;
                // Tìm giá bán thấp nhất (Giá đã giảm)
                if (variant.getPrice() != null && variant.getPrice() < minPrice) {
                    minPrice = variant.getPrice();
                }
                // Mặc định trạng thái biến thể
                if (variant.getStatus() == null) variant.setStatus("ACTIVE");
            }

            product.setTotalStockQuantity(totalStock);
            product.setPrice(minPrice);
        } else {
            product.setTotalStockQuantity(0);
            // Đảm bảo không bị null price ở lớp ngoài
            if (product.getPrice() == null) product.setPrice(0.0);
        }

        // 5. Thiết lập trạng thái và thời gian
        if (product.getStatus() == null || product.getStatus().isEmpty()) {
            product.setStatus("AVAILABLE");
        }
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        // 6. Xử lý upload hình ảnh lên Cloudinary
        handleImageUploads(product, imageFiles);

        log.info("Lưu sản phẩm thành công: Code={}, Tổng kho={}, Biến thể={}",
                newCode, product.getTotalStockQuantity(), product.getVariants().size());

        return productRepository.save(product);
    }

    /**
     * Hàm phụ trợ để chuẩn hóa dữ liệu đầu vào
     */
    private void trimProductData(Product product) {
        if (product.getName() != null) product.setName(product.getName().trim());
        if (product.getBrand() != null) product.setBrand(product.getBrand().trim());
        if (product.getOrigin() != null) product.setOrigin(product.getOrigin().trim()); // Thêm origin

        if (product.getCategory() != null) {
            if (product.getCategory().getName() != null)
                product.getCategory().setName(product.getCategory().getName().trim());
            if (product.getCategory().getCode() != null)
                product.getCategory().setCode(product.getCategory().getCode().trim());
            if (product.getCategory().getParentCode() != null)
                product.getCategory().setParentCode(product.getCategory().getParentCode().trim());
            if (product.getCategory().getParentName() != null)
                product.getCategory().setParentName(product.getCategory().getParentName().trim());
        }
        if (product.getVariants() != null) {
            for (Product.ProductVariant variant : product.getVariants()) {
                if (variant.getSize() != null) variant.setSize(variant.getSize().trim());
                if (variant.getThickness() != null) variant.setThickness(variant.getThickness().trim());
                if (variant.getColor() != null) variant.setColor(variant.getColor().trim()); // <-- TRIM MÀU SẮC
            }
        }
        if (product.getVariants() != null) {
            for (Product.ProductVariant variant : product.getVariants()) {
                if (variant.getSize() != null) {
                    variant.setSize(variant.getSize().trim());
                }
                if (variant.getThickness() != null) {
                    variant.setThickness(variant.getThickness().trim());
                }
                if (variant.getColor() != null) {
                    variant.setColor(variant.getColor().trim()); // <-- TRIM MÀU SẮC

                            }}
        }

        if (product.getSpecifications() != null) {
            var spec = product.getSpecifications();
            if (spec.getMaterial() != null) spec.setMaterial(spec.getMaterial().trim());
            if (spec.getFirmness() != null) spec.setFirmness(spec.getFirmness().trim());
            if (spec.getDesign() != null) spec.setDesign(spec.getDesign().trim());
            if (spec.getWeight() != null) spec.setWeight(spec.getWeight().trim());
            if (spec.getCertificationNumber() != null) spec.setCertificationNumber(spec.getCertificationNumber().trim());
        }
    }

    /**
     * Hàm phụ trợ xử lý upload ảnh
     */
    private void handleImageUploads(Product product, List<MultipartFile> imageFiles) {
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<Product.ProductImage> productImages = new ArrayList<>();
            try {
                for (int i = 0; i < imageFiles.size(); i++) {
                    Map uploadResult = cloudinary.uploader().upload(imageFiles.get(i).getBytes(),
                            ObjectUtils.asMap("folder", "artisano/products"));

                    Product.ProductImage img = new Product.ProductImage();
                    img.setUrl(uploadResult.get("url").toString());
                    img.setIsPrimary(i == 0);
                    productImages.add(img);
                }
                product.setImages(productImages);
            } catch (IOException e) {
                log.error("Lỗi upload ảnh Cloudinary: {}", e.getMessage());
                throw new RuntimeException("Lỗi dịch vụ hình ảnh, vui lòng thử lại!");
            }
        }
    }


    //Ham xoa san pham
    public void deleteProduct(String id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Khong tim thay san pham de xoa"));
        //Xoa anh tren clound
        if (product.getImages() != null) {
            for (var img : product.getImages()) {
                try {
                    String url = img.getUrl();
                    String publicId = "artisano/products/" + url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));

                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    log.info("Đã xóa ảnh trên Cloudinary: {}", publicId);
                } catch (Exception e) {
                    log.error("Lỗi khi xóa ảnh trên Cloudinary: {}", e.getMessage());
                }
            }
        }
        //xoa anh tren database
        productRepository.deleteById(id);
        log.info("Đã xóa sản phẩm ID={} khỏi Database", id);
    }

    //Ham update san pham
<<<<<<< HEAD
=======

>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
    public Product updateProduct(String id, Product updatedProduct, List<MultipartFile> newImages) {
        // 1. Tìm sản phẩm cũ trong DB
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm để cập nhật"));

        // 2. Cập nhật thông tin cơ bản
<<<<<<< HEAD
        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName().trim());
        }
        if (updatedProduct.getBrand() != null) {
            existingProduct.setBrand(updatedProduct.getBrand().trim());
        }
        if (updatedProduct.getOrigin() != null) {
            existingProduct.setOrigin(updatedProduct.getOrigin().trim());
        }
=======
        if (updatedProduct.getName() != null) existingProduct.setName(updatedProduct.getName().trim());
        if (updatedProduct.getBrand() != null) existingProduct.setBrand(updatedProduct.getBrand().trim());
        if (updatedProduct.getOrigin() != null) existingProduct.setOrigin(updatedProduct.getOrigin().trim());
>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
        existingProduct.setDescription(updatedProduct.getDescription());
        existingProduct.setStatus(updatedProduct.getStatus());
        existingProduct.setCategory(updatedProduct.getCategory());
        existingProduct.setSpecifications(updatedProduct.getSpecifications());
        existingProduct.setTags(updatedProduct.getTags());

        // 3. Cập nhật biến thể (Variants) và tính toán lại Giá/Kho
        if (updatedProduct.getVariants() != null && !updatedProduct.getVariants().isEmpty()) {
            int totalStock = 0;
            Double minPrice = Double.MAX_VALUE;

            for (Product.ProductVariant v : updatedProduct.getVariants()) {
                if (v.getVariantId() == null || v.getVariantId().isEmpty()) {
                    v.setVariantId(UUID.randomUUID().toString());
                }
                totalStock += (v.getStockQuantity() != null) ? v.getStockQuantity() : 0;
                if (v.getPrice() != null && v.getPrice() < minPrice) {
                    minPrice = v.getPrice();
                }
            }
            existingProduct.setVariants(updatedProduct.getVariants());
            existingProduct.setTotalStockQuantity(totalStock);
            existingProduct.setPrice(minPrice);
        }

        // 4. XỬ LÝ HÌNH ẢNH
        List<Product.ProductImage> oldImagesFromDb = existingProduct.getImages();
        List<Product.ProductImage> keptImagesFromFrontend = updatedProduct.getImages();
        List<Product.ProductImage> finalImages = new ArrayList<>();

        if (oldImagesFromDb != null && keptImagesFromFrontend != null) {
            Set<String> keptUrls = keptImagesFromFrontend.stream()
                    .map(Product.ProductImage::getUrl)
                    .collect(Collectors.toSet());

            for (Product.ProductImage oldImg : oldImagesFromDb) {
                if (!keptUrls.contains(oldImg.getUrl())) {
                    deleteImageFromCloudinary(oldImg.getUrl());
                }
            }
        }

<<<<<<< HEAD
=======

>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
        boolean isUpdatingPrimary = false;
        if (keptImagesFromFrontend != null && !keptImagesFromFrontend.isEmpty()) {
            String firstUrl = keptImagesFromFrontend.get(0).getUrl();
            if (firstUrl != null && firstUrl.startsWith("blob:")) {
                isUpdatingPrimary = true;
                keptImagesFromFrontend.remove(0);
            }
        }

        if (newImages != null && !newImages.isEmpty()) {
            try {
                for (int i = 0; i < newImages.size(); i++) {
                    Map uploadResult = cloudinary.uploader().upload(newImages.get(i).getBytes(),
                            ObjectUtils.asMap("folder", "artisano/products"));

                    Product.ProductImage newImg = new Product.ProductImage();
                    newImg.setUrl(uploadResult.get("url").toString());

<<<<<<< HEAD
=======

>>>>>>> 74a4862881035814147d4c42b376ca3aaeb01812
                    if (isUpdatingPrimary && i == 0) {
                        newImg.setIsPrimary(true);
                        finalImages.add(0, newImg);
                    } else {
                        newImg.setIsPrimary(false);
                        finalImages.add(newImg);
                    }
                }
            } catch (IOException e) {
                log.error("Lỗi upload: {}", e.getMessage());
                throw new RuntimeException("Lỗi upload ảnh mới lên Cloudinary!");
            }
        }

        if (keptImagesFromFrontend != null) {
            for (Product.ProductImage img : keptImagesFromFrontend) {
                if (finalImages.stream().anyMatch(Product.ProductImage::getIsPrimary)) {
                    img.setIsPrimary(false);
                }
                finalImages.add(img);
            }
        }

        if (!finalImages.isEmpty()) {
            boolean hasPrimary = finalImages.stream().anyMatch(Product.ProductImage::getIsPrimary);
            if (!hasPrimary) {
                finalImages.get(0).setIsPrimary(true);
            }
        }
        if (finalImages != null && !finalImages.isEmpty()) {
            finalImages.sort((img1, img2) -> Boolean.compare(img2.getIsPrimary(), img1.getIsPrimary()));
        }

        existingProduct.setImages(finalImages);
        existingProduct.setUpdatedAt(LocalDateTime.now());

        log.info("Cập nhật thành công sản phẩm: {}, Tổng kho: {}",
                existingProduct.getName(), existingProduct.getTotalStockQuantity());

        return productRepository.save(existingProduct);
    }

    /**
     * Hàm phụ trợ để xóa file vật lý trên Cloudinary từ URL
     */
    private void deleteImageFromCloudinary(String url) {
        try {
            // Trích xuất publicId từ URL Cloudinary
            // Ví dụ: .../artisano/products/abcde.jpg -> publicId là "artisano/products/abcde"
            String publicId = "artisano/products/" + url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info(" Đã xóa vĩnh viễn trên Cloudinary: {}", publicId);
        } catch (Exception e) {
            log.error("Lỗi khi xóa ảnh trên Cloudinary: {}", e.getMessage());
        }
    }
    /**
     * Hàm phụ trợ xử lý xóa ảnh cũ và upload ảnh mới lên Cloudinary
     */

    /**
     * Hàm phụ trợ xử lý xóa ảnh cũ và upload ảnh mới lên Cloudinary
     */
    public void updateVariantStock(String productId, String variantId, int quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + productId));

        boolean variantFound = false;
        if (product.getVariants() != null) {
            for (Product.ProductVariant v : product.getVariants()) {
                if (v.getVariantId().equals(variantId)) {
                    int newStock = (v.getStockQuantity() != null ? v.getStockQuantity() : 0) + quantityChange;
                    if (newStock < 0) throw new RuntimeException("Sản phẩm biến thể này đã hết hàng!");
                    v.setStockQuantity(newStock);
                    variantFound = true;
                    break;
                }
            }
        }

        if (!variantFound) throw new RuntimeException("Không tìm thấy biến thể tương ứng trong sản phẩm!");

        // Sau khi trừ kho biến thể, tính lại tổng kho cho toàn bộ Product để đồng bộ Dashboard
        int total = product.getVariants().stream()
                .mapToInt(v -> v.getStockQuantity() != null ? v.getStockQuantity() : 0)
                .sum();
        product.setTotalStockQuantity(total);

        productRepository.save(product);
    }

    public List<Product> findProductsByIds(List<String> ids) {
        return productRepository.findAllById(ids);
    }

    public List<Map<String, Object>> getHighStockProducts() {
        // Sửa 'stockQuantity' thành 'totalStockQuantity' để khớp Entity mới
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "totalStockQuantity"))
                .stream()
                .limit(5)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", p.getName());
                    m.put("sub", p.getCategory() != null ? p.getCategory().getName() : "");
                    m.put("value", (p.getTotalStockQuantity() != null ? p.getTotalStockQuantity() : 0) + " sản phẩm");
                    return m;
                }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getLowStockProducts() {
        // Sửa 'stockQuantity' thành 'totalStockQuantity'
        return productRepository.findAll(Sort.by(Sort.Direction.ASC, "totalStockQuantity"))
                .stream()
                .limit(5)
                .map(p -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", p.getName());
                    m.put("sub", "Cần nhập gấp");
                    m.put("value", "Còn " + (p.getTotalStockQuantity() != null ? p.getTotalStockQuantity() : 0));
                    m.put("isAlert", true);
                    return m;
                }).collect(Collectors.toList());
    }
    // Lấy sản phẩm theo mã danh mục con
    public List<Product> getProductsBySubCategory(String subCode) {
        return productRepository.findByCategory_Code(subCode);
    }

    // Lấy toàn bộ sản phẩm thuộc danh mục cha
    public List<Product> getProductsByParentCategory(String parentCode) {
        return productRepository.findByCategory_ParentCode(parentCode);
    }

    /**
     * Lấy tất cả sản phẩm đang có giảm giá (dùng cho Flash Sale)
     */
    public List<Product> getDiscountProducts() {
        return productRepository.findAll().stream()
                .filter(this::hasAnyDiscount)
                .collect(Collectors.toList());
    }

    /**
     * Kiểm tra sản phẩm có ít nhất 1 biến thể đang giảm giá hay không
     */
    private boolean hasAnyDiscount(Product p) {
        // Hầu hết sản phẩm đều có Variants → kiểm tra trong Variants
        if (p.getVariants() != null && !p.getVariants().isEmpty()) {
            return p.getVariants().stream().anyMatch(variant
                    -> variant.getOriginalPrice() != null
                    && variant.getPrice() != null
                    && variant.getOriginalPrice() > variant.getPrice()
            );
        }

        // Trường hợp không có variant (rất hiếm)
        // Chúng ta bỏ qua hoặc trả về false vì Product không có originalPrice trực tiếp
        return false;
    }
}
