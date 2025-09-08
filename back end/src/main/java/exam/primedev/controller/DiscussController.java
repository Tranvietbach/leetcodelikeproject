package exam.primedev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import exam.primedev.dto.CommentRequest;
import exam.primedev.dto.DiscussResponse;
import exam.primedev.entity.CommentDiscuss;
import exam.primedev.entity.Discuss;
import exam.primedev.entity.SupportDiscuss;
import exam.primedev.entity.User;
import exam.primedev.repository.CommentDiscussRepository;
import exam.primedev.repository.DiscussRepository;
import exam.primedev.repository.SupportDiscussRepository;
import exam.primedev.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discuss")
public class DiscussController {

    @Autowired
    private DiscussRepository discussRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupportDiscussRepository supportDiscussRepository;

    @Autowired
    private CommentDiscussRepository commentDiscussRepository;

    // ✅ CREATE Comment
@PostMapping("/{discussId}/comments")
public ResponseEntity<?> addComment(
        @PathVariable Long discussId,
        @RequestBody CommentRequest req,
        @RequestHeader("Authorization") String token) {

    Long userId = JwtUtil.extractUserIdFromToken(token);

    Discuss d = discussRepository.findById(discussId)
            .orElseThrow(() -> new RuntimeException("Discuss not found"));

    CommentDiscuss comment = new CommentDiscuss();
    comment.setContent(req.getContent());
    comment.setDiscuss(d);
    comment.setUser(userRepository.findById(userId).orElse(null));
    comment.setCreatedAt(LocalDateTime.now());
    commentDiscussRepository.save(comment);

    return ResponseEntity.ok(comment);
}

    // ✅ UPDATE Comment
    @PutMapping("/{id}/comments")
    public ResponseEntity<?> updateComment(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        Long currentUserId = JwtUtil.extractUserIdFromToken(token);
        Optional<CommentDiscuss> optional = commentDiscussRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }

        CommentDiscuss comment = optional.get();

        // Chỉ cho phép sửa nếu là chủ comment
        if (!comment.getUser().getId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your comment");
        }

        comment.setContent(body.get("content"));
        comment.setUpdatedAt(LocalDateTime.now());

        CommentDiscuss updated = commentDiscussRepository.save(comment);
        return ResponseEntity.ok(updated);
    }

    // ✅ DELETE Comment
    @DeleteMapping("/{id}/comments")
    public ResponseEntity<?> deleteComment(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {

        Long currentUserId = JwtUtil.extractUserIdFromToken(token);
        Optional<CommentDiscuss> optional = commentDiscussRepository.findById(id);

        if (optional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Comment not found");
        }

        CommentDiscuss comment = optional.get();

        // Chỉ cho phép xóa nếu là chủ comment
        if (!comment.getUser().getId().equals(currentUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not your comment");
        }

        commentDiscussRepository.delete(comment);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    // Upvote
    @PostMapping("/{id}/upvote")
    public ResponseEntity<?> upvote(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.extractUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Discuss discuss = discussRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discuss not found"));

        // Kiểm tra xem user đã vote chưa
        Optional<SupportDiscuss> existingVoteOpt = supportDiscussRepository.findByDiscussAndUser(discuss, user);

        if (existingVoteOpt.isPresent()) {
            SupportDiscuss existingVote = existingVoteOpt.get();
            if ("UPVOTE".equals(existingVote.getVoteType())) {
                // Đã upvote rồi → bỏ upvote
                supportDiscussRepository.delete(existingVote);
                return ResponseEntity.ok("Đã bỏ upvote");
            } else {
                // Đã downvote → xóa downvote, thêm upvote
                supportDiscussRepository.delete(existingVote);
            }
        }

        // Thêm upvote
        SupportDiscuss vote = new SupportDiscuss();
        vote.setDiscuss(discuss);
        vote.setUser(user);
        vote.setVoteType("UPVOTE");
        supportDiscussRepository.save(vote);

        return ResponseEntity.ok("Upvote thành công");
    }

    @PostMapping("/{id}/downvote")
    public ResponseEntity<?> downvote(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.extractUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Discuss discuss = discussRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discuss not found"));

        // Kiểm tra xem user đã vote chưa
        Optional<SupportDiscuss> existingVoteOpt = supportDiscussRepository.findByDiscussAndUser(discuss, user);

        if (existingVoteOpt.isPresent()) {
            SupportDiscuss existingVote = existingVoteOpt.get();
            if ("DOWNVOTE".equals(existingVote.getVoteType())) {
                // Đã downvote rồi → bỏ downvote
                supportDiscussRepository.delete(existingVote);
                return ResponseEntity.ok("Đã bỏ downvote");
            } else {
                // Đã upvote → xóa upvote, thêm downvote
                supportDiscussRepository.delete(existingVote);
            }
        }

        // Thêm downvote
        SupportDiscuss vote = new SupportDiscuss();
        vote.setDiscuss(discuss);
        vote.setUser(user);
        vote.setVoteType("DOWNVOTE");
        supportDiscussRepository.save(vote);

        return ResponseEntity.ok("Downvote thành công");
    }

    // Create
    @PostMapping
    public ResponseEntity<?> createDiscuss(@RequestBody Discuss discuss, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.extractUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        discuss.setUser(user);
        Discuss saved = discussRepository.save(discuss);
        return ResponseEntity.ok(saved);
    }

    // Read all (with isOwner)
    @GetMapping
    public ResponseEntity<List<DiscussResponse>> getAllDiscuss(@RequestHeader("Authorization") String token) {
        Long currentUserId = JwtUtil.extractUserIdFromToken(token);

        List<Discuss> discusses = discussRepository.findAll();
        List<DiscussResponse> responses = new ArrayList<>();

        for (Discuss d : discusses) {
            String userName = d.getUser() != null ? d.getUser().getUsername() : "Unknown";
            boolean isOwner = d.getUser() != null && d.getUser().getId().equals(currentUserId);

            int upvotes = supportDiscussRepository.countByDiscussAndVoteType(d, "UPVOTE");
            int downvotes = supportDiscussRepository.countByDiscussAndVoteType(d, "DOWNVOTE");

            // Kiểm tra vote của currentUser
            Optional<SupportDiscuss> userVoteOpt = supportDiscussRepository.findByDiscussAndUser(d, d.getUser());
            int vote = 2; // mặc định chưa vote
            if (userVoteOpt.isPresent()) {
                vote = "UPVOTE".equals(userVoteOpt.get().getVoteType()) ? 0 : 1;
            }

            responses.add(new DiscussResponse(
                    d.getId(),
                    d.getTitle(),
                    d.getContent(),
                    userName,
                    isOwner,
                    upvotes,
                    downvotes,
                    vote));
        }

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDiscussWithComments(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {

        Long currentUserId = JwtUtil.extractUserIdFromToken(token);

        // Lấy discuss
        Discuss d = discussRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Discuss not found"));

        String userName = d.getUser() != null ? d.getUser().getUsername() : "Unknown";
        boolean isOwner = d.getUser() != null && d.getUser().getId().equals(currentUserId);

        int upvotes = supportDiscussRepository.countByDiscussAndVoteType(d, "UPVOTE");
        int downvotes = supportDiscussRepository.countByDiscussAndVoteType(d, "DOWNVOTE");

        Optional<SupportDiscuss> userVoteOpt = supportDiscussRepository.findByDiscussAndUser(d,
                userRepository.findById(currentUserId).orElse(null));
        int vote = 2; // chưa vote
        if (userVoteOpt.isPresent()) {
            vote = "UPVOTE".equals(userVoteOpt.get().getVoteType()) ? 0 : 1;
        }

        // Chuyển discuss thành response
        DiscussResponse response = new DiscussResponse(
                d.getId(),
                d.getTitle(),
                d.getContent(),
                userName,
                isOwner,
                upvotes,
                downvotes,
                vote);

        // Lấy comment list
        List<CommentDiscuss> comments = commentDiscussRepository.findByDiscussOrderByCreatedAtAsc(d);
        List<Map<String, Object>> commentResponses = new ArrayList<>();

        for (CommentDiscuss c : comments) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", c.getId());
            map.put("content", c.getContent());
            map.put("username", c.getUser() != null ? c.getUser().getUsername() : "Unknown");
            map.put("createdAt", c.getCreatedAt());
            map.put("isOwnerComment", c.getUser() != null && c.getUser().getId().equals(currentUserId));
            commentResponses.add(map);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("discuss", response);
        result.put("comments", commentResponses);

        return ResponseEntity.ok(result);
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDiscuss(@PathVariable Long id, @RequestBody Discuss updatedDiscuss,
            @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.extractUserIdFromToken(token);
        return discussRepository.findById(id)
                .map(discuss -> {
                    if (!discuss.getUser().getId().equals(userId)) {
                        return ResponseEntity.status(403).body("Not allowed to update this discuss");
                    }
                    discuss.setTitle(updatedDiscuss.getTitle());
                    discuss.setContent(updatedDiscuss.getContent());
                    Discuss saved = discussRepository.save(discuss);
                    return ResponseEntity.ok(saved);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDiscuss(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        Long userId = JwtUtil.extractUserIdFromToken(token);
        return discussRepository.findById(id)
                .map(discuss -> {
                    if (!discuss.getUser().getId().equals(userId)) {
                        return ResponseEntity.status(403).body("Not allowed to delete this discuss");
                    }
                    discussRepository.delete(discuss);
                    return ResponseEntity.ok("Deleted successfully");
                })
                .orElse(ResponseEntity.notFound().build());
    }
}