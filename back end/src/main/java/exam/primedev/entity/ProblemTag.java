package exam.primedev.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "problem_tags")
public class ProblemTag {

    @Id
    @ManyToOne
    @JoinColumn(name = "problem_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Problem problem;

    @Id
    @ManyToOne
    @JoinColumn(name = "tag_id")
    private tag tag;

    // Getters & Setters
    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public tag getTag() {
        return tag;
    }

    public void setTag(tag tag) {
        this.tag = tag;
    }
}
