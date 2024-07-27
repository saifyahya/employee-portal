package com.esense.portal.service;

import com.esense.portal.dto.SigninRequest;
import com.esense.portal.dto.SignupRequest;

public interface IAuthenticationService {

    void saveUser(SignupRequest signupRequest);
    String signin(SigninRequest signinRequest);
}
