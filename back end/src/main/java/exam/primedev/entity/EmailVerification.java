package exam.primedev.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "email_verification")
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_user", nullable = false)
    private Long idUser;

    @Column(name = "verification_key", nullable = false, length = 100)
    private String key;

    @Column(nullable = false)
    private boolean status = false;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "failed_attempts", nullable = false)
    private int failedAttempts = 0;

    public EmailVerification() {
    }

    public EmailVerification(Long idUser, String key, boolean status, LocalDateTime createdAt, int failedAttempts) {
        this.idUser = idUser;
        this.key = key;
        this.status = status;
        this.createdAt = createdAt;
        this.failedAttempts = failedAttempts;
    }

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public Long getIdUser() {
        return idUser;
    }

    public void setIdUser(Long idUser) {
        this.idUser = idUser;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isStatus() {
        return status;
    }

    public void setStatus(boolean status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(int failedAttempts) {
        this.failedAttempts = failedAttempts;
    }

    @Override
    public String toString() {
        return "EmailVerification{" +
                "id=" + id +
                ", idUser=" + idUser +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", failedAttempts=" + failedAttempts +
                '}';
    }
}
