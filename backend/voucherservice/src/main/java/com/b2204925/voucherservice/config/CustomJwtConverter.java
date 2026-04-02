// package com.b2204925.voucherservice.config;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.core.convert.converter.Converter;
// import org.springframework.security.authentication.AbstractAuthenticationToken;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.security.oauth2.jwt.Jwt;
// import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
// import org.springframework.stereotype.Component;
// import java.util.ArrayList;
// import java.util.Collection;
// import java.util.List;
// import java.util.Map;
// @Component
// public class CustomJwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {
//     @Override
//     public AbstractAuthenticationToken convert(Jwt jwt) {
//         Collection<GrantedAuthority> authorities = new ArrayList<>();
//         // Cách 1: Đọc từ public_metadata.role (Clerk chuẩn)
//         Map<String, Object> publicMetadata = jwt.getClaim("public_metadata");
//         if (publicMetadata != null) {
//             Object role = publicMetadata.get("role");
//             if ("admin".equalsIgnoreCase(String.valueOf(role))) {
//                 authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//             }
//         }
//         // Cách 2: Fallback — đọc từ claim "role" trực tiếp (nếu bạn customize Clerk JWT template)
//         String directRole = jwt.getClaim("role");
//         if (directRole != null && directRole.equalsIgnoreCase("admin")) {
//             authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//         }
//         // Cách 3: Đọc từ "org_role" nếu dùng Clerk Organizations
//         String orgRole = jwt.getClaim("org_role");
//         if ("org:admin".equalsIgnoreCase(orgRole)) {
//             authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
//         }
//         // Mọi authenticated user đều có ROLE_USER
//         authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
//         return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
//     }
// }
package com.b2204925.voucherservice.config;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Collections;

/**
 * Đọc claim "role" từ JWT của Clerk → map sang Spring Security authority. Giống
 * hệt các service khác (user-service, chat-service).
 */
@Component
public class CustomJwtConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    @Override
    public AbstractAuthenticationToken convert(Jwt jwt) {
        String role = jwt.getClaimAsString("role");

        if (role == null) {
            role = "user"; // fallback mặc định
        }

        Collection<GrantedAuthority> authorities = Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
        );

        return new JwtAuthenticationToken(jwt, authorities);
    }
}
