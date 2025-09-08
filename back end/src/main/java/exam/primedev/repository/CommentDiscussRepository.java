package exam.primedev.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.CommentDiscuss;
import exam.primedev.entity.Discuss;

public interface CommentDiscussRepository extends JpaRepository<CommentDiscuss, Long> {
    List<CommentDiscuss> findByDiscussId(Long discussId);
    List<CommentDiscuss> findByDiscussOrderByCreatedAtAsc(Discuss discuss);

}