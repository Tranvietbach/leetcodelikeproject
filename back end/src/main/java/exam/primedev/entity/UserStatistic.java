package exam.primedev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_statistics")
public class UserStatistic {

    @Id
    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_submissions", nullable = false)
    private Integer totalSubmissions = 0;

    @Column(name = "total_accepted", nullable = false)
    private Integer totalAccepted = 0;

    @Column(name = "average_runtime")
    private Float averageRuntime;

    @Column(name = "solved_easy", nullable = false)
    private Integer solvedEasy = 0;

    @Column(name = "solved_medium", nullable = false)
    private Integer solvedMedium = 0;

    @Column(name = "solved_hard", nullable = false)
    private Integer solvedHard = 0;

    // Getters and Setters

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Integer getSolvedEasy() {
        return solvedEasy;
    }

    public void setSolvedEasy(Integer solvedEasy) {
        this.solvedEasy = solvedEasy;
    }

    public Integer getSolvedMedium() {
        return solvedMedium;
    }

    public void setSolvedMedium(Integer solvedMedium) {
        this.solvedMedium = solvedMedium;
    }

    public Integer getSolvedHard() {
        return solvedHard;
    }

    public void setSolvedHard(Integer solvedHard) {
        this.solvedHard = solvedHard;
    }
}
