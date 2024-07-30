package com.esense.portal.service;

import com.esense.portal.dto.UserDto;
import com.esense.portal.entity.User;
import com.esense.portal.enums.DepartmentEnum;

import java.util.List;
import java.util.Optional;

public interface IUserService {

    long getAllUsersCount();
    long getUsersCountByDepartment(DepartmentEnum name);
    List<UserDto> getAllUsers();

    List<UserDto> getUsersByDepartment(DepartmentEnum name);


    List<UserDto> getUsersContainingName(String name);
   UserDto getUserByName(String name);

   void deleteUser(String userEmail);
}
