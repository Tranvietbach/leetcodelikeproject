package exam.primedev.controller;

import exam.primedev.entity.tag;
import exam.primedev.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tags")
@CrossOrigin(origins = "*")
public class TagController {

    @Autowired
    private TagRepository tagRepository;

    // Get all tags
    @GetMapping
    public ResponseEntity<List<tag>> getAllTags() {
        List<tag> tags = tagRepository.findAll();
        return ResponseEntity.ok(tags);
    }

    // Get tag by ID
    @GetMapping("/{id}")
    public ResponseEntity<tag> getTagById(@PathVariable Long id) {
        Optional<tag> tag = tagRepository.findById(id);
        return tag.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create new tag
    @PostMapping
    public ResponseEntity<tag> createTag(@RequestBody tag tag) {
        tag savedTag = tagRepository.save(tag);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTag);
    }

    // Update tag
    @PutMapping("/{id}")
    public ResponseEntity<tag> updateTag(@PathVariable Long id, @RequestBody tag tagDetails) {
        Optional<tag> tagOpt = tagRepository.findById(id);
        if (tagOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        tag tag = tagOpt.get();
        tag.setName(tagDetails.getName());

        tag updatedTag = tagRepository.save(tag);
        return ResponseEntity.ok(updatedTag);
    }

    // Delete tag
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTag(@PathVariable Long id) {
        if (!tagRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        tagRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}