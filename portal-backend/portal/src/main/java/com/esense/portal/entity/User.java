package com.esense.portal.entity;

import com.esense.portal.enums.DepartmentConverter;
import com.esense.portal.enums.DepartmentEnum;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="user")
@Entity
public class User extends BaseEntity{
    private String name;
    @Convert(converter = DepartmentConverter.class)
    private DepartmentEnum department;

    private String email;

    private LocalDate joiningDate;

    private String password;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<Punch> punches;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Role> roles;

    private String position;
    private String phoneNumber;


    private boolean isActive;


    public void addToPunches(Punch punch){
        if(this.punches==null){
            this.punches= new ArrayList<>();
        }
        this.punches.add(punch);
        punch.setUser(this);
    }

    public void addToRoles(Role role){
        if(this.roles==null){
            this.roles= new ArrayList<>();
        }
        this.roles.add(role);
        role.setUser(this);
    }
}
