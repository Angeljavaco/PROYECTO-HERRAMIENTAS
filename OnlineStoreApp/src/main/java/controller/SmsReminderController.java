package controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.SmsReminder;
import repository.SmsLogRepository;
import service.TwilioSmsService;
import service.TwilioSmsService.TwilioResult;

public class SmsReminderController extends HttpServlet {
    private static final Pattern PHONE_PATTERN = Pattern.compile("^\\+[1-9]\\d{7,14}$");
    private final SmsLogRepository repository = new SmsLogRepository();
    private final TwilioSmsService smsService = new TwilioSmsService();

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        applyCors(response);
        response.setStatus(HttpServletResponse.SC_NO_CONTENT);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        applyCors(response);
        response.setContentType("application/json;charset=UTF-8");

        String body = readBody(request);
        String orderId = readJsonValue(body, "orderId");
        String customerName = readJsonValue(body, "customerName");
        String phone = readJsonValue(body, "phone");
        String message = readJsonValue(body, "message");

        if (isBlank(orderId) || isBlank(customerName) || isBlank(phone) || isBlank(message)) {
            writeError(response, HttpServletResponse.SC_BAD_REQUEST, "orderId, customerName, phone y message son obligatorios");
            return;
        }

        if (!PHONE_PATTERN.matcher(phone).matches()) {
            writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El telefono debe usar formato internacional E.164, por ejemplo +51987654321");
            return;
        }

        TwilioResult result = smsService.send(phone, message);
        System.out.println("[SmsReminderController] Resultado SMS pedido " + orderId
                + " status=" + result.getStatus()
                + " httpStatus=" + result.getHttpStatus()
                + " providerCode=" + result.getProviderErrorCode());

        SmsReminder reminder = new SmsReminder(
                UUID.randomUUID().toString(),
                orderId,
                customerName,
                phone,
                message,
                result.getStatus(),
                result.getProviderId(),
                result.getErrorMessage(),
                LocalDateTime.now()
        );

        repository.save(reminder);

        int statusCode = httpStatusFor(result);
        response.setStatus(statusCode);
        response.getWriter().write(toJson(reminder));
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        applyCors(response);
        response.setContentType("application/json;charset=UTF-8");

        List<SmsReminder> reminders = repository.findAll();
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < reminders.size(); i++) {
            if (i > 0) json.append(",");
            json.append(toJson(reminders.get(i)));
        }
        json.append("]");

        response.getWriter().write(json.toString());
    }

    private static void applyCors(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
    }

    private static String readBody(HttpServletRequest request) throws IOException {
        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }

    private static String readJsonValue(String json, String field) {
        String pattern = "\"" + field + "\":";
        int start = json.indexOf(pattern);
        if (start < 0) return "";

        int valueStart = start + pattern.length();
        while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
            valueStart++;
        }

        if (valueStart < json.length() && json.charAt(valueStart) == '"') {
            int valueEnd = json.indexOf("\"", valueStart + 1);
            return valueEnd > valueStart ? json.substring(valueStart + 1, valueEnd) : "";
        }

        int valueEnd = valueStart;
        while (valueEnd < json.length() && ",}".indexOf(json.charAt(valueEnd)) == -1) {
            valueEnd++;
        }
        return json.substring(valueStart, valueEnd).trim();
    }

    private static void writeError(HttpServletResponse response, int statusCode, String message)
            throws IOException {
        response.setStatus(statusCode);
        response.getWriter().write("{\"error\":\"" + escape(message) + "\"}");
    }

    private static int httpStatusFor(TwilioResult result) {
        if ("SENT".equals(result.getStatus())) return HttpServletResponse.SC_ACCEPTED;
        if ("CONFIGURATION_ERROR".equals(result.getStatus())) return HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
        if ("UNAUTHORIZED".equals(result.getStatus()) || "INVALID_CREDENTIALS".equals(result.getStatus())) {
            return HttpServletResponse.SC_UNAUTHORIZED;
        }
        if ("UNVERIFIED_NUMBER".equals(result.getStatus())
                || "INVALID_TO_NUMBER".equals(result.getStatus())
                || "INVALID_FROM_NUMBER".equals(result.getStatus())) {
            return HttpServletResponse.SC_BAD_REQUEST;
        }
        if ("TIMEOUT".equals(result.getStatus())) return HttpServletResponse.SC_GATEWAY_TIMEOUT;
        return HttpServletResponse.SC_BAD_GATEWAY;
    }

    private static String toJson(SmsReminder reminder) {
        return "{"
                + "\"id\":\"" + escape(reminder.getId()) + "\","
                + "\"orderId\":\"" + escape(reminder.getOrderId()) + "\","
                + "\"customerName\":\"" + escape(reminder.getCustomerName()) + "\","
                + "\"phone\":\"" + escape(reminder.getPhone()) + "\","
                + "\"status\":\"" + escape(reminder.getStatus()) + "\","
                + "\"providerId\":\"" + escape(reminder.getProviderId()) + "\","
                + "\"error\":\"" + escape(reminder.getErrorMessage()) + "\","
                + "\"message\":\"" + ("SENT".equals(reminder.getStatus()) ? "SMS enviado correctamente" : escape(reminder.getErrorMessage())) + "\","
                + "\"createdAt\":\"" + reminder.getCreatedAt() + "\""
                + "}";
    }

    private static String escape(String value) {
        if (value == null) return "";
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
