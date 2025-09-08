package exam.primedev.controller;


import exam.primedev.entity.Badge;
import exam.primedev.repository.BadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/badges")
@CrossOrigin(origins = "*")
public class BadgeController {

    @Autowired
    private BadgeRepository badgeRepository;

    // Get all badges
    // @GetMapping
    // public ResponseEntity<List<Badge>> getAllBadges() {
    //     List<Badge> badges = badgeRepository.findAll();
    //     return ResponseEntity.ok(badges);
    // }

    // // Get badge by ID
    // @GetMapping("/{id}")
    // public ResponseEntity<Badge> getBadgeById(@PathVariable Integer id) {
    //     Optional<Badge> badge = badgeRepository.findById(id);
    //     return badge.map(ResponseEntity::ok)
    //             .orElse(ResponseEntity.notFound().build());
    // }

    // // Create new badge
    // @PostMapping
    // public ResponseEntity<Badge> createBadge(@RequestBody Badge badge) {
    //     Badge savedBadge = badgeRepository.save(badge);
    //     return ResponseEntity.status(HttpStatus.CREATED).body(savedBadge);
    // }

    // // Update badge
    // @PutMapping("/{id}")
    // public ResponseEntity<Badge> updateBadge(@PathVariable Integer id, @RequestBody Badge badgeDetails) {
    //     Optional<Badge> badgeOpt = badgeRepository.findById(id);
    //     if (badgeOpt.isEmpty()) {
    //         return ResponseEntity.notFound().build();
    //     }

    //     Badge badge = badgeOpt.get();
    //     badge.setName(badgeDetails.getName());
    //     badge.setDescription(badgeDetails.getDescription());

    //     Badge updatedBadge = badgeRepository.save(badge);
    //     return ResponseEntity.ok(updatedBadge);
    // }

    // // Delete badge
    // @DeleteMapping("/{id}")
    // public ResponseEntity<Void> deleteBadge(@PathVariable Integer id) {
    //     if (!badgeRepository.existsById(id)) {
    //         return ResponseEntity.notFound().build();
    //     }
    //     badgeRepository.deleteById(id);
    //     return ResponseEntity.noContent().build();
    // }
}