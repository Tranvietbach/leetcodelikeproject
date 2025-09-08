package exam.primedev.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.ProblemPremium;

public interface ProblemPremiumRepository extends JpaRepository<ProblemPremium, Long> {
    List<ProblemPremium> findByProblemId(Long problemId);
    
}
