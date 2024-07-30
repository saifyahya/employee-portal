package com.esense.portal.enums;

import org.springframework.core.convert.converter.Converter;
import org.springframework.stereotype.Component;


public class DepartmentEnumConv implements Converter<String,DepartmentEnum> {
    @Override
    public DepartmentEnum convert(String source) {
        return DepartmentEnum.getEnumValue(source.toUpperCase());
    }
}
