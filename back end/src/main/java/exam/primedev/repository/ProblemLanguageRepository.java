package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.ProblemLanguage;

import java.util.List;

@Repository
public interface ProblemLanguageRepository extends JpaRepository<ProblemLanguage, Long> {
    // Tìm các bản ghi ProblemLanguage theo problemId
    List<ProblemLanguage> findByProblemId(Long problemId);

    // Tìm các bản ghi ProblemLanguage theo languageId
    List<ProblemLanguage> findByLanguageId(Integer languageId);
    void deleteByProblemId(Long problemId);
}
