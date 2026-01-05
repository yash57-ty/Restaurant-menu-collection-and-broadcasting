package org.example.backendi.service;

import org.example.backendi.model.MenuStore;
import org.example.backendi.repo.MenuStoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {
    @Autowired
    MenuStoreRepository menuStoreRepository;

    public void storeMenu(MenuStore menuStore){
        menuStoreRepository.save(menuStore);
    }

    public List<MenuStore> getmenu() {
        return menuStoreRepository.findAll();
    }
}
