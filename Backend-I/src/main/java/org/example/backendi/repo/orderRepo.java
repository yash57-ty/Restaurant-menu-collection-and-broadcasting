package org.example.backendi.repo;

import org.example.backendi.model.MenuStore;
import org.example.backendi.model.Order;
import org.example.backendi.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface orderRepo extends JpaRepository<Order,Long>{
    boolean existsByUserAndMenuStore(User user, MenuStore menuStore);
    List<Order> findByUser(User user);
    List<Order> findByMenuStore(MenuStore menuStore);
}
