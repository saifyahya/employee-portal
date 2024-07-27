package com.esense.portal.dto;

import com.esense.portal.enums.DepartmentEnum;
import lombok.*;

import java.time.LocalDateTime;
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SignupRequest {
    private String name;
    private DepartmentEnum department;

    private String email;

    private String position;

    private String password;


}
