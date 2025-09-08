package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.Ranking;
import exam.primedev.entity.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {

    // ✅ Lấy Top N theo điểm cao nhất (sắp xếp giảm dần theo score)
    @Query("SELECT r FROM Ranking r ORDER BY r.score DESC")
    List<Ranking> findTopByScore(Pageable pageable);

    Optional<Ranking> findByUser(User user);

        @Query("SELECT r FROM Ranking r JOIN FETCH r.user u ORDER BY r.rank ASC")
    List<Ranking> findAllWithUserOrderedByRank();

}
