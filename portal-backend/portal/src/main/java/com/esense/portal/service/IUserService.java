package com.esense.portal.service;

import com.esense.portal.dto.UserDto;
import com.esense.portal.enums.DepartmentEnum;

import java.util.List;

public interface IUserService {

    long getAllUsersCount();
    long getUsersCountByDepartment(DepartmentEnum name);
    List<UserDto> getAllUsers();

    List<UserDto> getUsersByDepartment(DepartmentEnum name);


    List<UserDto> getUsersContainingName(String name);
   UserDto getUserByName(String name);

   boolean updateUser(String userOriginalEmail, UserDto userDto);

   void deleteUser(String userEmail);

    List<String> getAllUsersName();
    List<String> getAllUsersEmail();

}
