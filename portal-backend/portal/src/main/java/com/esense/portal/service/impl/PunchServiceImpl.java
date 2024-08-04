package com.esense.portal.service.impl;

import com.esense.portal.dto.PunchDto;
import com.esense.portal.entity.Punch;
import com.esense.portal.entity.User;
import com.esense.portal.exception.ResourceNotFoundException;
import com.esense.portal.mapper.PunchMapper;
import com.esense.portal.repository.PunchRepository;
import com.esense.portal.repository.UserRepository;
import com.esense.portal.service.IPunchService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PunchServiceImpl implements IPunchService {
    private PunchRepository punchRepository;
    private UserRepository userRepository;
    @Override
    public List<PunchDto> getAllUserPunches(String username) {
        List<Punch> punches= punchRepository.findAllByUser_Name(username);
        List<PunchDto> punchDtos = new ArrayList<>();
        punches.forEach((punch)->{
            PunchDto punchDto = PunchMapper.toPunchDto(new PunchDto(),punch);
            punchDtos.add(punchDto);
        });
        return punchDtos;
    }

    @Override
    public PunchDto getUserLastPunchByDateAndUserEmail(String userEmail, LocalDate punchDate) {
        Optional<Punch> punch = punchRepository.findFirst1ByUserEmailAndPunchDateOrderByPunchDateAscPunchTimeDesc(userEmail,punchDate);
        PunchDto  punchDto;
        if(punch.isPresent()){
            punchDto =PunchMapper.toPunchDto(new PunchDto(),punch.get());
        }else{
            punchDto = new PunchDto();
        }
        return punchDto;
    }

    @Override
    public PunchDto getUserLastPunchByDateAndUsername(String username, LocalDate punchDate) {
        Optional<Punch> punch = punchRepository.findFirst1ByUserNameAndPunchDateOrderByPunchDateAscPunchTimeDesc(username,punchDate);
        PunchDto  punchDto;
        if(punch.isPresent()){
            punchDto =PunchMapper.toPunchDto(new PunchDto(),punch.get());
        }else{
             punchDto = new PunchDto();
        }
        return punchDto;
    }

    @Override
    public long getUserPunchesCount(String username) {
        return punchRepository.countByUser_Name(username);
    }

    @Override
    public void savePunch(PunchDto punchDto,String userEmail) {
        if(punchDto!=null){
            System.out.println(punchDto);
            User user= userRepository.findByEmail(userEmail).orElseThrow(()->new ResourceNotFoundException("User","Email",userEmail));
            Punch punch = PunchMapper.fromPunchDto(punchDto,new Punch()) ;
            punch.setUser(user);
            punchRepository.save(punch);
        }
    }

//    @Override
//    public List<PunchDto> getUserPunchesByDate(String username, LocalDate date) {
//        List<Punch> punchLis = punchRepository.findAllByUser_NameAndPunchDateOrderByPunchTimeAsc(username,date);
//        List<PunchDto> punchDtos = new ArrayList<>();
//        punchLis.forEach((punch)->{
//            PunchDto punchDto = PunchMapper.toPunchDto(new PunchDto(),punch);
//            punchDtos.add(punchDto);
//        });
//        return punchDtos;
//    }

    @Override
    public List<PunchDto> getUserPunchesWithinDatePeriod(String username, LocalDate startDate, LocalDate endDate) {
        List<Punch> punchLis = punchRepository.findAllByUser_NameAndPunchDatePeriodOrderByPunchTimeAsc(username,startDate,endDate);
        List<PunchDto> punchDtos = new ArrayList<>();
        punchLis.forEach((punch)->{
            PunchDto punchDto = PunchMapper.toPunchDto(new PunchDto(),punch);
            punchDtos.add(punchDto);
        });
        return punchDtos;
    }

    @Override
    public boolean deletePunchByUserEmail_PunchDate_PunchTime(String userEmail, LocalDate punchDate, LocalTime punchTime) {
        boolean isDeleted = false;
        Optional<User> user = userRepository.findByEmail(userEmail);
        if (user.isPresent()) {
            User retrievedUser = user.get();
            Optional<Punch> punch = punchRepository.findByUserEmailAndPunchDateAndPunchTime(retrievedUser.getEmail(), punchDate, punchTime);
            if (punch.isPresent()) {
                Punch retrievedPunch = punch.get();
                System.out.println("Punch deleted successful");
                punchRepository.deleteById(retrievedPunch.getId());
                isDeleted = true;
            }
        }
        return isDeleted;
    }

}
