package com.culturalfest.judges.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class WebController {

    /**
     * Handles Angular routing by serving index.html for any request 
     * that doesn't match an API endpoint or static resource
     */
    @RequestMapping(value = {"/", "/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}