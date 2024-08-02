package com.esense.portal.repository;

import com.esense.portal.entity.Punch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PunchRepository extends JpaRepository<Punch, Long> {
    List<Punch> findAllByUser_Name(String username);


    @Query("SELECT p FROM Punch p JOIN p.user u WHERE u.name = :name AND p.punchDate = :punchDate ORDER BY p.punchDate ASC, p.punchTime ASC")
    List<Punch> findAllByUser_NameAndPunchDateOrderByPunchTimeAsc(@Param("name") String name, @Param("punchDate") LocalDate punchDate);

    long countByUser_Name(String username);

    @Query("SELECT p FROM Punch p JOIN p.user u WHERE u.name =?1 AND p.punchDate BETWEEN ?2 AND ?3 ORDER BY p.punchDate ASC, p.punchTime ASC ")
    List<Punch> findAllByUser_NameAndPunchDatePeriodOrderByPunchTimeAsc(String name,LocalDate startDate, LocalDate endDate);


    Optional<Punch> findFirst1ByUserNameAndPunchDateOrderByPunchDateAscPunchTimeDesc(String username, LocalDate date);
    Optional<Punch> findFirst1ByUserEmailAndPunchDateOrderByPunchDateAscPunchTimeDesc(String userEmail, LocalDate date);


}
