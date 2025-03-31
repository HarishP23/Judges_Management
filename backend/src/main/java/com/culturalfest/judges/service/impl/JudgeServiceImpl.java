package com.culturalfest.judges.service.impl;

import com.culturalfest.judges.dto.JudgeDTO;
import com.culturalfest.judges.model.Judge;
import com.culturalfest.judges.repository.JudgeRepository;
import com.culturalfest.judges.service.JudgeService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JudgeServiceImpl implements JudgeService {

    private final JudgeRepository judgeRepository;

    @Autowired
    public JudgeServiceImpl(JudgeRepository judgeRepository) {
        this.judgeRepository = judgeRepository;
    }

    @Override
    public List<JudgeDTO> getAllJudges() {
        return judgeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public JudgeDTO getJudgeById(Long id) {
        Judge judge = judgeRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Judge not found with id: " + id));
        return convertToDTO(judge);
    }

    @Override
    public JudgeDTO createJudge(JudgeDTO judgeDTO) {
        Judge judge = convertToEntity(judgeDTO);
        Judge savedJudge = judgeRepository.save(judge);
        return convertToDTO(savedJudge);
    }

    @Override
    public JudgeDTO updateJudge(Long id, JudgeDTO judgeDTO) {
        if (!judgeRepository.existsById(id)) {
            throw new EntityNotFoundException("Judge not found with id: " + id);
        }
        
        Judge judge = convertToEntity(judgeDTO);
        judge.setId(id);
        Judge updatedJudge = judgeRepository.save(judge);
        return convertToDTO(updatedJudge);
    }

    @Override
    public void deleteJudge(Long id) {
        if (!judgeRepository.existsById(id)) {
            throw new EntityNotFoundException("Judge not found with id: " + id);
        }
        judgeRepository.deleteById(id);
    }

    private JudgeDTO convertToDTO(Judge judge) {
        JudgeDTO judgeDTO = new JudgeDTO();
        judgeDTO.setId(judge.getId());
        judgeDTO.setName(judge.getName());
        judgeDTO.setEmail(judge.getEmail());
        judgeDTO.setPhone(judge.getPhone());
        judgeDTO.setExperienceLevel(judge.getExperienceLevel());
        judgeDTO.setFieldSpecialization(judge.getFieldSpecialization());
        judgeDTO.setProfilePictureUrl(judge.getProfilePictureUrl());
        return judgeDTO;
    }

    private Judge convertToEntity(JudgeDTO judgeDTO) {
        Judge judge = new Judge();
        judge.setId(judgeDTO.getId());
        judge.setName(judgeDTO.getName());
        judge.setEmail(judgeDTO.getEmail());
        judge.setPhone(judgeDTO.getPhone());
        judge.setExperienceLevel(judgeDTO.getExperienceLevel());
        judge.setFieldSpecialization(judgeDTO.getFieldSpecialization());
        judge.setProfilePictureUrl(judgeDTO.getProfilePictureUrl());
        return judge;
    }
} 