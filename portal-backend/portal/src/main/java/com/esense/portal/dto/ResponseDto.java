package com.esense.portal.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ResponseDto {
    private String status;
    private String message;
}
