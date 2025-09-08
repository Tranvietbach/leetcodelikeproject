package exam.primedev.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.Problem;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // Truy vấn theo title
    Optional<Problem> findByTitle(String title);

    // Truy vấn theo slug
    Optional<Problem> findBySlug(String slug);

    // Tìm danh sách các bài toán theo độ khó
    List<Problem> findByDifficulty(Integer difficulty);

    // Truy vấn tất cả các bài toán đang hoạt động
    List<Problem> findByIsActive(Boolean isActive);

    @Query("SELECT COUNT(p) FROM Problem p WHERE p.isActive = true")
    int countAllActive(); // hoặc dùng count() nếu không có điều kiện

@Query(value = "SELECT COUNT(p.id) " +
               "FROM problems p " +
               "JOIN company_problem cp ON p.id = cp.problem_id " +
               "WHERE cp.company_id = :companyId AND p.is_active = true",
       nativeQuery = true)
int countTotalProblemsByCompany(@Param("companyId") Long companyId);
}