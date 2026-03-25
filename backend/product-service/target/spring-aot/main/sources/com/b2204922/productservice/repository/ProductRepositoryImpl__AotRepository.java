package com.b2204922.productservice.repository;

import com.b2204922.productservice.entity.Product;
import java.lang.Double;
import java.lang.String;
import java.util.List;
import org.springframework.aot.generate.Generated;
import org.springframework.data.mongodb.core.ExecutableFindOperation;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.repository.aot.MongoAotRepositoryFragmentSupport;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated MongoDB repository implementation for {@link ProductRepository}.
 */
@Generated
public class ProductRepositoryImpl__AotRepository extends MongoAotRepositoryFragmentSupport {
  private final MongoOperations operations;

  public ProductRepositoryImpl__AotRepository(MongoOperations operations,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(operations, context);
    this.operations = operations;
  }

  /**
   * AOT generated implementation of {@link ProductRepository#existsBySku(java.lang.String)}.
   */
  public boolean existsBySku(String sku) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"sku\": ?0}", sku);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).exists();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findByBrand(java.lang.String)}.
   */
  public List<Product> findByBrand(String brand) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"brand\": ?0}", brand);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findByCategoryName(java.lang.String)}.
   */
  public List<Product> findByCategoryName(String categoryName) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"category.name\": ?0}", categoryName);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findByOrigin(java.lang.String)}.
   */
  public List<Product> findByOrigin(String origin) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"origin\": ?0}", origin);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findByPriceBetween(java.lang.Double,java.lang.Double)}.
   */
  public List<Product> findByPriceBetween(Double price1, Double price2) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"price\": {\"$gt\": ?0, \"$lt\": ?1}}", price1, price2);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findByPriceGreaterThan(java.lang.Double)}.
   */
  public List<Product> findByPriceGreaterThan(Double price) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"price\": {\"$gt\": ?0}}", price);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findByPriceLessThan(java.lang.Double)}.
   */
  public List<Product> findByPriceLessThan(Double price) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"price\": {\"$lt\": ?0}}", price);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findBySpecificationsDimensions(java.lang.String)}.
   */
  public List<Product> findBySpecificationsDimensions(String dimensions) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"specifications.dimensions\": ?0}", dimensions);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }

  /**
   * AOT generated implementation of {@link ProductRepository#findBySpecificationsFirmness(java.lang.String)}.
   */
  public List<Product> findBySpecificationsFirmness(String firmness) {
    class ExpressionMarker{};

    BasicQuery filterQuery = createQuery(ExpressionMarker.class.getEnclosingMethod(), "{\"specifications.firmness\": ?0}", firmness);

    ExecutableFindOperation.FindWithQuery<Product> finder = operations.query(Product.class);
    return finder.matching(filterQuery).all();
  }
}
