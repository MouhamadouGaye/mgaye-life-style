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

    // @PostMapping
    // public Post create(
    // @RequestParam String title,
    // @RequestParam String content,
    // @RequestParam MultipartFile image) throws IOException {

    // String uploadDir = "uploads/";
    // new File(uploadDir).mkdirs();

    // String filePath = uploadDir + image.getOriginalFilename();
    // image.transferTo(new File(filePath));

    // Post post = new Post();
    // post.setTitle(title);
    // post.setContent(content);
    // post.setImageUrl(filePath);

    // return repository.save(post);
    // }

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
}
