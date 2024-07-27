package com.esense.portal.mapper;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.entity.Punch;

public class PunchMapper {

    public static PunchDto toPunchDto(PunchDto punchDto, Punch punch){
        punchDto.setPunchDate(punch.getPunchDate());
        punchDto.setPunchTime(punch.getPunchTime());
        punchDto.setType(punch.getType());
        return punchDto;
    }


    public static Punch fromPunchDto(PunchDto punchDto, Punch punch){
        punch.setPunchDate(punchDto.getPunchDate());
        punch.setPunchTime(punchDto.getPunchTime());
        punch.setType(punchDto.getType());
        return punch;
    }
}
