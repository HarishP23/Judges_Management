package com.culturalfest.judges.controller;

import com.culturalfest.judges.dto.ApiResponse;
import com.culturalfest.judges.dto.JudgeDTO;
import com.culturalfest.judges.service.JudgeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/judges")
public class JudgeController {

    private final JudgeService judgeService;

    @Autowired
    public JudgeController(JudgeService judgeService) {
        this.judgeService = judgeService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<JudgeDTO>>> getAllJudges() {
        List<JudgeDTO> judges = judgeService.getAllJudges();
        return ResponseEntity.ok(ApiResponse.success("Judges retrieved successfully", judges));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JudgeDTO>> getJudgeById(@PathVariable Long id) {
        JudgeDTO judge = judgeService.getJudgeById(id);
        return ResponseEntity.ok(ApiResponse.success("Judge retrieved successfully", judge));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JudgeDTO>> createJudge(@Valid @RequestBody JudgeDTO judgeDTO) {
        JudgeDTO createdJudge = judgeService.createJudge(judgeDTO);
        return new ResponseEntity<>(ApiResponse.success("Judge created successfully", createdJudge), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JudgeDTO>> updateJudge(@PathVariable Long id, @Valid @RequestBody JudgeDTO judgeDTO) {
        JudgeDTO updatedJudge = judgeService.updateJudge(id, judgeDTO);
        return ResponseEntity.ok(ApiResponse.success("Judge updated successfully", updatedJudge));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJudge(@PathVariable Long id) {
        judgeService.deleteJudge(id);
        return ResponseEntity.ok(ApiResponse.success("Judge deleted successfully", null));
    }
} 