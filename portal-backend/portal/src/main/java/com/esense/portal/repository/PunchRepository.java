package com.esense.portal.repository;

import com.esense.portal.entity.Punch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PunchRepository extends JpaRepository<Punch, Long> {
    List<Punch> findAllByUser_Name(String username);


    @Query("SELECT p FROM Punch p JOIN p.user u WHERE u.name = :name AND p.punchDate = :punchDate ORDER BY p.punchDate ASC, p.punchTime ASC")
    List<Punch> findAllByUser_NameAndPunchDateOrderByPunchTimeAsc(@Param("name") String name, @Param("punchDate") LocalDate punchDate);

    long countByUser_Name(String username);

    @Query("SELECT p FROM Punch p JOIN p.user u WHERE u.name =?1 AND p.punchDate >= ?2 AND p.punchDate <= ?3 ORDER BY p.punchDate ASC, p.punchTime ASC ")
    List<Punch> findAllByUser_NameAndPunchDatePeriodOrderByPunchTimeAsc(String name,LocalDate startDate, LocalDate endDate);

}
