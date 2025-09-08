package exam.primedev.service;

import java.io.File;
import java.io.FileOutputStream;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashSet;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import exam.primedev.dto.RegisterRequest;
import exam.primedev.entity.Ranking;
import exam.primedev.entity.User;
import exam.primedev.entity.UserProfile;
import exam.primedev.entity.UserRole;
import exam.primedev.repository.UserRepository;
import exam.primedev.repository.RankingRepository;
import exam.primedev.repository.UserProfileRepository;
import exam.primedev.repository.UserRoleRepository;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserProfileRepository userProfileRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private RankingRepository rankingRepository;

    // Constructor đúng tên

    public String registerUser(RegisterRequest registerRequest) {
        // Kiểm tra trùng username hoặc email
        if (userRepository.existsByUsername(registerRequest.username)) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại!");
        }

        if (userRepository.existsByEmail(registerRequest.email)) {
            throw new RuntimeException("Email đã được đăng ký!");
        }
        // Mã hóa mật khẩu
        String encodedPassword = new BCryptPasswordEncoder().encode(registerRequest.password);

        // Tạo user
        User user = new User();
        user.setUsername(registerRequest.username);
        user.setEmail(registerRequest.email);
        user.setPasswordHash(encodedPassword);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setRoles(new HashSet<>());

        // Gán role mặc định
        UserRole userRole = userRoleRepository.findByRoleName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy vai trò ROLE_USER"));

        user.getRoles().add(userRole);
        userRepository.save(user); // Lưu user trước để sinh ID

        // Gán userProfile
        UserProfile userProfile = new UserProfile();
        userProfile.setUser(user);
        userProfile.setFullName(registerRequest.fullName);
        String avatarFileName = null;
        if (registerRequest.avatarBase64 != null && !registerRequest.avatarBase64.isEmpty()) {
            String timestamp = String.valueOf(System.currentTimeMillis());
            avatarFileName = "avatar_" + registerRequest.username + "_" + timestamp + ".jpg";
            saveBase64Image(registerRequest.avatarBase64, avatarFileName, "wwwroot/avatars");
        }
        userProfile.setAvatarUrl("http://localhost:2109/avatars/" + avatarFileName);

        userProfile.setCountry(registerRequest.country);
        userProfile.setGithubUrl(registerRequest.githubUrl);
        userProfile.setBio(registerRequest.bio);

        userProfileRepository.save(userProfile);

        Ranking userRanking = new Ranking();
        userRanking.setUser(user);
        userRanking.setRank(100000);
        userRanking.setScore(0.0f);
        userRanking.setUpdatedAt(LocalDateTime.now());

        rankingRepository.save(userRanking);
        return "Đăng ký thành công!";
    }

    public String saveBase64Image(String base64String, String fileName, String folderPath) {
        try {
            // Tạo folder nếu chưa có
            File folder = new File(folderPath);
            if (!folder.exists())
                folder.mkdirs();

            // Xử lý prefix nếu có
            if (base64String.contains(",")) {
                base64String = base64String.split(",")[1];
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64String);
            String fullPath = folderPath + File.separator + fileName;

            try (FileOutputStream fos = new FileOutputStream(fullPath)) {
                fos.write(imageBytes);
            }

            return fileName; // Trả lại tên file để lưu URL
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi lưu ảnh base64: " + e.getMessage());
        }
    }
}
