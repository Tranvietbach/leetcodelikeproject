package exam.primedev.entity;
import jakarta.persistence.*;
import java.time.LocalDateTime;

// Ranking.java
@Entity
@Table(name = "rankings")
public class Ranking {

    @Id
    private Long id; // Phải đồng bộ với User.id

    @OneToOne
    @MapsId // sử dụng id của User làm id của Ranking
    @JoinColumn(name = "user_id")
    private User user;

    private Integer rank;

    private Float score;

    private LocalDateTime updatedAt;

    public Ranking() {}

    // Getters and Setters

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Integer getRank() { return rank; }

    public void setRank(Integer rank) { this.rank = rank; }

    public Float getScore() { return score; }

    public void setScore(Float score) { this.score = score; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
