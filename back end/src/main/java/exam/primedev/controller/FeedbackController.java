package exam.primedev.controller;
import exam.primedev.entity.Feedback;
import exam.primedev.repository.FeedbackRepository;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @GetMapping
    public ResponseEntity<?> getAllFeedbacks(@RequestHeader("Authorization") String token) {
        validateToken(token);

        List<Map<String, Object>> feedbackList = feedbackRepository.findAll().stream()
                .map(feedback -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", feedback.getId());
                    map.put("userName", feedback.getUser() != null ? feedback.getUser().getUsername() : null);
                    map.put("message", feedback.getMessage());
                    map.put("createdAt", feedback.getCreatedAt());
                    return map;
                }).toList();

        return ResponseEntity.ok(feedbackList);
    }

    private void validateToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            JwtUtil.extractUserIdFromToken(token);
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token đã hết hạn");
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ");
        }
    }
}
