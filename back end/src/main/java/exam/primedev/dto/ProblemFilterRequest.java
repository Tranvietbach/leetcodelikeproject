package exam.primedev.dto;

import java.util.List;

public class ProblemFilterRequest {
    private String title;
    private Integer startId;
    private Integer endId;
    private Integer difficulty;
    private List<Integer> tags;
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    // Getter và Setter cho startId
    public Integer getStartId() {
        return startId;
    }
    public void setStartId(Integer startId) {
        this.startId = startId;
    }

    // Getter và Setter cho endId
    public Integer getEndId() {
        return endId;
    }
    public void setEndId(Integer endId) {
        this.endId = endId;
    }

    // Getter và Setter cho difficulty
    public Integer getDifficulty() {
        return difficulty;
    }
    public void setDifficulty(Integer difficulty) {
        this.difficulty = difficulty;
    }

    // Getter và Setter cho tags
    public List<Integer> getTags() {
        return tags;
    }
    public void setTags(List<Integer> tags) {
        this.tags = tags;
    }
    // Getters và Setters
}
