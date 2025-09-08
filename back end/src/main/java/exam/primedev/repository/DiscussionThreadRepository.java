package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.DiscussionThread;

public interface DiscussionThreadRepository extends JpaRepository<DiscussionThread, Integer> {
}