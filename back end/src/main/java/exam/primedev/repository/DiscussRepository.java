package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.Discuss;

public interface DiscussRepository extends JpaRepository<Discuss, Long> {
}