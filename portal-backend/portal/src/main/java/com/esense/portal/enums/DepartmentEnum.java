package com.esense.portal.enums;

import jakarta.persistence.Converter;

public enum DepartmentEnum {
    SOFTWARE_DEVELOPMENT("Software Development"),
    QA("QA"),
    MOBILE_DEVELOPMENT("Mobile Development"),
    BA("BA"),
    HR("HR"),
    IT("IT"),
    PRODUCT_DEVELOPMENT("Product Development"),
    Marketing("Marketing")
    ;
    private String departmentName;

    DepartmentEnum(String departmentName) {
        this.departmentName = departmentName;
    }

    public  String getValue(){
        return this.departmentName;
    }

    public static DepartmentEnum getEnumValue(String departmentName) {
        for (DepartmentEnum departmentEnum : DepartmentEnum.values()) {
            if (departmentEnum.getValue().equals(departmentName)) {
                return departmentEnum;
            }
        }
        return null;
    }
}
