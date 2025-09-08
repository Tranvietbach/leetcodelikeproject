package exam.primedev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trending_problems")
public class TrendingProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer problemId;

    private Float trendScore;

    private LocalDateTime updatedAt;

    public TrendingProblem() {}

    // Getters and Setters

    public Integer getProblemId() { return problemId; }

    public void setProblemId(Integer problemId) { this.problemId = problemId; }

    public Float getTrendScore() { return trendScore; }

    public void setTrendScore(Float trendScore) { this.trendScore = trendScore; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}