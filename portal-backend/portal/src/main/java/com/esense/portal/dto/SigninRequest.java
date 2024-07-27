package com.esense.portal.dto;

import com.esense.portal.enums.DepartmentEnum;
import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class SigninRequest {

    private String email;

    private String password;
}
