package com.b2204922.productservice.service;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link CategoryService}.
 */
@Generated
public class CategoryService__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static CategoryService apply(RegisteredBean registeredBean, CategoryService instance) {
    AutowiredFieldValueResolver.forRequiredField("categoryRepository").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
