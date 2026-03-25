package com.b2204922.productservice.service;

import com.b2204922.productservice.entity.Product;
import com.b2204922.productservice.repository.ProductRepository;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

    //Ham them san pham moi
    public Product addProduct(Product product, List<MultipartFile> imageFiles) {

        if (imageFiles != null) {
            System.out.println("Số lượng ảnh nhận được: " + imageFiles.size());
        } else {
            System.out.println("imageFiles đang bị NULL!");
        }

        //Kiem tra danh muc
        if (product.getCategory() == null || product.getCategory().getName() == null) {
            throw new RuntimeException("Lỗi: Vui lòng chọn danh mục cho sản phẩm");
        }

        //xoa khoang trang thua
        if (product.getName() != null) {
            product.setName(product.getName().trim());
        }
        if (product.getBrand() != null) {
            product.setBrand(product.getBrand().trim());
        }
        if (product.getOrigin() != null) {
            product.setOrigin(product.getOrigin().trim());
        }
        if (product.getCategory() != null) {
            if (product.getCategory().getName() != null) {
                product.getCategory().setName(product.getCategory().getName().trim());
            }
            if (product.getCategory().getCode() != null) {
                product.getCategory().setCode(product.getCategory().getCode().trim());
            }
        }
        if (product.getSpecifications() != null) {
            var spec = product.getSpecifications();
            if (spec.getMaterial() != null) {
                spec.setMaterial(spec.getMaterial().trim());
            }
            if (spec.getSize() != null) {
                spec.setSize(spec.getSize().trim());
            }
            if (spec.getThickness() != null) {
                spec.setThickness(spec.getThickness().trim());
            }
            if (spec.getFirmness() != null) {
                spec.setFirmness(spec.getFirmness().trim());
            }
            if (spec.getWeight() != null) {
                spec.setWeight(spec.getWeight().trim());
            }
            if (spec.getDesign() != null) {
                spec.setDesign(spec.getDesign().trim());
            }
            if (spec.getCertificationNumber() != null) {
                spec.setCertificationNumber(spec.getCertificationNumber().trim());
            }

        }
        if (product.getStockQuantity() == null || product.getStockQuantity() < 0) {
            product.setStockQuantity(0); // Khong cho phep am
        }
        if (product.getTags() != null && !product.getTags().isEmpty()) {
            List<String> cleanTags = product.getTags().stream()
                    .map(String::trim)
                    .filter(tag -> !tag.isEmpty()) // loai bo rong
                    .distinct() // loai bo trung nhau
                    .collect(Collectors.toList());
            product.setTags(cleanTags);
        }
        if (product.getDescription() != null) {
            product.setDescription(product.getDescription().trim());
        }

        //Kiem tra hoac tu dong sinh ma Sku
        if (product.getSku() != null && !product.getSku().isEmpty()) {
            String skuClean = product.getSku().trim().toUpperCase();
            if (productRepository.existsBySku(skuClean)) {
                throw new RuntimeException("Lỗi: Mã Sku '" + product.getSku() + "'đã tồn tại. Có thể bỏ trống để tự động thêm!");
            }
            product.setSku(skuClean);
        } else {
            String skuPrefix = "ART";
            if (product.getCategory() != null && product.getCategory().getName() != null) {
                skuPrefix += "-" + product.getCategory().getName().substring(0, 1).toUpperCase();
            }
            long totalCount = productRepository.count() + 1;
            product.setSku(skuPrefix + "-" + String.format("%03d", totalCount));
        }

        //Tu dong sinh product code luu vao database
        String prefix = product.getCategory().getName().substring(0, 1).toUpperCase(); //Sinh ma sp tu dong
        long count = productRepository.count();
        String newCode = prefix + String.format("%03d", count + 1);
        product.setProductCode(newCode);

        //gia tri mac dinh
        if (product.getStockQuantity() == null) {
            product.setStockQuantity(0);
        }
        if (product.getStatus() == null || product.getStatus().isEmpty()) {
            product.setStatus("AVAILABLE");
        }

        //Thiet lap thoi gian
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());

        //Xu ly hinh anh
        if (imageFiles != null && !imageFiles.isEmpty()) {
            List<Product.ProductImage> productImages = new ArrayList<>();
            try {
                for (int i = 0; i < imageFiles.size(); i++) {
                    Map uploadResult = cloudinary.uploader().upload(imageFiles.get(i).getBytes(),
                            ObjectUtils.asMap("folder", "artisano/products"));

                    String imageUrl = uploadResult.get("url").toString();

                    Product.ProductImage img = new Product.ProductImage();
                    img.setUrl(imageUrl);
                    img.setIsPrimary(i == 0); // Ép ảnh đầu tiên làm ảnh chính
                    productImages.add(img);
                }
                product.setImages(productImages);
            } catch (IOException e) {
//                log.error("Lỗi upload ảnh: {}", e.getMessage());
                log.error("Lỗi upload ảnh: " + e.getMessage());
                throw new RuntimeException("Không thể upload ảnh lên Cloudinary!");
            }
        }
        log.info("Luu san pham thanh cong: SKU={}, code={}", product.getSku(), newCode);
        return productRepository.save(product); //luu vao mongodb
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
    public Product updateProduct(String id, Product updatedProduct, List<MultipartFile> newImages) {
        Product existingProduct = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Khong tim thay san pham de cap nhat"));

        //Lay cac thong tin cap nhat
        if (updatedProduct.getName() != null) {
            existingProduct.setName(updatedProduct.getName().trim());
        }
        if (updatedProduct.getSku() != null) {
            existingProduct.setSku(updatedProduct.getSku().trim().toUpperCase());
        }
        if (updatedProduct.getBrand() != null) {
            existingProduct.setBrand(updatedProduct.getBrand().trim());
        }
        if (updatedProduct.getOrigin() != null) {
            existingProduct.setOrigin(updatedProduct.getOrigin().trim());
        }
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setOriginalPrice(updatedProduct.getOriginalPrice());
        existingProduct.setStockQuantity(updatedProduct.getStockQuantity());
        existingProduct.setStatus(updatedProduct.getStatus());
        existingProduct.setDescription(updatedProduct.getDescription() != null ? updatedProduct.getDescription().trim() : null);
        if (updatedProduct.getCategory() != null) {
            existingProduct.setCategory(updatedProduct.getCategory());
        }
        if (updatedProduct.getSpecifications() != null) {
            existingProduct.setSpecifications(updatedProduct.getSpecifications());
        }
        existingProduct.setTags(updatedProduct.getTags());
        existingProduct.setUpdatedAt(LocalDateTime.now());

        //Xu ly hinh anh moi (neu co thay doi)
        if (newImages != null && !newImages.isEmpty()) {
            //xoa anh cu tren cloudinary
            for (var img : existingProduct.getImages()) {
                try {
                    String url = img.getUrl();
                    String publicId = "artisano/products/" + url.substring(url.lastIndexOf("/") + 1, url.lastIndexOf("."));
                    cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                } catch (Exception e) {
                    log.error("Lỗi xóa ảnh cũ: {}", e.getMessage());
                }
            }

            //upload anh moi len cloudinary
            List<Product.ProductImage> productImages = new ArrayList<>();
            try {
                for (int i = 0; i < newImages.size(); i++) {
                    Map uploadResult = cloudinary.uploader().upload(newImages.get(i).getBytes(), ObjectUtils.asMap("folder", "artisano/products"));
                    Product.ProductImage img = new Product.ProductImage();
                    img.setUrl(uploadResult.get("url").toString());
                    img.setIsPrimary(i == 0);
                    productImages.add(img);
                }
                existingProduct.setImages(productImages);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi upload ảnh mới!");
            }
        }
        return productRepository.save(existingProduct);
    }

    public void updateStock(String productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm ID: " + productId));

        int currentStock = product.getStockQuantity();
        int newStock = currentStock + quantity;
        if (newStock < 0) {
            throw new RuntimeException("Số lượng trong kho không đủ để thực hiện giao dịch!");
        }

        product.setStockQuantity(newStock);
        productRepository.save(product);
    }

    public List<Product> findProductsByIds(List<String> ids) {
        return productRepository.findAllById(ids);
    }
}
