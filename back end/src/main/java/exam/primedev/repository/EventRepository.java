package exam.primedev.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import exam.primedev.entity.Event;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

    // Ví dụ: tìm theo tiêu đề
    Optional<Event> findByTitle(String title);

    @Query(value = """
        SELECT 
            e.id as eventId,
            e.title as eventTitle,
            p.id as problemId,
            p.title as problemTitle,
            p.slug as slug,
            p.difficulty as difficulty
        FROM event_problem ep
        JOIN events e ON ep.event_id = e.id
        JOIN problems p ON ep.problem_id = p.id
        WHERE e.id = :eventId
        """, nativeQuery = true)
    List<Map<String, Object>> findEventProblemsByEventId(@Param("eventId") Integer eventId);

    // Nếu bạn dùng Projection để chỉ lấy 1 phần dữ liệu
    // Optional<EventSummary> findProjectedById(Integer id);
}