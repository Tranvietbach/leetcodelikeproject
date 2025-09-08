package exam.primedev.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.User;
import exam.primedev.entity.UserProfile;
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
}