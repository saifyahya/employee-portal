package com.esense.portal.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;


@Converter(autoApply = true)
public class RoleConverter implements AttributeConverter <RoleEnum,String> {
    @Override
    public String convertToDatabaseColumn(RoleEnum roleEnum) {
        if(roleEnum==null)
            return null;
        return roleEnum.getValue();
    }

    @Override
    public RoleEnum convertToEntityAttribute(String s) {
        if(s==null)
            return null;
        return RoleEnum.getEnumValue(s);
    }
}
