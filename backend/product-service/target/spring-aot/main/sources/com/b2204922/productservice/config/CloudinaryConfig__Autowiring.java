package com.b2204922.productservice.config;

import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.AutowiredFieldValueResolver;
import org.springframework.beans.factory.support.RegisteredBean;

/**
 * Autowiring for {@link CloudinaryConfig}.
 */
@Generated
public class CloudinaryConfig__Autowiring {
  /**
   * Apply the autowiring.
   */
  public static CloudinaryConfig apply(RegisteredBean registeredBean, CloudinaryConfig instance) {
    AutowiredFieldValueResolver.forRequiredField("cloudName").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("apiKey").resolveAndSet(registeredBean, instance);
    AutowiredFieldValueResolver.forRequiredField("apiSecret").resolveAndSet(registeredBean, instance);
    return instance;
  }
}
