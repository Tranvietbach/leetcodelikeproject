package exam.primedev.repository;

import exam.primedev.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Integer> {

    // Lấy tất cả submission của 1 user (tùy chọn)
    List<Submission> findByUserId(Long userId);
@Query("SELECT COUNT(DISTINCT s.problem.id) " +
       "FROM Submission s " +
       "WHERE s.user.id = :userId " +
       "AND s.statusDetail = 'ACCEPTED' " +
       "AND s.problem.id IN (" +
       "  SELECT p.id FROM Company c JOIN c.problems p " +
       "  WHERE c.id = :companyId AND p.isActive = true" +
       ")")
int countSolvedProblemsByUserAndCompany(@Param("userId") Long userId,
                                        @Param("companyId") Long companyId);
    // Có thể thêm các truy vấn tùy chỉnh nếu cần
}
