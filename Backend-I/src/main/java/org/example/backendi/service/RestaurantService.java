package org.example.backendi.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.example.backendi.model.*;
import org.example.backendi.repo.MenuStoreRepository;
import org.example.backendi.repo.MenusessionRepo;
import org.example.backendi.repo.RestaurantRepository;
import org.example.backendi.repo.orderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuStoreRepository menuStoreRepository;

    @Autowired
    private emailService emailservice;
    @Autowired
    private orderRepo orderRepo;

    @Autowired
    private WhatsappClient wap;

    @Autowired
    private MenusessionRepo menusessionRepo;

    private final Map<String, Object> phoneLocks = new ConcurrentHashMap<>();

    private Object getPhoneLock(String phone) {
        return phoneLocks.computeIfAbsent(phone, k -> new Object());
    }

    public void getRestaurantdetails(JsonNode messagesNode) {

        String phone = messagesNode.path("from").asText();
        String text = messagesNode.path("text").path("body").asText().trim();

        synchronized (getPhoneLock(phone)) {

            Restaurant res = restaurantRepository.findByPhone(phone);

            if (res == null) {
                wap.sendText(phone, "❌ Please complete registration first");
                return;
            }

            Menu_session menu_session = menusessionRepo.findByPhoneNo(phone);

            if (menu_session != null && text.equalsIgnoreCase("RESET")) {
                menusessionRepo.delete(menu_session);
                wap.sendText(phone, "🔁 Session cancelled. Start again.");
                return;
            }


            if (text.equalsIgnoreCase("CANCEL")) {
                MenuStore m = menuStoreRepository.findActiveMenusbyphone(phone);

                if (m == null) {
                    wap.sendText(phone, "❌ No active menu to cancel");
                    return;
                }

                List<Order> orders = orderRepo.findByMenuStore(m);

                int totalCancelled = 0;

                for (Order order : orders) {

                    if ("CONFIRMED".equals(order.getStatus()) ||
                            "PARTIALLY_CANCELLED".equals(order.getStatus())) {

                        int qty = order.getQuantity();
                        totalCancelled += qty;

                        order.setQuantity(0);
                        order.setStatus("CANCELLED");
                        orderRepo.save(order);

                        String email=order.getUser().getEmail();

                        emailservice.sendCancelMail(email,order.getId());
                    }
                }

                int remain = m.getOrerCount() - totalCancelled;
                if(remain < 0){
                    remain = 0;
                }

                m.setOrerCount(remain);

                m.setExpiresAt(Instant.now());

                menuStoreRepository.save(m);

                wap.sendText(phone, "✅ Menu cancelled successfully");

                return;
            }


            if (menu_session != null && menu_session.getExpiresAt().isBefore(Instant.now())) {
                menusessionRepo.delete(menu_session);
                wap.sendText(phone, "⏳ Session expired. Please start again and send 'RESET'");
                return;
            }



            if (menu_session == null) {

                menu_session = new Menu_session();
                menu_session.setPhoneNo(phone);
                menu_session.setCreatedAt(Instant.now());
                menu_session.setExpiresAt(Instant.now().plus(1, ChronoUnit.MINUTES));

                MenuStore m = menuStoreRepository.findActiveMenusbyphone(phone);

                if (m != null) {
                    wap.sendText(phone, "❌ First Cancel Your Current Menu send Cancel message");
                    return;
                }

                menu_session.setCurrent_status("WAITING_MENU");
                menu_session.setUser_status("ACTIVE");
                menusessionRepo.save(menu_session);

                wap.sendText(phone, "📋 Please enter menu ");
                return;
            }

            /*
            ============================
            STATE MACHINE
            ============================
            */

            switch (menu_session.getCurrent_status()) {

                case "WAITING_MENU":

                    menu_session.setMessage(text);
                    menu_session.setCurrent_status("WAITING_PRICE");
                    menusessionRepo.save(menu_session);

                    wap.sendText(phone, "💰 Please enter price");
                    break;

                case "WAITING_PRICE":

                    try {
                        menu_session.setPrice(Integer.parseInt(text));
                        menu_session.setCurrent_status("WAITING_LIMIT");
                        menusessionRepo.save(menu_session);
                        wap.sendText(phone, "⚠ Please enter order limit");

                    } catch (NumberFormatException e) {

                        wap.sendText(phone, "❌ Invalid price");

                    }

                    break;

                case "WAITING_LIMIT":

                    try {

                        menu_session.setLimit(Integer.parseInt(text));
                        menu_session.setCurrent_status("WAITING_TIME");

                        menusessionRepo.save(menu_session);

                        wap.sendText(phone, "⏰ Enter time (e.g. 05:30 PM  and 11:30 AM)");

                    } catch (NumberFormatException e) {

                        wap.sendText(phone, "❌ Invalid limit");

                    }

                    break;

                case "WAITING_TIME":

                    Instant menuExpiry;

                    try {

                        ZoneId zone = ZoneId.of("Asia/Kolkata");

                        LocalTime menuTime = LocalTime.parse(
                                text.trim().toUpperCase(),
                                DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH)
                        );

                        LocalDate today = LocalDate.now(zone);

                        ZonedDateTime expiryZdt = ZonedDateTime.of(today, menuTime, zone);

                        if (expiryZdt.toInstant().isBefore(Instant.now())) {
                            expiryZdt = expiryZdt.plusDays(1);
                        }

                        if (expiryZdt.toInstant().isBefore(Instant.now())) {

                            wap.sendText(
                                    phone,
                                    "❌ Invalid time. Please enter a valid serving time."
                            );

                            return;
                        }
                        menuExpiry = expiryZdt.toInstant();
                        menu_session.setTime(text);
                        menu_session.setCurrent_status("COMPLETED");

                        menusessionRepo.save(menu_session);

                        MenuStore store = new MenuStore();
                        store.setMenu(menu_session.getMessage());
                        store.setPrice(menu_session.getPrice());
                        store.setLimit(menu_session.getLimit());
                        store.setTime_limit(menu_session.getTime());
                        store.setExpiresAt(menuExpiry);
                        store.setOrerCount(0);
                        store.setPhone(phone);
                        store.setRestaurant(res);

                        menuStoreRepository.save(store);

                        menusessionRepo.delete(menu_session);

                        wap.sendText(phone, "✅ Menu setup completed");

                    } catch (Exception e) {

                        wap.sendText(phone, "❌ Invalid time format");
                        return;

                    }

                    break;

                case "COMPLETED":

                    wap.sendText(phone, "ℹ Menu already configured. Type RESET to reconfigure.");
                    break;

                default:

                    wap.sendText(phone, "❓ Unknown state. Type RESET.");

            }
        }
    }

    public List<String> fetchcity() {

        List<Restaurant> cities = restaurantRepository.findAll();

        List<String> citiesName = new ArrayList<>();
        HashSet<String> citiesSet = new HashSet<>();

        for (Restaurant restaurant : cities) {
            if (!citiesSet.contains(restaurant.getCity())) {
                citiesName.add(restaurant.getCity());
                citiesSet.add(restaurant.getCity());
            }
        }
        return citiesName;
    }
}