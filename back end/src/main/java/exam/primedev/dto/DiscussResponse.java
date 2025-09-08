package exam.primedev.dto;

public class DiscussResponse {
    private Long id;
    private String title;
    private String content;
    private String name;  // Tên người đăng
    private boolean isOwner;
    private int upvotes;    // Số upvote
    private int downvotes;  // Số downvote
    private int vote;

    public DiscussResponse(Long id, String title, String content, String name,
                           boolean isOwner, int upvotes, int downvotes, int vote) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.name = name;
        this.isOwner = isOwner;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
        this.vote = vote;
    }

    // Getters & Setters
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
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public boolean isOwner() {
        return isOwner;
    }
    public void setOwner(boolean owner) {
        isOwner = owner;
    }
    public int getUpvotes() {
        return upvotes;
    }
    public void setUpvotes(int upvotes) {
        this.upvotes = upvotes;
    }
    public int getDownvotes() {
        return downvotes;
    }
    public void setDownvotes(int downvotes) {
        this.downvotes = downvotes;
    }
    public int getVote() {
        return vote;
    }
    public void setVote(int vote) {
        this.vote = vote;
    }
}
