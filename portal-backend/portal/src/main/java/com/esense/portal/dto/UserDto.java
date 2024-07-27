package com.esense.portal.dto;

import com.esense.portal.entity.Punch;
import com.esense.portal.entity.Role;
import com.esense.portal.enums.DepartmentConverter;
import com.esense.portal.enums.DepartmentEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Convert;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class UserDto {

    private String name;
    private DepartmentEnum department;

    private String email;

    private LocalDateTime joiningDate;

    private String position;

    private List<PunchDto> punches;
}
