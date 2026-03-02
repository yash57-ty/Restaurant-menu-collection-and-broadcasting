package org.example.backendi.service;

import org.example.backendi.model.MenuStore;
import org.example.backendi.model.dto.MenuResponse;
import org.example.backendi.repo.MenuStoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
public class MenuService {
    @Autowired
    MenuStoreRepository menuStoreRepository;

    public void storeMenu(MenuStore menuStore){
        menuStoreRepository.save(menuStore);
    }

    public List<MenuResponse> getmenu() {
        List<MenuStore> mn = menuStoreRepository.findActiveMenus();
        List<MenuResponse> menuResponses = new ArrayList<>();

        for (MenuStore m : mn) {
            MenuResponse menuResponse = new MenuResponse(
                    m.getPhone(),
                    m.getMenu(),
                    m.getPrice(),
                    m.getId(),
                    m.getCreatedDate(),
                    m.getRestaurant().getRestaurantName(),
                    m.getLimit(),
                    m.getOrerCount()
            );
            menuResponses.add(menuResponse);
        }
        return menuResponses;
    }

    private List<MenuResponse> convertToResponse(List<MenuStore> menus) {
        List<MenuResponse> responses = new ArrayList<>();

        for (MenuStore m : menus) {
            responses.add(new MenuResponse(
                    m.getPhone(),
                    m.getMenu(),
                    m.getPrice(),
                    m.getId(),
                    m.getCreatedDate(),
                    m.getRestaurant().getRestaurantName(),
                    m.getLimit(),
                    m.getOrerCount()
            ));
        }

        return responses;
    }

    private int levenshtein(String a, String b) {

        int[][] dp = new int[a.length() + 1][b.length() + 1];

        for (int i = 0; i <= a.length(); i++)
            dp[i][0] = i;

        for (int j = 0; j <= b.length(); j++)
            dp[0][j] = j;

        for (int i = 1; i <= a.length(); i++) {
            for (int j = 1; j <= b.length(); j++) {

                int cost = (a.charAt(i - 1) == b.charAt(j - 1)) ? 0 : 1;

                dp[i][j] = Math.min(
                        Math.min(dp[i - 1][j] + 1,
                                dp[i][j - 1] + 1),
                        dp[i - 1][j - 1] + cost
                );
            }
        }

        return dp[a.length()][b.length()];
    }

    public List<MenuResponse> getmenubySearch(String keyword) {

        List<MenuStore> menus = menuStoreRepository.findActiveMenus();

        if (keyword == null || keyword.trim().isEmpty()) {
            return convertToResponse(menus);
        }

        String lowerKeyword = keyword.toLowerCase().trim();

        List<MenuStore> filtered = new ArrayList<>();

        for (MenuStore m : menus) {

            String combinedText = (
                    m.getMenu() + " " +
                            m.getRestaurant().getRestaurantName()
            ).toLowerCase();

            if (combinedText.contains(lowerKeyword)) {
                filtered.add(m);
                continue;
            }

            String[] words = combinedText.split("\\s+");

            for (String word : words) {
                int distance = levenshtein(word, lowerKeyword);

                if (distance <= 2) {
                    filtered.add(m);
                    break;
                }
            }
        }

        return convertToResponse(filtered);
    }


}
