package exam.primedev.dto;

public class DiscussionThreadRequest {

    private String title;
    private String content;
    private Long userId;  // ID người tạo

    public DiscussionThreadRequest() {
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}