package com.restaurant.backend.dto;

public class VNPayCreateRequest {

    private String orderId;
    private long   amount;
    private String orderInfo;

    // Thông tin đặt bàn — lưu tạm để confirm sau khi VNPay return
    private String customerName;
    private String phone;
    private String email;
    private String reservationTime;  // format: "2024-05-10T19:00:00"
    private int    guestCount;
    private String tableId;

    // ── Getters & Setters ──
    public String getOrderId()          { return orderId; }
    public void setOrderId(String v)    { this.orderId = v; }

    public long getAmount()             { return amount; }
    public void setAmount(long v)       { this.amount = v; }

    public String getOrderInfo()        { return orderInfo; }
    public void setOrderInfo(String v)  { this.orderInfo = v; }

    public String getCustomerName()         { return customerName; }
    public void setCustomerName(String v)   { this.customerName = v; }

    public String getPhone()            { return phone; }
    public void setPhone(String v)      { this.phone = v; }

    public String getEmail()            { return email; }
    public void setEmail(String v)      { this.email = v; }

    public String getReservationTime()          { return reservationTime; }
    public void setReservationTime(String v)    { this.reservationTime = v; }

    public int getGuestCount()          { return guestCount; }
    public void setGuestCount(int v)    { this.guestCount = v; }

    public String getTableId()          { return tableId; }
    public void setTableId(String v)    { this.tableId = v; }
}
