package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.AdminAccount;

import java.util.Optional;

public interface AdminAccountRepository extends JpaRepository<AdminAccount, Long> {
    Optional<AdminAccount> findByEmail(String email);
}