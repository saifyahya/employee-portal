package com.esense.portal.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class DepartmentConverter implements AttributeConverter<DepartmentEnum,String> {
    @Override
    public String convertToDatabaseColumn(DepartmentEnum departmentEnum) {
        if(departmentEnum==null)
        return null;
        return departmentEnum.getValue();
    }

    @Override
    public DepartmentEnum convertToEntityAttribute(String s) {
        if(s==null)
        return null;
        return DepartmentEnum.getEnumValue(s);
    }
}
