package exam.primedev.repository;

import exam.primedev.entity.Badge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BadgeRepository extends JpaRepository<Badge, Long> {
    // Bạn có thể thêm các phương thức truy vấn tùy chỉnh tại đây nếu cần
    Badge findByName(String name);

}
