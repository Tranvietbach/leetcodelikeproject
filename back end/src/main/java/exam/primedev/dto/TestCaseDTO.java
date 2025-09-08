package exam.primedev.dto;

import java.util.List;


public class TestCaseDTO {
    private Integer id;
    private String expectedOutput;
    private String explanation;
    private Boolean isPublic;
    private List<TestcaseDetailDTO> inputs;

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

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public List<TestcaseDetailDTO> getInputs() {
        return inputs;
    }

    public void setInputs(List<TestcaseDetailDTO> inputs) {
        this.inputs = inputs;
    }
}
