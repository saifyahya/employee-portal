package com.esense.portal.service.impl;

import com.esense.portal.dto.UserDto;
import com.esense.portal.entity.User;
import com.esense.portal.enums.DepartmentEnum;
import com.esense.portal.exception.ResourceNotFoundException;
import com.esense.portal.mapper.UserMapper;
import com.esense.portal.repository.UserRepository;
import com.esense.portal.service.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class UserServiceImpl implements IUserService {
    private UserRepository userRepository;
    @Override
    public long getAllUsersCount() {
        return userRepository.count();
    }

    @Override
    public long getUsersCountByDepartment(String name) {
        return userRepository.countByDepartment(name);
    }

    @Override
    public List<UserDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDto> userDtos = new ArrayList<>();
        users.forEach((user)->{
            UserDto userDto= UserMapper.toUserDto(new UserDto(),user) ;
            userDtos.add(userDto);
        });
        return userDtos;
    }

    @Override
    public List<UserDto> getUsersByDepartment(String name) {
        List<User> users = userRepository.findByDepartmentOrderByName(name);
        List<UserDto> userDtos = new ArrayList<>();
        users.forEach((user)->{
            UserDto userDto= UserMapper.toUserDto(new UserDto(),user) ;
            userDtos.add(userDto);
        });
        return userDtos;
    }

    @Override
    public List<UserDto> getUsersContainingName(String name) {
        List<User> users = userRepository.findByNameContaining(name);
        List<UserDto> userDtos = new ArrayList<>();
        users.forEach((user)->{
            UserDto userDto= UserMapper.toUserDto(new UserDto(),user) ;
            userDtos.add(userDto);
        });
        return userDtos;
    }

    @Override
    public UserDto getUserByName(String name) {
        User user= userRepository.findByName(name).orElseThrow(()->new ResourceNotFoundException("User","name",name));
            UserDto userDto= UserMapper.toUserDto(new UserDto(),user) ;
        return userDto;
    }

    @Override
    public void deleteUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(()->new ResourceNotFoundException("User","Email",userEmail));
        userRepository.delete(user);
    }
}
