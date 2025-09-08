package exam.primedev.controller;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;

import exam.primedev.dto.ChangePasswordRequest;
import exam.primedev.dto.FeedbackCreateRequest;
import exam.primedev.entity.Feedback;
import exam.primedev.entity.User;
import exam.primedev.repository.FeedbackRepository;
import exam.primedev.repository.UserRepository;
import exam.primedev.service.EmailService;

@RestController
@RequestMapping("/api/new")
@CrossOrigin(origins = "*") // Cho phép frontend gọi từ port khác
public class NewController {
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @PostMapping("/Feedback")
    public ResponseEntity<?> addFeedback(@RequestBody FeedbackCreateRequest request) {
        Long userId = JwtUtil.extractUserIdFromToken(request.getToken());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Feedback feedback = new Feedback();
        feedback.setUser(user);
        feedback.setMessage(request.getMessage());

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(savedFeedback);
    }

    @GetMapping("/send-mail")
    public String sendMail() {
        emailService.sendSimpleEmail("tuannna21092008@gmail.com", "Test Subject", "Hello from Spring Boot!");
        return "Mail sent";
    }

    @PostMapping("/send-verification")
    public ResponseEntity<?> sendVerification(@RequestBody Map<String, Object> request) {
        try {
            System.out.println(">>> JSON nhận được: " + request); // 🧪 IN RA XEM

            Object tokenObj = request.get("token");
            if (tokenObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Thiếu token trong request body"));
            }

            String token = tokenObj.toString();
            Long userId = JwtUtil.extractUserIdFromToken(token);

            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
            emailService.sendVerificationCode(userId, user.getEmail());

            return ResponseEntity.ok(Map.of("message", "Mã xác minh đã được gửi tới email."));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi máy chủ không xác định."));
        }
    }

    // Xác nhận mã xác minh
    @PostMapping("/confirm-verification")
    public ResponseEntity<?> confirmVerification(@RequestBody Map<String, Object> request) {
        try {
            Object tokenObj = request.get("token");
            if (tokenObj == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Thiếu token trong request body"));
            }

            String token = tokenObj.toString();
            Long userId = JwtUtil.extractUserIdFromToken(token);
            String code = request.get("code").toString();

            boolean success = emailService.confirmVerificationCode(userId, code);
            return ResponseEntity.ok(Map.of("verified", success));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Lỗi máy chủ không xác định."));
        }
    }

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            Long userId = JwtUtil.extractUserIdFromToken(request.getToken());

            Optional<User> optionalUser = userRepository.findById(userId);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy người dùng");
            }

            User user = optionalUser.get();

            if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                return ResponseEntity.badRequest().body("Mật khẩu cũ không đúng");
            }

            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                return ResponseEntity.badRequest().body("Mật khẩu mới và xác nhận không khớp");
            }

            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
            user.setUpdatedAt(LocalDateTime.now());

            userRepository.save(user);

            return ResponseEntity.ok("Đổi mật khẩu thành công");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Token không hợp lệ hoặc lỗi hệ thống");
        }
    }

}
