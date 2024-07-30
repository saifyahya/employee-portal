package com.esense.portal.service.impl;

import com.esense.portal.dto.auth.JWTAuthenticationResponse;
import com.esense.portal.dto.auth.SigninRequest;
import com.esense.portal.dto.auth.SignupRequest;
import com.esense.portal.dto.auth.UserPrincipal;
import com.esense.portal.entity.Role;
import com.esense.portal.entity.User;
import com.esense.portal.enums.RoleEnum;
import com.esense.portal.exception.ResourceNotFoundException;
import com.esense.portal.repository.UserRepository;
import com.esense.portal.service.IAuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {
    private UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;
    @Override
    public void saveUser(SignupRequest signupRequest) {
        System.out.println(signupRequest);
    User user = new User();
    user.setName(signupRequest.getName());
    user.setEmail(signupRequest.getEmail());
    user.setDepartment(signupRequest.getDepartment());
    user.setPosition(signupRequest.getPosition());
    user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
    user.setPhoneNumber(signupRequest.getPhoneNumber());
    user.setActive(true);
    user.setJoiningDate(LocalDateTime.parse(signupRequest.getJoiningDate()));
    Role role =new Role();
    role.setRole(RoleEnum.EMPLOYEE);
    user.addToRoles(role);
    userRepository.save(user);
    }

    @Override
    public JWTAuthenticationResponse signin(SigninRequest signinRequest) {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(signinRequest.getEmail(),signinRequest.getPassword()));
        User user= userRepository.findByEmail(signinRequest.getEmail()).orElseThrow(()->new ResourceNotFoundException("User","Email",signinRequest.getEmail()));
        String token = jwtService.generateToken(new UserPrincipal(user));
        JWTAuthenticationResponse authenticationResponse = new JWTAuthenticationResponse();
        authenticationResponse.setToken(token);
        List<String> userRoles = new ArrayList<>();
        user.getRoles().forEach((role)->userRoles.add(role.getRole().getValue()));
        authenticationResponse.setRole(userRoles);
        authenticationResponse.setUsername(user.getName());
        return authenticationResponse;
    }
}
