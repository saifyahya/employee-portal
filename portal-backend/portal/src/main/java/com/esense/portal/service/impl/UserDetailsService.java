package com.esense.portal.service.impl;

import com.esense.portal.dto.auth.UserPrincipal;
import com.esense.portal.entity.Role;
import com.esense.portal.entity.User;
import com.esense.portal.exception.ResourceNotFoundException;
import com.esense.portal.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserDetailsService implements org.springframework.security.core.userdetails.UserDetailsService {
    private UserRepository userRepository;

    @Transactional
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> retrievedUser =  userRepository.findByEmail(email);
        User user = retrievedUser.orElseThrow(()-> new ResourceNotFoundException("User Service", "email",email));
        List<GrantedAuthority> authorityList = new ArrayList<>();
        user.getRoles().forEach((Role role)->{authorityList.add(new SimpleGrantedAuthority(role.getRole().getValue()));
        });
        System.out.println("Load User by Username, email: "+user.getEmail()+ "pass:"+user.getPassword());
        return new UserPrincipal(user);
    }
}
