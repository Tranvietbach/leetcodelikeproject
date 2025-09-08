package exam.primedev.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "testcase_details")
public class TestcaseDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "variable_name", length = 255)
    private String variableName;

    @Column(name = "variable_value", columnDefinition = "TEXT")
    private String variableValue;

    @ManyToOne
    @JoinColumn(name = "testcase_id")
    private TestCase testcase;

        @Column(name = "type_input") // 0 = str, 1 = int, 2 = arrint, 3 = arrstring
    private Integer typeInput;
    // Getter and Setter

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getVariableName() {
        return variableName;
    }

    public void setVariableName(String variableName) {
        this.variableName = variableName;
    }

    public String getVariableValue() {
        return variableValue;
    }

    public void setVariableValue(String variableValue) {
        this.variableValue = variableValue;
    }

    public TestCase getTestcase() {
        return testcase;
    }

    public void setTestcase(TestCase testcase) {
        this.testcase = testcase;
    }

     public Integer getTypeInput() { return typeInput; }

    public void setTypeInput(Integer typeInput) { this.typeInput = typeInput; }

}