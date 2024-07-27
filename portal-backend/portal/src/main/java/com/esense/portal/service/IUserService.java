package com.esense.portal.service;

import com.esense.portal.dto.UserDto;
import com.esense.portal.entity.User;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    long getAllUsersCount();
    List<UserDto> getAllUsers();

    List<UserDto> getUsersContainingName(String name);
   UserDto getUserByName(String name);
}
