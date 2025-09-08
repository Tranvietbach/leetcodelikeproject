package exam.primedev.dto;

public class FeedbackCreateRequest {
    private String token;    // token JWT ở đây
    private String message;

    public FeedbackCreateRequest() {}

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}