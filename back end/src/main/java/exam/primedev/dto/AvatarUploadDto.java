package exam.primedev.dto;

public class AvatarUploadDto {
    private String token;
    private String base64Image;
    private String fileName;

    // Constructors
    public AvatarUploadDto() {}

    public AvatarUploadDto(String token, String base64Image, String fileName) {
        this.token = token;
        this.base64Image = base64Image;
        this.fileName = fileName;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getBase64Image() {
        return base64Image;
    }

    public void setBase64Image(String base64Image) {
        this.base64Image = base64Image;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}