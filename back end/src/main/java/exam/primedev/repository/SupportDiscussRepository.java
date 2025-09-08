package exam.primedev.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import exam.primedev.entity.Discuss;
import exam.primedev.entity.SupportDiscuss;
import exam.primedev.entity.User;




public interface SupportDiscussRepository extends JpaRepository<SupportDiscuss, Long> {

    // Kiểm tra xem user đã vote cho bài discuss này chưa
    Optional<SupportDiscuss> findByDiscussAndUser(Discuss discuss, User user);

    // Đếm số upvote
    int countByDiscussAndVoteType(Discuss discuss, String voteType); // "UPVOTE"

    // Đếm số downvote
    // Có thể dùng cùng phương thức countByDiscussAndVoteType với "DOWNVOTE"

    // Lấy tất cả vote của một discuss
    List<SupportDiscuss> findByDiscuss(Discuss discuss);
}