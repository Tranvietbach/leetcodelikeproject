package exam.primedev.controller;

//all imports
import exam.primedev.dto.CommentRequest;
import exam.primedev.entity.Comment;
import exam.primedev.entity.Problem;
import exam.primedev.entity.User;
import exam.primedev.repository.CommentRepository;
import exam.primedev.repository.ProblemRepository;
import exam.primedev.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import jakarta.persistence.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProblemRepository problemRepository;

    // ✅ Get all comments (optionally by problemId)
@GetMapping("/{problemId}")
public List<Map<String, Object>> getCommentsByProblemId(@PathVariable Integer problemId) {
    List<Comment> comments = commentRepository.findByProblemId(problemId);

    return comments.stream().map(comment -> {
        Map<String, Object> map = new HashMap<>();
        map.put("id", comment.getId());
        map.put("content", comment.getContent());
        map.put("createdAt", comment.getCreatedAt());
        map.put("user", Map.of(
            "id", comment.getUser().getId(),
            "username", comment.getUser().getUsername()
        ));
        return map;
    }).collect(Collectors.toList());
}


    // ✅ Add new comment
    @PostMapping
    public ResponseEntity<?> createComment(@RequestBody CommentRequest request) {
        Long userId = JwtUtil.extractUserIdFromToken(request.getToken());
        Optional<User> userOpt = userRepository.findById(userId);
        Optional<Problem> problemOpt = problemRepository.findById(request.getProblemId());

        if (userOpt.isEmpty() || problemOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid user or problem");
        }

        Comment comment = new Comment();
        comment.setUser(userOpt.get());
        comment.setProblem(problemOpt.get());
        comment.setContent(request.getContent());
        comment.setCreatedAt(LocalDateTime.now());

        commentRepository.save(comment);

        return ResponseEntity.ok(comment);
    }

    // ✅ Update comment
    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Integer id, @RequestBody CommentRequest request) {
        Optional<Comment> commentOpt = commentRepository.findById(id.longValue());
        if (commentOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Comment comment = commentOpt.get();
        comment.setContent(request.getContent());
        commentRepository.save(comment);

        return ResponseEntity.ok(comment);
    }

    // ✅ Delete comment
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Integer id) {

        Long longId = id.longValue();
        if (!commentRepository.existsById(longId)) {
            return ResponseEntity.notFound().build();
        }
        commentRepository.deleteById(longId);
        return ResponseEntity.ok("Comment deleted");
    }
}