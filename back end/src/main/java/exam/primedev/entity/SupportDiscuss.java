package exam.primedev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "support_discuss", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"discuss_id", "user_id"})
})
public class SupportDiscuss {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "discuss_id", nullable = false)
    private Discuss discuss;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "vote_type", nullable = false, length = 10)
    private String voteType; // UPVOTE hoặc DOWNVOTE

    // Getters & Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public Discuss getDiscuss() {
        return discuss;
    }
    public void setDiscuss(Discuss discuss) {
        this.discuss = discuss;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }
    public String getVoteType() {
        return voteType;
    }
    public void setVoteType(String voteType) {
        this.voteType = voteType;
    }
}
