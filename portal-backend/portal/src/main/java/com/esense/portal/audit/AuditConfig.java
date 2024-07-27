package com.esense.portal.audit;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@Configuration
public class AuditConfig {
    @Bean
    public AuditorAware<String> auditorProvider() {
        return new AuditAwareImpl();
    }
}
