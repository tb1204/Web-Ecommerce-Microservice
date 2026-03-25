package com.b2204922.productservice.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link CategoryService}.
 */
@Generated
public class CategoryService__BeanDefinitions {
  /**
   * Get the bean definition for 'categoryService'.
   */
  public static BeanDefinition getCategoryServiceBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CategoryService.class);
    InstanceSupplier<CategoryService> instanceSupplier = InstanceSupplier.using(CategoryService::new);
    instanceSupplier = instanceSupplier.andThen(CategoryService__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }
}
