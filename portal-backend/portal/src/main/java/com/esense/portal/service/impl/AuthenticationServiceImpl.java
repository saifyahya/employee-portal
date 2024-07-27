package com.esense.portal.service.impl;

import com.esense.portal.dto.SigninRequest;
import com.esense.portal.dto.SignupRequest;
import com.esense.portal.entity.Role;
import com.esense.portal.entity.User;
import com.esense.portal.enums.RoleEnum;
import com.esense.portal.exception.ResourceNotFoundException;
import com.esense.portal.repository.UserRepository;
import com.esense.portal.service.IAuthenticationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@AllArgsConstructor
public class AuthenticationServiceImpl implements IAuthenticationService {
    private UserRepository userRepository;
    @Override
    public void saveUser(SignupRequest signupRequest) {
        System.out.println(signupRequest);
    User user = new User();
    user.setName(signupRequest.getName());
    user.setEmail(signupRequest.getEmail());
    user.setDepartment(signupRequest.getDepartment());
    user.setPosition(signupRequest.getPosition());
    user.setPassword(signupRequest.getPassword());
    user.setActive(true);
    user.setJoiningDate(LocalDateTime.now());
        Role role =new Role();
        role.setRole(RoleEnum.EMPLOYEE);
        user.addToRoles(role);
        userRepository.save(user);
    }

    @Override
    public String signin(SigninRequest signinRequest) {
        User user= userRepository.findByEmail(signinRequest.getEmail()).orElseThrow(()->new ResourceNotFoundException("User","Email",signinRequest.getEmail()));
        return user.getEmail()+"Signed in Successfully";
    }
}
