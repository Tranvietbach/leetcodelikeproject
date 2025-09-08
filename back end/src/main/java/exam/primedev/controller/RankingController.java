package exam.primedev.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

import exam.primedev.entity.Ranking;
import io.jsonwebtoken.ExpiredJwtException;

import exam.primedev.repository.RankingRepository;



@RestController
@RequestMapping("/api/ranking")
public class RankingController {

    @Autowired
    private RankingRepository rankingRepo; // Autowired thay vì final + constructor

    // Hàm validate token
    private boolean validateToken(String token) {
        try {
            JwtUtil.extractUserIdFromToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("Token đã hết hạn");
        } catch (Exception e) {
            throw new RuntimeException("Token không hợp lệ");
        }
    }

@GetMapping
public ResponseEntity<?> getAllRanking(@RequestHeader("Authorization") String token) {
    validateToken(token);

    List<Ranking> rankings = rankingRepo.findAllWithUserOrderedByRank();
    List<Map<String, Object>> result = rankings.stream().map(r -> Map.<String, Object>of(
        "id", (Object) r.getId(),
        "rank", (Object) r.getRank(),
        "score", (Object) r.getScore(),
        "username", (Object) r.getUser().getUsername()
    )).toList();

    return ResponseEntity.ok(result);
}
    @PostMapping("/reset")
    public ResponseEntity<?> resetRanking(@RequestHeader("Authorization") String token) {
        try {
            validateToken(token);

            // Lấy tất cả và sort theo score giảm dần
            List<Ranking> rankings = rankingRepo.findAll();
            rankings.sort(Comparator.comparing(Ranking::getScore).reversed());

            // Cập nhật rank mới
            int rankCounter = 1;
            for (Ranking r : rankings) {
                r.setRank(rankCounter++);
            }

            rankingRepo.saveAll(rankings);

            return ResponseEntity.ok(Map.of("message", "Ranking đã được reset thành công!"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", e.getMessage()));
        }
    }
}
