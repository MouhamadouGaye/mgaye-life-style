package com.mgaye.blog.controller;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.mgaye.blog.model.Post;
import com.mgaye.blog.repository.PostRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://blog-frontend-site.storage.googleapis.com")
public class PostController {

    private final PostRepository repository;

    public PostController(PostRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/")
    public String hello() {
        return "Hello, World!";
    }

    @GetMapping("/posts")
    public List<Post> getAll() {
        return repository.findAll();
    }

    @GetMapping("/posts/{id}")
    public Post getPost(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    @PostMapping("/posts")
    public Post create(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam MultipartFile image) throws IOException {

        Storage storage = StorageOptions.getDefaultInstance().getService();

        String bucketName = System.getenv("BUCKET_NAME");
        String fileName = UUID.randomUUID() + "-" + image.getOriginalFilename();

        BlobId blobId = BlobId.of(bucketName, fileName);
        // BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(image.getContentType())
                .build();

        storage.create(blobInfo, image.getBytes());

        String imageUrl = "https://storage.googleapis.com/" + bucketName + "/" + fileName;

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(imageUrl);

        return repository.save(post);
    }

    // @DeleteMapping("/posts/{id}")
    // public void deletePost(@PathVariable Long id) {
    // repository.deleteById(id);
    // }
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repository.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/posts/{id}")
    public Post updatePost(
            @PathVariable Long id,
            @RequestParam String title,
            @RequestParam String content) {

        Post post = repository.findById(id).orElseThrow();

        post.setTitle(title);
        post.setContent(content);

        return repository.save(post);
    }

    @PatchMapping("/posts/{id}")
    public Post patchPost(
            @PathVariable Long id,
            @RequestBody Map<String, Object> updates) {

        Post post = repository.findById(id).orElseThrow();

        if (updates.containsKey("title")) {
            post.setTitle((String) updates.get("title"));
        }

        if (updates.containsKey("content")) {
            post.setContent((String) updates.get("content"));
        }

        return repository.save(post);
    }
}
