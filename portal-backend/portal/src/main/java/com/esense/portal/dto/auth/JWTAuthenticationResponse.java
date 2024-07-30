package com.esense.portal.dto.auth;

import lombok.Data;

import java.util.List;

@Data
public class JWTAuthenticationResponse {
    private String token;
    private List<String> role;

    private String username;
}
