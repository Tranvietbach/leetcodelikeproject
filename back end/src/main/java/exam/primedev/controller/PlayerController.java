package exam.primedev.controller;

import exam.primedev.entity.Player; // Sửa thành đúng package
import exam.primedev.entity.Club; // Sửa thành đúng package
import exam.primedev.repository.PlayerRepository; // Sửa thành đúng package
import exam.primedev.repository.ClubRepository; // Sửa thành đúng package

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private ClubRepository clubRepository;

    // 1. Add info of new Player (Create)
    @PostMapping
    public ResponseEntity<?> addPlayer(@RequestBody Player player) {
        String error = validatePlayer(player);
        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }

        Club club = clubRepository.findById(player.getClub().getId()).orElse(null);
        if (club == null) {
            return ResponseEntity.badRequest().body("Câu lạc bộ không tồn tại.");
        }

        player.setClub(club);
        Player saved = playerRepository.save(player);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 2. List all Players (Read)
    @GetMapping
    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    // 3. Edit info of an existing Player (Update)
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlayer(@PathVariable Integer id, @RequestBody Player playerDetails) {
        String error = validatePlayer(playerDetails);
        if (error != null) {
            return ResponseEntity.badRequest().body(error);
        }
    
        Player player = playerRepository.findById(id).orElse(null);
        if (player == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy cầu thủ.");
        }
    
        Club club = clubRepository.findById(playerDetails.getClub().getId()).orElse(null);
        if (club == null) {
            return ResponseEntity.badRequest().body("Câu lạc bộ không tồn tại.");
        }
    
        player.setName(playerDetails.getName());
        player.setAge(playerDetails.getAge());
        player.setWeight(playerDetails.getWeight());
        player.setHeight(playerDetails.getHeight());
        player.setPosition(playerDetails.getPosition());
        player.setClub(club);
        player.setDateOfBirth(playerDetails.getDateOfBirth());
        player.setBloodType(playerDetails.getBloodType());

        player.setPosition(playerDetails.getPosition());
        // Fix: Check if the active status is true or false, based on the Boolean value
        player.setActive(playerDetails.getActive() != null && playerDetails.getActive());  // If active is true, set true, otherwise false
    
        Player updated = playerRepository.save(player);
        return ResponseEntity.ok(updated);
    }

    // 4. Remove info of an existing Player (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable Integer id) {
        if (!playerRepository.existsById(id)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        playerRepository.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 5. Search Players by name (Search)
    @GetMapping("/search")
    public List<Player> searchPlayers(@RequestParam String name) {
        return playerRepository.findByNameContaining(name);
    }

    @GetMapping("/clubs")
    public List<Club> getAllClub() {
        return clubRepository.findAll();
    }

    private String validatePlayer(Player player) {
        if (player.getName() == null || player.getName().trim().isEmpty()) {
            return "Tên cầu thủ không được để trống.";
        }
        if (player.getAge() < 18 || player.getAge() > 40) {
            return "Tuổi phải từ 18 đến 40.";
        }
        if (player.getWeight() < 50 || player.getWeight() > 100) {
            return "Cân nặng phải từ 50kg đến 100kg.";
        }
        if (player.getHeight() < 1.6 || player.getHeight() > 2.0) {
            return "Chiều cao phải từ 1.6m đến 2.0m.";
        }
        if (player.getPosition() == null || player.getPosition().trim().isEmpty()) {
            return "Vị trí không được để trống.";
        }
        if (player.getClub() == null || player.getClub().getId() == null) {
            return "Câu lạc bộ không được để trống.";
        }
        return null; // hợp lệ
    }
}