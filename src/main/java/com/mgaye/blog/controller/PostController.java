package com.mgaye.blog.controller;

import com.mgaye.blog.model.Post;
import com.mgaye.blog.repository.PostRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {

    private final PostRepository repository;

    public PostController(PostRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Post> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public Post create(
            @RequestParam String title,
            @RequestParam String content,
            @RequestParam MultipartFile image) throws IOException {

        String uploadDir = "uploads/";
        new File(uploadDir).mkdirs();

        String filePath = uploadDir + image.getOriginalFilename();
        image.transferTo(new File(filePath));

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setImageUrl(filePath);

        return repository.save(post);
    }
}