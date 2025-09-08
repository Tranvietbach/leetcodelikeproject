package exam.primedev.dto;

import java.util.List;

public class ProblemResponseDTO {
    private Long problemId;
    private String title;
    private String description;
    private Integer difficulty;
    private String starterCode;
    private List<TestCaseDTO> testCases;

    public static class TestCaseDTO {
        private Integer testCaseId;
        private String expectedOutput;
        private Boolean isPublic;
        private List<TestcaseDetailDTO> details;
    }


    public static class TestcaseDetailDTO {
        private String variableName;
        private String variableValue;
    }
}

