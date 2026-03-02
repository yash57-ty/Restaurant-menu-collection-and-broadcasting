package org.example.backendi.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.example.backendi.model.MenuStore;
import org.example.backendi.model.Menu_session;
import org.example.backendi.model.Restaurant;
import org.example.backendi.repo.MenuStoreRepository;
import org.example.backendi.repo.MenusessionRepo;
import org.example.backendi.repo.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuStoreRepository menuStoreRepository;

    @Autowired
    private WhatsappClient wap;

    @Autowired
    private MenusessionRepo menusessionRepo;

    @Autowired
    private TranslationService translationService;

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
            Menu_session menu_session =
                    menusessionRepo.findByPhoneNo(phone);

            if (menu_session!=null && (text.equalsIgnoreCase("RESET") || text.equalsIgnoreCase("CANCEL"))) {
                menusessionRepo.delete(menu_session);
                wap.sendText(phone, "🔁 Session cancelled. Start again.");
                return;
            }

            if (menu_session != null &&
                    menu_session.getExpiresAt().isBefore(Instant.now())) {
                menusessionRepo.delete(menu_session);
                wap.sendText(phone, "⏳ Session expired. Please start again and send 'RESET'");
                return;
            }

            if (menu_session == null) {
                menu_session = new Menu_session();
                menu_session.setPhoneNo(phone);
                menu_session.setCreatedAt(Instant.now());
                menu_session.setExpiresAt(Instant.now().plus(1, ChronoUnit.MINUTES));
                menu_session.setCurrent_status("WAITING_MENU");
                menu_session.setUser_status("ACTIVE");
                menusessionRepo.save(menu_session);
                wap.sendText(phone, "📋 Please enter menu ");
                return;
            }

            switch (menu_session.getCurrent_status()) {

                case "WAITING_MENU":
                    menu_session.setMessage(text);
                    menu_session.setCurrent_status("WAITING_PRICE");
                    //refreshSession(menu_session);
                    menusessionRepo.save(menu_session);
                    wap.sendText(phone, "💰 Please enter price");
                    break;

                case "WAITING_PRICE":
                    try {
                        menu_session.setPrice(Integer.parseInt(text));
                        menu_session.setCurrent_status("WAITING_LIMIT");
                        //refreshSession(menu_session);
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
                        // refreshSession(menu_session);
                        menusessionRepo.save(menu_session);
                        wap.sendText(phone, "⏰ Enter time (e.g. 05:30 PM  and 11:30 AM)");
                    } catch (NumberFormatException e) {
                        wap.sendText(phone, "❌ Invalid limit");
                    }
                    break;

                case "WAITING_TIME":
                    Instant menuExpiry;
                    try {
//                        String s1 = text.substring(0, 2);
//                        String s2 = text.substring(2, 3);
//                        String s3 = text.substring(3, 5);
//                        String s4 = text.substring(5).trim();
//
//                        int h = Integer.parseInt(s1);
//                        int m = Integer.parseInt(s3);
//
//                        if (!s2.equals(":")) throw new Exception();
//                        if (h < 1 || h > 12) throw new Exception();
//                        if (m < 0 || m > 59) throw new Exception();
//                        if (!s4.equals("AM") && !s4.equals("PM")) throw new Exception();

                        ZoneId zone = ZoneId.of("Asia/Kolkata");

                        LocalTime menuTime = LocalTime.parse(
                                text.trim().toUpperCase(),
                                DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH)
                        );

                        LocalDate today = LocalDate.now(zone);

                        // Try TODAY first
                        ZonedDateTime expiryZdt = ZonedDateTime.of(today, menuTime, zone);

                        // If time already passed today → assume TOMORROW
                        if (expiryZdt.toInstant().isBefore(Instant.now())) {
                            expiryZdt = expiryZdt.plusDays(1);
                        }

                        // Final safety check (optional)
                        if (expiryZdt.toInstant().isBefore(Instant.now())) {
                            wap.sendText(
                                    phone,
                                    "❌ Invalid time. Please enter a valid serving time."
                            );
                            return;
                        }

                        menuExpiry = expiryZdt.toInstant();
                        String originalMenu = menu_session.getMessage();
                        String translatedMenu = translationService.translateGujaratiToEnglish(originalMenu);
                        menu_session.setTime(text);
                        //menu_session.setExpiresAtMenu(menuExpiry);
                        menu_session.setCurrent_status("COMPLETED");
                        // refreshSession(menu_session);
                        menusessionRepo.save(menu_session);
                        MenuStore store = new MenuStore();
                        store.setMenu(translatedMenu);
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
}