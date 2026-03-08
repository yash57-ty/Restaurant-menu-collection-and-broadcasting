package org.example.backendi.repo;

import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.example.backendi.model.MenuStore;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface MenuStoreRepository extends JpaRepository<MenuStore,Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({
            @QueryHint(name = "jakarta.persistence.lock.timeout", value = "3000")
    })
    @Query("SELECT m FROM MenuStore m WHERE m.id = :id")
    Optional<MenuStore> findForUpdate(@Param("id") Long id);
    Optional<MenuStore> findByPhone(String phone);
    @Query("""
       SELECT m FROM MenuStore m
       WHERE m.expiresAt > CURRENT_TIMESTAMP
       AND m.OrerCount < m.limit
       AND (:city IS NULL OR LOWER(m.restaurant.City) = LOWER(:city))
       """)
    List<MenuStore> findActiveMenus(@Param("city") String city);
    @Query("""
       SELECT m FROM MenuStore m
       WHERE m.phone = :phone
       AND m.expiresAt > CURRENT_TIMESTAMP
       """)
    MenuStore findActiveMenusbyphone(@Param("phone") String phone);
    @Query("""
SELECT m FROM MenuStore m
WHERE m.expiresAt > CURRENT_TIMESTAMP
AND m.OrerCount < m.limit
AND (
    LOWER(m.menu) LIKE LOWER(CONCAT('%', :keyword, '%'))
    OR LOWER(m.restaurant.RestaurantName) LIKE LOWER(CONCAT('%', :keyword, '%')) 
)
""")
    List<MenuStore> searchActiveMenus(@Param("keyword") String keyword);
        @Modifying
        @Query("""
        UPDATE MenuStore m
        SET m.OrerCount = m.OrerCount + :qty
        WHERE m.id = :id
        AND m.OrerCount + :qty <= m.limit
    """)
        int increaseOrderCountIfAvailable(
                @Param("id") Long id,
                @Param("qty") int qty
        );
}