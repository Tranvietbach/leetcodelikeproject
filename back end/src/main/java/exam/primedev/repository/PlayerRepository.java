package exam.primedev.repository;

import exam.primedev.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayerRepository extends JpaRepository<Player, Integer> {
    // Tìm kiếm người chơi theo tên
    List<Player> findByNameContaining(String name);
}
