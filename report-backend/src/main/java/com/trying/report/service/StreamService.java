package com.trying.report.service;

import com.trying.report.entity.Stream;
import com.trying.report.repository.StreamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StreamService {

    @Autowired
    private StreamRepository streamRepository;

    public List<Stream> findAll() {
        return streamRepository.findAll();
    }

    public Stream save(Stream stream) {
        if (stream.getName() == null || stream.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Stream name cannot be empty.");
        }

        if (streamRepository.existsByName(stream.getName())) {
            throw new IllegalArgumentException("Stream with this name already exists.");
        }

        return streamRepository.save(stream);
    }

    public void delete(Long id) {
        streamRepository.deleteById(id);
    }
}
