package exam.primedev.entity;

import java.time.LocalDate;

import jakarta.persistence.*;

@Entity
@Table(name = "player")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Integer weight;

    @Column(nullable = false)
    private Float height;

    @Column(nullable = false)
    private String position;

    @Column(nullable = false)
    private LocalDate dateOfBirth;  // Ngày sinh (phải là quá khứ)

    @Column(nullable = false)
    private String bloodType;  // Nhóm máu


    @ManyToOne
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;
    @Column(nullable = false)
    private Boolean active = true;  // Thêm cột active với giá trị mặc định là true
    public Player() {}

    public Player(String name, Integer age, Integer weight, Float height, String position, Club club) {
        this.name = name;
        this.age = age;
        this.weight = weight;
        this.height = height;
        this.position = position;
        this.club = club;
    }

    // Getters and Setters
    public Integer getId() {
        return id;
    }
    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Float getHeight() {
        return height;
    }

    public void setHeight(Float height) {
        this.height = height;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getBloodType() {
        return bloodType;
    }

    public void setBloodType(String bloodType) {
        this.bloodType = bloodType;
    }
}