package com.b2204922.productservice.repository;

import com.b2204922.productservice.entity.Category;
import java.lang.Class;
import java.lang.String;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.RuntimeBeanReference;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.core.ResolvableType;
import org.springframework.data.mongodb.core.MongoOperations;
import org.springframework.data.mongodb.repository.support.MongoRepositoryFactoryBean;
import org.springframework.data.repository.core.support.RepositoryComposition;
import org.springframework.data.repository.core.support.RepositoryFactoryBeanSupport;
import org.springframework.data.repository.query.QueryLookupStrategy;

/**
 * Bean definitions for {@link CategoryRepository}.
 */
@Generated
public class CategoryRepository__BeanDefinitions {
  /**
   * Get the bean instance supplier for 'categoryRepository'.
   */
  private static BeanInstanceSupplier<MongoRepositoryFactoryBean> getCategoryRepositoryInstanceSupplier(
      ) {
    return BeanInstanceSupplier.<MongoRepositoryFactoryBean>forConstructor(Class.class)
            .withGenerator((registeredBean, args) -> new MongoRepositoryFactoryBean(args.get(0)));
  }

  /**
   * Get the bean definition for 'categoryRepository'.
   */
  public static BeanDefinition getCategoryRepositoryBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(MongoRepositoryFactoryBean.class);
    beanDefinition.setTargetType(ResolvableType.forClassWithGenerics(MongoRepositoryFactoryBean.class, CategoryRepository.class, Category.class, String.class));
    beanDefinition.setLazyInit(false);
    beanDefinition.getConstructorArgumentValues().addIndexedArgumentValue(0, "com.b2204922.productservice.repository.CategoryRepository");
    beanDefinition.getPropertyValues().addPropertyValue("queryLookupStrategyKey", QueryLookupStrategy.Key.CREATE_IF_NOT_FOUND);
    beanDefinition.getPropertyValues().addPropertyValue("lazyInit", false);
    beanDefinition.getPropertyValues().addPropertyValue("namedQueries", new RuntimeBeanReference("mongo.named-queries#0"));
    beanDefinition.getPropertyValues().addPropertyValue("repositoryFragments", new RuntimeBeanReference("mongodb.CategoryRepository.fragments#0"));
    beanDefinition.getPropertyValues().addPropertyValue("mongoOperations", new RuntimeBeanReference("mongoTemplate"));
    beanDefinition.getPropertyValues().addPropertyValue("createIndexesForQueryMethods", false);
    beanDefinition.getPropertyValues().addPropertyValue("repositoryFragmentsFunction", new RepositoryFactoryBeanSupport.RepositoryFragmentsFunction() {
      public RepositoryComposition.RepositoryFragments getRepositoryFragments(
          BeanFactory beanFactory, RepositoryFactoryBeanSupport.FragmentCreationContext context) {
        MongoOperations operations = beanFactory.getBean(MongoOperations.class);
        return RepositoryComposition.RepositoryFragments.just(new com.b2204922.productservice.repository.CategoryRepositoryImpl__AotRepository(operations, context));
      }
    });
    beanDefinition.setInstanceSupplier(getCategoryRepositoryInstanceSupplier());
    return beanDefinition;
  }
}
