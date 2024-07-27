package com.esense.portal.controller;

import com.esense.portal.dto.ResponseDto;
import com.esense.portal.dto.SignupRequest;
import com.esense.portal.dto.UserDto;
import com.esense.portal.service.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
        return new ResponseEntity<>(new ResponseDto(HttpStatus.OK.toString(),usersCount+""),HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers(){
        List<UserDto> userDtos=  userService.getAllUsers();
        return new ResponseEntity<>(userDtos,HttpStatus.OK);
    }


}
