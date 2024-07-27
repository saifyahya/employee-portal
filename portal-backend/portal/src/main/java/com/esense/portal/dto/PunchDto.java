package com.esense.portal.dto;

import jakarta.persistence.Column;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PunchDto {

    private LocalDate punchDate;
    private LocalTime punchTime;
    private String type;
//    private boolean isFirst;
//    private boolean isLast;
}
