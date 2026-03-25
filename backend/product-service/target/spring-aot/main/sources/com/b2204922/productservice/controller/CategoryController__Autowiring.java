package com.b2204922.productservice.controller;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link CategoryController}.
 */
@Generated
public class CategoryController__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static CategoryController apply(RegisteredBean registeredBean,
      CategoryController instance) {
    AutowiredFieldValueResolver.forRequiredField("categoryService").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
