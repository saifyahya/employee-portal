package com.esense.portal.enums;

public enum RoleEnum {
    EMPLOYEE("employee"),
    MANAGER("manager");
    private String roleType;

    RoleEnum(String roleType) {
        this.roleType = roleType;
    }

    public  String getValue(){
        return this.roleType;
    }

    public static RoleEnum getEnumValue(String roleType) {
        for (RoleEnum roleEnum : RoleEnum.values()) {
            if (roleEnum.getValue().equals(roleType)) {
                return roleEnum;
            }
        }
        return null;
    }

}
