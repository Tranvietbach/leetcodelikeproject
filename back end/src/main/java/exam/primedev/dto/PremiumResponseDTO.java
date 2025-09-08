package exam.primedev.dto;

import exam.primedev.entity.Premium;

public class PremiumResponseDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer durationDays;
    private String createdAt; // dùng String thay vì LocalDateTime
    private boolean bought;

    public PremiumResponseDTO(Premium premium, boolean bought) {
        this.id = premium.getId();
        this.name = premium.getName();
        this.description = premium.getDescription();
        this.price = premium.getPrice();
        this.durationDays = premium.getDurationDays();
        this.createdAt = premium.getCreatedAt() != null
            ? premium.getCreatedAt().toString() // Hoặc format theo ý muốn
            : null;
        this.bought = bought;
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public Integer getDurationDays() { return durationDays; }
    public String getCreatedAt() { return createdAt; }
    public boolean isBought() { return bought; }
}
