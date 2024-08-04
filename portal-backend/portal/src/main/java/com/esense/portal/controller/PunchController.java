package com.esense.portal.controller;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.dto.ResponseDto;
import com.esense.portal.dto.auth.UserPrincipal;
import com.esense.portal.service.IPunchService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class PunchController {
    private IPunchService punchService;

    @GetMapping("/punches/dates")
    public ResponseEntity<List<PunchDto>> getAllUserPunchesByDatePeriod(@RequestParam String name, @RequestParam LocalDate sDate, @RequestParam LocalDate eDate) {
        List<PunchDto> punches = punchService.getUserPunchesWithinDatePeriod(name, sDate, eDate);
        return new ResponseEntity<>(punches, HttpStatus.OK);
    }

    @GetMapping("/punches/date/name")
    public ResponseEntity<PunchDto> getUserLastPunchByDateAndUserName(@RequestParam String name, @RequestParam LocalDate date) {
        PunchDto punch = punchService.getUserLastPunchByDateAndUsername(name, date);
        return new ResponseEntity<>(punch, HttpStatus.OK);
    }

    @GetMapping("/punches/date/email")
    public ResponseEntity<PunchDto> getUserLastPunchByDateAndUserEmail(@RequestParam String email, @RequestParam LocalDate date) {
        PunchDto punch = punchService.getUserLastPunchByDateAndUserEmail(email, date);
        return new ResponseEntity<>(punch, HttpStatus.OK);
    }

    @PostMapping("/punches")
    public ResponseEntity<ResponseDto> SaveUserPunch(@RequestParam String type, Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        if (principal != null) {
            PunchDto punchDto = new PunchDto(LocalDate.now(), LocalTime.now(), type);
            punchService.savePunch(punchDto, principal.getUsername());
            return new ResponseEntity<>(new ResponseDto(true, HttpStatus.OK.toString()), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResponseDto(false, HttpStatus.FORBIDDEN.toString()), HttpStatus.FORBIDDEN);
        }
    }

    @PostMapping("/punches/email")
    public ResponseEntity<ResponseDto> AddNewUserPunch(@RequestBody PunchDto punchDto, @RequestParam String email) {
        punchService.savePunch(punchDto, email);
        return new ResponseEntity<>(new ResponseDto(true, HttpStatus.OK.toString()), HttpStatus.OK);
    }

    @DeleteMapping("/punches")
    public ResponseEntity<ResponseDto> deletePunch(@RequestParam String email, @RequestParam LocalDate date, @RequestParam LocalTime time) {
        boolean isDeleted = punchService.deletePunchByUserEmail_PunchDate_PunchTime(email, date, time);
        if (isDeleted) {
            return new ResponseEntity<>(new ResponseDto(true, "Punch Deleted"), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ResponseDto(false, "Punch has not been deleted"), HttpStatus.OK);
        }
    }

}
