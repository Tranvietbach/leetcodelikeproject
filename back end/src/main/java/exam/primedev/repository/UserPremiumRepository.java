package exam.primedev.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.UserPremium;

public interface UserPremiumRepository extends JpaRepository<UserPremium, Long> {
    boolean existsByUserIdAndPremiumId(Long userId, Long premiumId);
        List<UserPremium> findByUserIdAndExpirationDateAfter(Long userId, LocalDateTime now);

}