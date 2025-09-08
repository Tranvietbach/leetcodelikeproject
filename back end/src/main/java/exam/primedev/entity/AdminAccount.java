package exam.primedev.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_accounts")
public class AdminAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private String password; // lưu hash mật khẩu

    @Column(name = "theme_setting", nullable = false, length = 10)
    private String settingDarkOrLight = "LIGHT"; // "LIGHT" hoặc "DARK"

    @Column(nullable = false)
    private String role = "ADMIN";


    public AdminAccount() {}

    public AdminAccount(String email, String name, String password, String settingDarkOrLight) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.settingDarkOrLight = settingDarkOrLight;
    }


    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getSettingDarkOrLight() { return settingDarkOrLight; }
    public void setSettingDarkOrLight(String settingDarkOrLight) { this.settingDarkOrLight = settingDarkOrLight; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

}
