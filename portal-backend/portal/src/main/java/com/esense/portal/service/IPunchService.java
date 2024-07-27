package com.esense.portal.service;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.entity.Punch;

import java.time.LocalDate;
import  java.util.List;

public interface IPunchService {

   List<PunchDto> getAllUserPunches(String username);

   long getUserPunchesCount(String username);

   void savePunch(PunchDto punchDto,String userEmail);

   List<PunchDto> getUserPunchesByDate(String username, LocalDate date);

   List<PunchDto> getUserPunchesWithinDatePeriod(String username, LocalDate startDate,LocalDate endDate);
}
