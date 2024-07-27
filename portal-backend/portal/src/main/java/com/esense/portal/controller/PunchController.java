package com.esense.portal.controller;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.dto.ResponseDto;
import com.esense.portal.service.IPunchService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@AllArgsConstructor
@CrossOrigin({"http://127.0.0.1:4200", "http://localhost:4200"})
public class PunchController {
    private IPunchService punchService;

    @GetMapping("/punches")
    public ResponseEntity<List<PunchDto>> getAllUserPunches(@RequestParam String name) {
        List<PunchDto> punches = punchService.getAllUserPunches(name);
        return new ResponseEntity<>(punches, HttpStatus.OK);
    }

    @GetMapping("/punches/date")
    public ResponseEntity<List<PunchDto>> getAllUserPunchesByDate(@RequestParam String name, @RequestParam LocalDate date) {
        List<PunchDto> punches = punchService.getUserPunchesByDate(name, date);
        return new ResponseEntity<>(punches, HttpStatus.OK);
    }

    @GetMapping("/punches/dates")
    public ResponseEntity<List<PunchDto>> getAllUserPunchesByDatePeriod(@RequestParam String name, @RequestParam LocalDate sDate,@RequestParam LocalDate eDate) {
        List<PunchDto> punches = punchService.getUserPunchesWithinDatePeriod(name, sDate,eDate);
        return new ResponseEntity<>(punches, HttpStatus.OK);
    }

    @PostMapping("/punches")
    public ResponseEntity<ResponseDto> SavePunch(@RequestBody PunchDto punchDto, @RequestParam String email) {
        punchService.savePunch(punchDto, email);
        return new ResponseEntity<>(new ResponseDto("Punch Saved Successfully", HttpStatus.OK.toString()), HttpStatus.OK);
    }

}
