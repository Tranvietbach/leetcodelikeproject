package exam.primedev.dto;

public class TestcaseDetailDTO {
    private String variableName;
    private String variableValue;
    private String typeInput; // 0 = str, 1 = int, 2 = arrint, 3 = arrstring

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
    public String getTypeInput() {
        return typeInput;
    }
    public void setTypeInput(String typeInput) {
        this.typeInput = typeInput;
    }
}

