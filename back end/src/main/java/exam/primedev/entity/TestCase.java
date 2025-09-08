package exam.primedev.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "testcases")
public class TestCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "expected_output", columnDefinition = "TEXT")
    private String expectedOutput;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @OneToMany(mappedBy = "testcase", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TestcaseDetail> details = new ArrayList<>();



    // Getter and Setter
    @Column(name = "Explanation", columnDefinition = "TEXT")
    private String Explanation = "";

    public List<TestcaseDetail> getDetails() {
        return details;
    }
    public void setDetails(List<TestcaseDetail> details) {
        this.details = details;
    }


    public String getExplanation() {
        return Explanation;
    }

    public void setExplanation(String explanation) {
        this.Explanation = explanation;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getExpectedOutput() {
        return expectedOutput;
    }

    public void setExpectedOutput(String expectedOutput) {
        this.expectedOutput = expectedOutput;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }
}
