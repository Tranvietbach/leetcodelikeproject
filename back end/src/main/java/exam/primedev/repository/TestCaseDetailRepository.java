package exam.primedev.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.TestCase;
import exam.primedev.entity.TestcaseDetail;

@Repository
public interface TestCaseDetailRepository extends JpaRepository<TestcaseDetail, Integer> {
    // Truy vấn các TestCaseDetail theo TestCase
    List<TestcaseDetail> findByTestcaseId(Integer testcaseId);
    List<TestcaseDetail> findByTestcase(TestCase testcase);

}