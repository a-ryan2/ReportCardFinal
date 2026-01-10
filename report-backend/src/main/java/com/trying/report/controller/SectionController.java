
package com.trying.report.controller;

import com.trying.report.entity.Section;
import com.trying.report.service.SectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class SectionController {

    @Autowired
    private SectionService sectionService;

    @PostMapping()
    public Section saveSection(@RequestBody Section section) {
        return sectionService.save(section);
    }

    // Delete a section
    @DeleteMapping("/{id}")
    public void deleteSection(@PathVariable Long id) {
        sectionService.deleteSection(id);
    }

    @GetMapping()
    public List<Section> getAllSections() {
        return sectionService.findAll();
    }
}
