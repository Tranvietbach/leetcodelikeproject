package exam.primedev.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "problem_premiums")
public class ProblemPremium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "premium_id", nullable = false)
    private Premium premium;

    public ProblemPremium() {
    }

    public ProblemPremium(Long id, Problem problem, Premium premium) {
        this.id = id;
        this.problem = problem;
        this.premium = premium;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public Premium getPremium() {
        return premium;
    }

    public void setPremium(Premium premium) {
        this.premium = premium;
    }
}
