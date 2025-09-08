package exam.primedev.dto;

import java.util.List;

import java.util.List;

public class ProblemDetailResponse {
    private Long id;
    private String title;
    private String description;
    private Integer difficulty;
    private String availablecode;
    private String slug; // Added slug field
    private String hint; // Added slug field

    private List<ProblemLanguageDTO> languages;
    private List<TestCaseDTO> testcases;
    private List<TagDTO> tags;
    private List<CompanyDTO> companies;
    private List<PremiumDTO> premiums;

    public List<CompanyDTO> getCompanies() {
        return companies;
    }

    public void setCompanies(List<CompanyDTO> companies) {
        this.companies = companies;
    }

    public List<TagDTO> getTags() {
        return tags;
    }

    public void setTags(List<TagDTO> tags) {
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    public String getAvailablecode() {
        return availablecode;
    }

    public void setAvailablecode(String availablecode) {
        this.availablecode = availablecode;
    }

    public List<ProblemLanguageDTO> getLanguages() {
        return languages;
    }

    public void setLanguages(List<ProblemLanguageDTO> languages) {
        this.languages = languages;
    }

    public List<TestCaseDTO> getTestcases() {
        return testcases;
    }

    public void setTestcases(List<TestCaseDTO> testcases) {
        this.testcases = testcases;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public List<PremiumDTO> getPremiums() {
        return premiums;
    }

    public void setPremiums(List<PremiumDTO> premiums) {
        this.premiums = premiums;
    }

}
