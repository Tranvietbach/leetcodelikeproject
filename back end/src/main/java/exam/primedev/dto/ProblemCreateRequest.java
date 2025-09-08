package exam.primedev.dto;

import java.util.List;

public class ProblemCreateRequest {
    private Long id;
    private String title;
    private String slug;
    private String description;
    private String hint;
    private Integer difficulty;
    private Boolean isActive;
    private String availablecode;
    private String problemLanguagePy;
    private String problemLanguageJa;
    private String problemLanguageJs;
    private List<IdNameDTO> tagIds;     // chứa id + name
    private List<IdNameDTO> companyIds; // chứa id + name
    private List<IdNameDTO> premiumIds; // chứa id + name

    private List<TestcaseDTO> testcases;

    public ProblemCreateRequest() {}

    // getters & setters
    public String getProblemLanguagePy() { return problemLanguagePy; }
    public void setProblemLanguagePy(String problemLanguagePy) { this.problemLanguagePy = problemLanguagePy; }

    public String getProblemLanguageJa() { return problemLanguageJa; }
    public void setProblemLanguageJa(String problemLanguageJa) { this.problemLanguageJa = problemLanguageJa; }

    public String getProblemLanguageJs() { return problemLanguageJs; }
    public void setProblemLanguageJs(String problemLanguageJs) { this.problemLanguageJs = problemLanguageJs; }

        public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getHint() { return hint; }
    public void setHint(String hint) { this.hint = hint; }

    public Integer getDifficulty() { return difficulty; }
    public void setDifficulty(Integer difficulty) { this.difficulty = difficulty; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public String getAvailablecode() { return availablecode; }
    public void setAvailablecode(String availablecode) { this.availablecode = availablecode; }

    public List<IdNameDTO> getTagIds() { return tagIds; }
    public void setTagIds(List<IdNameDTO> tagIds) { this.tagIds = tagIds; }

    public List<IdNameDTO> getCompanyIds() { return companyIds; }
    public void setCompanyIds(List<IdNameDTO> companyIds) { this.companyIds = companyIds; }

    public List<IdNameDTO> getPremiumIds() { return premiumIds; }
    public void setPremiumIds(List<IdNameDTO> premiumIds) { this.premiumIds = premiumIds; }

    public List<TestcaseDTO> getTestcases() { return testcases; }
    public void setTestcases(List<TestcaseDTO> testcases) { this.testcases = testcases; }

    // Inner DTO cho id + name
    public static class IdNameDTO {
        private Long id;
        private String name;

        public IdNameDTO() {}
        public IdNameDTO(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    // Inner class TestcaseDTO
    public static class TestcaseDTO {
        private String expectedOutput;
        private Boolean isPublic;
        private List<TestcaseDetailDTO> details;

        public TestcaseDTO() {}

        public String getExpectedOutput() { return expectedOutput; }
        public void setExpectedOutput(String expectedOutput) { this.expectedOutput = expectedOutput; }

        public Boolean getIsPublic() { return isPublic; }
        public void setIsPublic(Boolean isPublic) { this.isPublic = isPublic; }

        public List<TestcaseDetailDTO> getDetails() { return details; }
        public void setDetails(List<TestcaseDetailDTO> details) { this.details = details; }
    }

    // Inner class TestcaseDetailDTO
    public static class TestcaseDetailDTO {
        private String variableName;
        private String variableValue;
        private Integer typeInput;

        public TestcaseDetailDTO() {}

        public String getVariableName() { return variableName; }
        public void setVariableName(String variableName) { this.variableName = variableName; }

        public String getVariableValue() { return variableValue; }
        public void setVariableValue(String variableValue) { this.variableValue = variableValue; }

        public Integer getTypeInput() { return typeInput; }
        public void setTypeInput(Integer typeInput) { this.typeInput = typeInput; }
    }
}
