package com.esense.portal.controller;

import com.esense.portal.dto.ResponseDto;
import com.esense.portal.dto.auth.JWTAuthenticationResponse;
import com.esense.portal.dto.auth.SigninRequest;
import com.esense.portal.dto.auth.SignupRequest;
import com.esense.portal.service.IAuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class AuthenticationController {
    private IAuthenticationService authenticationService;

    @PostMapping("/addUser")
    public ResponseEntity<ResponseDto> Signup(@RequestBody SignupRequest request){
        authenticationService.saveUser(request);
        return new ResponseEntity<>(new ResponseDto(true,HttpStatus.OK.toString()), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity Signin(@RequestBody SigninRequest request){
        JWTAuthenticationResponse response = authenticationService.signin(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
