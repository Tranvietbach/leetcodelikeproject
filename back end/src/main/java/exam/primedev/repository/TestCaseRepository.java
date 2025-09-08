package exam.primedev.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.TestCase;

@Repository
public interface TestCaseRepository extends JpaRepository<TestCase, Integer> {

    // Lấy tất cả testcase của một bài toán cụ thể
    List<TestCase> findByProblemId(Long problemId);

    // Lấy tất cả test case công khai
    List<TestCase> findByIsPublicTrue();

    // Lấy testcase theo ID và là công khai
    List<TestCase> findByProblemIdAndIsPublicTrue(Long problemId);

    // Có thể thêm các truy vấn tùy chỉnh nếu cần
}
