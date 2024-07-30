package com.esense.portal.service;

import com.esense.portal.dto.auth.JWTAuthenticationResponse;
import com.esense.portal.dto.auth.SigninRequest;
import com.esense.portal.dto.auth.SignupRequest;

public interface IAuthenticationService {

    void saveUser(SignupRequest signupRequest);
    JWTAuthenticationResponse signin(SigninRequest signinRequest);
}
