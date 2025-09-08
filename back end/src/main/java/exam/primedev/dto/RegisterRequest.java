package exam.primedev.dto;

public class RegisterRequest {
    public String username;
    public String email;
    public String password;
    public String fullName;
    public String country;
    public String githubUrl;
    public String bio;
    public String avatarBase64; // chứa chuỗi base64 (có thể kèm prefix hoặc không)
}