package com.esense.portal.service;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.entity.Punch;

import java.time.LocalDate;
import java.time.LocalTime;
import  java.util.List;
import java.util.Optional;

public interface IPunchService {

   List<PunchDto> getAllUserPunches(String username);

   PunchDto getUserLastPunchByDateAndUserEmail(String userEmail, LocalDate punchDate);
   PunchDto getUserLastPunchByDateAndUsername(String username,LocalDate punchDate);

   long getUserPunchesCount(String username);

   void savePunch(PunchDto punchDto,String userEmail);

//   List<PunchDto> getUserPunchesByDate(String username, LocalDate date);

   List<PunchDto> getUserPunchesWithinDatePeriod(String username, LocalDate startDate,LocalDate endDate);

   boolean deletePunchByUserEmail_PunchDate_PunchTime(String userEmail, LocalDate punchDate, LocalTime punchTime);
}
