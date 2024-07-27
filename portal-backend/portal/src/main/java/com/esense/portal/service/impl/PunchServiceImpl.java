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
import java.util.ArrayList;
import java.util.List;

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

    @Override
    public List<PunchDto> getUserPunchesByDate(String username, LocalDate date) {
        List<Punch> punchLis = punchRepository.findAllByUser_NameAndPunchDateOrderByPunchTimeAsc(username,date);
        List<PunchDto> punchDtos = new ArrayList<>();
        punchLis.forEach((punch)->{
            PunchDto punchDto = PunchMapper.toPunchDto(new PunchDto(),punch);
            punchDtos.add(punchDto);
        });
        return punchDtos;
    }

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

}
