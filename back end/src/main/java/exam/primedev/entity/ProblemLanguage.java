package exam.primedev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_languages")
public class ProblemLanguage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "problem_id")
    private Long problemId;  // nên Long giống Problem.id

    @Column(name = "language_id")
    private Integer languageId;

    @Column(name = "codeStart")
    private String codeStart;
    // Getter and Setter

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public Integer getLanguageId() {
        return languageId;
    }

    public void setLanguageId(Integer languageId) {
        this.languageId = languageId;
    }

    public String getcodeStart() {
        return codeStart;
    }

    public void setcodeStart(String codeStart) {
        this.codeStart = codeStart;
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
}