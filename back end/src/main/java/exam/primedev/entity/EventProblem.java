package exam.primedev.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "event_problem")
public class EventProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private Integer eventId;

    private Integer problemId;

    // Getters and Setters

    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public Integer getEventId() { return eventId; }

    public void setEventId(Integer eventId) { this.eventId = eventId; }

    public Integer getProblemId() { return problemId; }

    public void setProblemId(Integer problemId) { this.problemId = problemId; }
}