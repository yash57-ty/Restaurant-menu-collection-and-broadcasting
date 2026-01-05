package org.example.backendi.controller;

import org.example.backendi.model.MenuStore;
import org.example.backendi.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@Controller
@CrossOrigin
@RestController
public class MenuController {
    @Autowired
    MenuService menuService;

    @GetMapping("api/message")
    public List<MenuStore> getMenus(){
        return menuService.getmenu();
    }
}
