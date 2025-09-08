package exam.primedev.repository;
import exam.primedev.entity.EmailVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public interface EmailVerificationRepository extends JpaRepository<EmailVerification, Long> {
    Optional<EmailVerification> findByKey(String key);
    Optional<EmailVerification> findByIdUser(Long idUser);
}