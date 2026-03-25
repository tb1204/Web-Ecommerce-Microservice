package com.b2204922.productservice.repository;

import org.springframework.aot.generate.Generated;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.repository.aot.MongoAotRepositoryFragmentSupport;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;

/**
 * AOT generated MongoDB repository implementation for {@link CategoryRepository}.
 */
@Generated
public class CategoryRepositoryImpl__AotRepository extends MongoAotRepositoryFragmentSupport {
  private final MongoOperations operations;

  public CategoryRepositoryImpl__AotRepository(MongoOperations operations,
      RepositoryFactoryBeanSupport.FragmentCreationContext context) {
    super(operations, context);
    this.operations = operations;
  }
}
