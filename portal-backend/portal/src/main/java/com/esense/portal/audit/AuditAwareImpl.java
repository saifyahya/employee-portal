package com.esense.portal.audit;

import com.esense.portal.entity.User;
import jakarta.persistence.EntityListeners;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Optional;
public class AuditAwareImpl implements AuditorAware<String> {
    @Override
    public Optional<String> getCurrentAuditor() {
        return Optional.of("SYSTEM");
    }
}
