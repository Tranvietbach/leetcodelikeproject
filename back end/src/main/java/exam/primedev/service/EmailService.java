package exam.primedev.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import exam.primedev.entity.EmailVerification;
import exam.primedev.repository.EmailVerificationRepository;
import exam.primedev.repository.UserRepository;
import exam.primedev.entity.User;




@Service
public class EmailService {

    private final JavaMailSender mailSender;
    private final EmailVerificationRepository verificationRepository;
    private final UserRepository userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final int MAX_ATTEMPTS = 5;
    private final int EXPIRATION_MINUTES = 10;

    @Autowired
    public EmailService(JavaMailSender mailSender,
                        EmailVerificationRepository verificationRepository,
                        UserRepository userRepository) {
        this.mailSender = mailSender;
        this.verificationRepository = verificationRepository;
        this.userRepository = userRepository;
    }

    public void sendVerificationCode(Long userId, String email) {
        // Mã xác minh 6 chữ số
        String rawCode = String.valueOf(100000 + new Random().nextInt(900000));
        String hashedCode = passwordEncoder.encode(rawCode);

        EmailVerification verification = verificationRepository.findByIdUser(userId)
                .orElse(new EmailVerification());

        verification.setIdUser(userId);
        verification.setKey(hashedCode);
        verification.setStatus(false);
        verification.setCreatedAt(LocalDateTime.now());
        verification.setFailedAttempts(0);
        verificationRepository.save(verification);

        String subject = "Mã xác minh email của bạn";
        String body = "Xin chào,\n\nMã xác minh của bạn là: " + rawCode
                    + "\nMã có hiệu lực trong " + EXPIRATION_MINUTES + " phút.";

        sendSimpleEmail(email, subject, body);
    }

    public boolean confirmVerificationCode(Long userId, String inputCode) {
        EmailVerification verify = verificationRepository.findByIdUser(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy mã xác minh."));

        if (verify.isStatus()) return true;

        LocalDateTime expiredAt = verify.getCreatedAt().plusMinutes(EXPIRATION_MINUTES);
        if (LocalDateTime.now().isAfter(expiredAt)) {
            throw new RuntimeException("Mã đã hết hạn. Vui lòng gửi lại.");
        }

        if (verify.getFailedAttempts() >= MAX_ATTEMPTS) {
            throw new RuntimeException("Bạn đã nhập sai quá nhiều lần.");
        }

        if (passwordEncoder.matches(inputCode, verify.getKey())) {
            verify.setStatus(true);
            verificationRepository.save(verify);

            User user = userRepository.findById(userId).orElseThrow();
            user.setStatusmail(true);
            userRepository.save(user);
            return true;
        } else {
            verify.setFailedAttempts(verify.getFailedAttempts() + 1);
            verificationRepository.save(verify);
            throw new RuntimeException("Mã không đúng. Hãy thử lại.");
        }
    }

    public void sendSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("tuannna21092008@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }
}
