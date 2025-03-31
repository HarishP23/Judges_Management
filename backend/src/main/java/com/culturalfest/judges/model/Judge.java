package com.culturalfest.judges.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "judges")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Judge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number should be valid")
    private String phone;

    @NotNull(message = "Experience level is required")
    @Enumerated(EnumType.STRING)
    private ExperienceLevel experienceLevel;

    @NotBlank(message = "Field specialization is required")
    private String fieldSpecialization;

    private String profilePictureUrl;

    public enum ExperienceLevel {
        NOVICE("0 - 1 years"),
        INTERMEDIATE("1 - 5 years"),
        EXPERT("5+ years");

        private final String description;

        ExperienceLevel(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }
    }
} 