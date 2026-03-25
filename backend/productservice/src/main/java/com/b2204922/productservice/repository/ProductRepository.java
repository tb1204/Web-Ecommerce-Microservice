package com.b2204922.productservice.repository;

import com.b2204922.productservice.entity.Product;
import lombok.NonNull;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    @NonNull
    List<Product> findAll();

    //tim theo brand
    List<Product> findByBrand(String brand);

    //tim theo xuat xu
    List<Product> findByOrigin(String origin);

    //tim theo danh muc
    List<Product> findByCategoryName(String categoryName);

    //tim theo gia
    List<Product> findByPriceLessThan(Double price);

    List<Product> findByPriceGreaterThan(Double price);

    List<Product> findByPriceBetween(Double price1, Double price2);

    //tim theo do cung
    List<Product> findBySpecificationsFirmness(String firmness);
    //tim theo kich thuoc
    // List<Product> findBySpecificationsDimensions(String dimensions); // sử dụng nhưng tạm thời commentt

    //Kiem tra trung sku
    boolean existsBySku(String sku);
}
