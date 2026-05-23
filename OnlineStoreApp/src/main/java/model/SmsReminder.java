package model;

import java.time.LocalDateTime;

public class SmsReminder {
    private final String id;
    private final String orderId;
    private final String customerName;
    private final String phone;
    private final String message;
    private final String status;
    private final String providerId;
    private final String errorMessage;
    private final LocalDateTime createdAt;

    public SmsReminder(
            String id,
            String orderId,
            String customerName,
            String phone,
            String message,
            String status,
            String providerId,
            String errorMessage,
            LocalDateTime createdAt) {
        this.id = id;
        this.orderId = orderId;
        this.customerName = customerName;
        this.phone = phone;
        this.message = message;
        this.status = status;
        this.providerId = providerId;
        this.errorMessage = errorMessage;
        this.createdAt = createdAt;
    }

    public String getId() {
        return id;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getPhone() {
        return phone;
    }

    public String getMessage() {
        return message;
    }

    public String getStatus() {
        return status;
    }

    public String getProviderId() {
        return providerId;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
