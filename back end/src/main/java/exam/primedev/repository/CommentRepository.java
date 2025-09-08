package exam.primedev.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import exam.primedev.entity.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Tìm comment theo userId
    List<Comment> findByUserId(Long userId);
    List<Comment> findByProblemId(Integer problemId);
void deleteById(Integer id);

    // Nếu sau này có thêm field "problem", bạn có thể thêm lại method này
    // List<Comment> findByProblemId(Long problemId);
}
