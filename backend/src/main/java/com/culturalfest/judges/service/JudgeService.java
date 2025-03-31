package com.culturalfest.judges.service;

import com.culturalfest.judges.dto.JudgeDTO;

import java.util.List;

public interface JudgeService {
    List<JudgeDTO> getAllJudges();
    JudgeDTO getJudgeById(Long id);
    JudgeDTO createJudge(JudgeDTO judgeDTO);
    JudgeDTO updateJudge(Long id, JudgeDTO judgeDTO);
    void deleteJudge(Long id);
} 