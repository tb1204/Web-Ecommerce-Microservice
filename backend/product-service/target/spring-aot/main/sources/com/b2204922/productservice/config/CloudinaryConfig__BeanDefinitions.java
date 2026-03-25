package com.b2204922.productservice.config;

import com.cloudinary.Cloudinary;
import org.springframework.aot.generate.Generated;
import org.springframework.beans.factory.aot.BeanInstanceSupplier;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.support.InstanceSupplier;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.context.annotation.ConfigurationClassUtils;

/**
 * Bean definitions for {@link CloudinaryConfig}.
 */
@Generated
public class CloudinaryConfig__BeanDefinitions {
  /**
   * Get the bean definition for 'cloudinaryConfig'.
   */
  public static BeanDefinition getCloudinaryConfigBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(CloudinaryConfig.class);
    beanDefinition.setTargetType(CloudinaryConfig.class);
    ConfigurationClassUtils.initializeConfigurationClass(CloudinaryConfig.class);
    InstanceSupplier<CloudinaryConfig> instanceSupplier = InstanceSupplier.using(CloudinaryConfig$$SpringCGLIB$$0::new);
    instanceSupplier = instanceSupplier.andThen(CloudinaryConfig__Autowiring::apply);
    beanDefinition.setInstanceSupplier(instanceSupplier);
    return beanDefinition;
  }

  /**
   * Get the bean instance supplier for 'cloudinary'.
   */
  private static BeanInstanceSupplier<Cloudinary> getCloudinaryInstanceSupplier() {
    return BeanInstanceSupplier.<Cloudinary>forFactoryMethod(CloudinaryConfig$$SpringCGLIB$$0.class, "cloudinary")
            .withGenerator((registeredBean) -> registeredBean.getBeanFactory().getBean("cloudinaryConfig", CloudinaryConfig.class).cloudinary());
  }

  /**
   * Get the bean definition for 'cloudinary'.
   */
  public static BeanDefinition getCloudinaryBeanDefinition() {
    RootBeanDefinition beanDefinition = new RootBeanDefinition(Cloudinary.class);
    beanDefinition.setFactoryBeanName("cloudinaryConfig");
    beanDefinition.setInstanceSupplier(getCloudinaryInstanceSupplier());
    return beanDefinition;
  }
}
