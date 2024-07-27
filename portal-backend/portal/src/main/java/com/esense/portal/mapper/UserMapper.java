package com.esense.portal.mapper;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.dto.UserDto;
import com.esense.portal.entity.Punch;
import com.esense.portal.entity.User;

import java.util.ArrayList;
import java.util.List;

public class UserMapper {

    public static UserDto toUserDto(UserDto userDto, User user){
    userDto.setName(user.getName());
    userDto.setEmail(user.getEmail());
    userDto.setDepartment(user.getDepartment());
    userDto.setPosition(user.getPosition());
    userDto.setJoiningDate(user.getJoiningDate());
    List<PunchDto> punchDtoList = new ArrayList<>();
    user.getPunches().forEach((punch)->{
        PunchDto punchDto = PunchMapper.toPunchDto(new PunchDto(),punch);
        punchDtoList.add(punchDto);
    });
    userDto.setPunches(punchDtoList);
    return userDto;
    }

    public static User toUser(UserDto userDto, User user){
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setDepartment(userDto.getDepartment());
        user.setPosition(userDto.getPosition());
        user.setJoiningDate(userDto.getJoiningDate());
        List<Punch> punchList = new ArrayList<>();
        userDto.getPunches().forEach((punchDto)->{
            Punch punch = PunchMapper.fromPunchDto(punchDto, new Punch());
            punchList.add(punch);
        });
        user.setPunches(punchList);
        return user;
    }

}
