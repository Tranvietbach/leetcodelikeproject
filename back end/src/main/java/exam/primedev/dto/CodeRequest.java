package exam.primedev.dto;

import java.util.List;

public class CodeRequest {

    private Long problemId;
    private String token; // Slug của bài toán
    private String code;
    private List<TestCaseRequest> testCases; // Danh sách test cases kèm theo chi tiết
    public int programmingLanguageId; // ID của ngôn ngữ lập trình



    // Getter và Setter
    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public List<TestCaseRequest> getTestCases() {
        return testCases;
    }

    public void setTestCases(List<TestCaseRequest> testCases) {
        this.testCases = testCases;
    }
    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }

    // Lớp phụ để chứa thông tin của từng test case
    public static class TestCaseRequest {
        private String expectedOutput;
        private Boolean isPublic;
        private List<TestCaseDetailRequest> details; // Danh sách chi tiết của test case

        // Getter và Setter
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

        public List<TestCaseDetailRequest> getDetails() {
            return details;
        }

        public void setDetails(List<TestCaseDetailRequest> details) {
            this.details = details;
        }
    }

    // Lớp phụ để chứa chi tiết của test case
    public static class TestCaseDetailRequest {
        private String variableName;
        private String variableValue;

        // Getter và Setter
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
    }
}
