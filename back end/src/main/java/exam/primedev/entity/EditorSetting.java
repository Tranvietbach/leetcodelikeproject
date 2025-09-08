package exam.primedev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "editor_settings")
public class EditorSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    private String theme = "light";

    private String themecode = "light";

    private Integer fontSize = 14;

    private Integer tabSize = 4;

    public EditorSetting() {}

    // Getters and Setters

    public Integer getUserId() { return userId; }

    public void setUserId(Integer userId) { this.userId = userId; }

    public String getTheme() { return theme; }

    public void setTheme(String theme) { this.theme = theme; }

    public String getThemecode() { return themecode; }

    public void setThemecode(String themecode) { this.themecode = themecode; }

    public Integer getFontSize() { return fontSize; }

    public void setFontSize(Integer fontSize) { this.fontSize = fontSize; }

    public Integer getTabSize() { return tabSize; }

    public void setTabSize(Integer tabSize) { this.tabSize = tabSize; }
}