package exam.primedev.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import exam.primedev.entity.Premium;

@Repository
public interface PremiumRepository extends JpaRepository<Premium, Long> {
    // Bạn có thể thêm các method tùy chỉnh tại đây nếu cần
    List<Premium> findByNameContainingIgnoreCase(String name);
}