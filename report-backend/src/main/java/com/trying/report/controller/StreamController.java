package com.trying.report.controller;

import com.trying.report.entity.Stream;
import com.trying.report.service.StreamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/streams")
public class StreamController {

    @Autowired
    private StreamService streamService;

    @GetMapping
    public List<Stream> getAllStreams() {
        return streamService.findAll();
    }

    @PostMapping
    public Stream saveStream(@RequestBody Stream stream) {
        return streamService.save(stream);
    }

    @DeleteMapping("/{id}")
    public void deleteStream(@PathVariable Long id) {
        streamService.delete(id);
    }
}
