package com.esense.portal.entity;

import com.esense.portal.enums.RoleConverter;
import com.esense.portal.enums.RoleEnum;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name="role")
public class Role extends BaseEntity{

    @Convert(converter = RoleConverter.class)
    private RoleEnum role;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
