package com.esense.portal.controller;

import com.esense.portal.dto.ResponseDto;
import com.esense.portal.dto.SigninRequest;
import com.esense.portal.dto.SignupRequest;
import com.esense.portal.service.IAuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class AuthenticationController {
    private IAuthenticationService authenticationService;

    @PostMapping("/users")
    public ResponseEntity<ResponseDto> Signup(@RequestBody SignupRequest request){
        authenticationService.saveUser(request);
        return new ResponseEntity<>(new ResponseDto("user Saved Successfully",HttpStatus.OK.toString()), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<ResponseDto> Signin(@RequestBody SigninRequest request){
        String message = authenticationService.signin(request);
        return new ResponseEntity<>(new ResponseDto(message,HttpStatus.OK.toString()), HttpStatus.OK);
    }
}
