package org.example.backendi.service;

import jakarta.transaction.Transactional;
import org.example.backendi.model.MenuStore;
import org.example.backendi.model.Order;
import org.example.backendi.model.User;
import org.example.backendi.model.dto.OrderResponse;
import org.example.backendi.model.dto.orderRequest;
import org.example.backendi.repo.MenuStoreRepository;
import org.example.backendi.repo.UserRepository;
import org.example.backendi.repo.orderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class orderService {

    @Autowired
    private orderRepo orderRepo;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WhatsappClient wap;

    @Autowired
    private MenuStoreRepository menuStoreRepository;


    @Transactional
    public OrderResponse fetchorder(orderRequest request, String userPhone) {

        if (request.quantity() <= 0) {
            throw new IllegalArgumentException("Invalid quantity");
        }

        User user = userRepository.findByPhone(userPhone);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        int updated = menuStoreRepository
                .increaseOrderCountIfAvailable(
                        request.menuId(),
                        request.quantity()
                );

        if (updated == 0) {
            throw new IllegalStateException("Orders are full");
        }

        MenuStore menuStore = menuStoreRepository
                .findById(request.menuId())
                .orElseThrow();


        Order order = new Order();
        order.setUser(user);
        order.setMenuStore(menuStore);
        order.setAddress(request.address());
        order.setQuantity(request.quantity());
        order.setStatus("CONFIRMED");

        orderRepo.save(order);

        String to = menuStore.getPhone();
        if (!to.startsWith("+")) {
            to = "+" + to;
        }

        wap.sendOrderMessage(
                order.getId(),
                to,
                user.getName(),
                user.getPhone(),
                request.address(),
                menuStore.getOrerCount(),
                request.quantity()
        );

        return new OrderResponse(
                order.getId(),
                menuStore.getRestaurant().getRestaurantName(),
                request.quantity(),
                menuStore.getPrice(),
                request.quantity() * menuStore.getPrice(),
                order.getCreatedAt()
        );
    }


    public List<OrderResponse> getOrdersByUser(String userPhone) {

        User user = userRepository.findByPhone(userPhone);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<Order> orders = orderRepo.findByUser(user);

        return orders.stream()
                .map(order -> new OrderResponse(
                        order.getId(),
                        order.getMenuStore().getRestaurant().getRestaurantName(),
                        order.getQuantity(),
                        order.getMenuStore().getPrice(),
                        order.getQuantity() * order.getMenuStore().getPrice(),
                        order.getCreatedAt()
                ))
                .toList();
    }

    @Transactional
    public String cancelOrder(Long orderId, int cancelQty, String phone){

        Order order = orderRepo.findById(orderId).orElse(null);

        if(order == null){
            throw new RuntimeException("Order not found");
        }

        User user = userRepository.findByPhone(phone);
        if(!order.getUser().getPhone().equals(phone)){
            throw new RuntimeException("Unauthorized request");
        }

        MenuStore menu = order.getMenuStore();
        if(menu.getExpiresAt().isBefore(Instant.now())){
            throw new RuntimeException("Menu expired. Cancellation not allowed.");
        }

        if(cancelQty <= 0){
            throw new RuntimeException("Invalid cancel quantity");
        }

        if(cancelQty > order.getQuantity()){
            throw new RuntimeException("Cannot cancel more than ordered quantity");
        }
        String to = menu.getPhone();
        if (!to.startsWith("+")) {
            to = "+" + to;
        }

        int remainingQty = order.getQuantity() - cancelQty;
        int orderQty = menu.getOrerCount();
        int remain=orderQty-cancelQty;
        menu.setOrerCount(remain);
        menuStoreRepository.save(menu);
        if(remainingQty == 0){
            order.setQuantity(0);
            order.setStatus("CANCELLED");
            orderRepo.save(order);
            wap.cancelOrderMessage(
                    order.getId(),
                    to,
                    user.getName(),
                    user.getPhone(),
                    order.getAddress(),
                    cancelQty,
                    remain
            );
            return "Order fully cancelled";
        }

        order.setQuantity(remainingQty);
        order.setStatus("PARTIALLY_CANCELLED");
        orderRepo.save(order);


        wap.cancelOrderMessage(
                order.getId(),
                to,
                user.getName(),
                user.getPhone(),
                order.getAddress(),
                cancelQty,
                remain
        );
        return "Order partially cancelled";
    }

}