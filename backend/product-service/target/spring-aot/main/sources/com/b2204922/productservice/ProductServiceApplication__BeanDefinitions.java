package com.b2204922.productservice;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.RootBeanDefinition;

/**
 * Bean definitions for {@link ProductServiceApplication}.
 */
@Generated
public class ProductServiceApplication__BeanDefinitions {
  /**
   * Get the bean definition for 'productServiceApplication'.
   */
  public static BeanDefinition getProductServiceApplicationBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(ProductServiceApplication.class);
    beanDefinition.setInstanceSupplier(ProductServiceApplication::new);
    return beanDefinition;
  }
}
