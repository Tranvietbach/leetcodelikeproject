package exam.primedev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_statistics")
public class ProblemStatistic {

    @Id
    @Column(name = "problem_id")
    private Integer problemId;

    @Column(name = "total_submissions", nullable = false)
    private Integer totalSubmissions = 0;

    @Column(name = "total_accepted", nullable = false)
    private Integer totalAccepted = 0;

    @Column(name = "average_runtime")
    private Float averageRuntime;

    // Getter and Setter

    public Integer getProblemId() {
        return problemId;
    }

    public void setProblemId(Integer problemId) {
        this.problemId = problemId;
    }

    public Integer getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(Integer totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }

    public Integer getTotalAccepted() {
        return totalAccepted;
    }

    public void setTotalAccepted(Integer totalAccepted) {
        this.totalAccepted = totalAccepted;
    }

    public Float getAverageRuntime() {
        return averageRuntime;
    }

    public void setAverageRuntime(Float averageRuntime) {
        this.averageRuntime = averageRuntime;
    }
}
