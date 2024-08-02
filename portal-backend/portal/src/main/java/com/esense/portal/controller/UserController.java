package com.esense.portal.controller;

import com.esense.portal.dto.ResponseDto;
import com.esense.portal.dto.UserDto;
import com.esense.portal.enums.DepartmentEnum;
import com.esense.portal.service.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class UserController {

    private IUserService userService;

    @GetMapping("/users/count")

    public ResponseEntity<ResponseDto> getAllUsersCount(){
        long usersCount=  userService.getAllUsersCount();
        return new ResponseEntity<>(new ResponseDto(true,usersCount+""),HttpStatus.OK);
    }

    @GetMapping("/users/count/department")

    public ResponseEntity<ResponseDto> getUsersCountByDepartment(@RequestParam DepartmentEnum name){
        long usersCount=  userService.getUsersCountByDepartment(name);
        return new ResponseEntity<>(new ResponseDto(true,usersCount+""),HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        List<UserDto> userDtos=  userService.getAllUsers();
        return new ResponseEntity<>(userDtos,HttpStatus.OK);
    }

    @GetMapping("/users/name")
    public ResponseEntity<List<UserDto>> getUsersContainingName(@RequestParam String name){
        List<UserDto> userDtos=  userService.getUsersContainingName(name);
        return new ResponseEntity<>(userDtos,HttpStatus.OK);
    }


    @GetMapping("/users/department")
    public ResponseEntity<List<UserDto>> getUsersByDepartment(@RequestParam DepartmentEnum name){
        List<UserDto> userDtos=  userService.getUsersByDepartment(name);
        return new ResponseEntity<>(userDtos,HttpStatus.OK);
    }

    @DeleteMapping("/users")
    public ResponseEntity<ResponseDto> deleteUser(@RequestParam String email){
userService.deleteUser(email);
return new ResponseEntity<>(new ResponseDto(true,"User With Email: "+ email+" Deleted"),HttpStatus.OK);
    }

}
