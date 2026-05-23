package service;

import config.TwilioConfig;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.SocketTimeoutException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TwilioSmsService {
    private static final String TWILIO_URL = "https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json";
    private static final int CONNECT_TIMEOUT_MS = 10000;
    private static final int READ_TIMEOUT_MS = 15000;
    private static final Pattern JSON_STRING_FIELD = Pattern.compile("\"%s\"\\s*:\\s*\"([^\"]*)\"");
    private static final Pattern JSON_NUMBER_FIELD = Pattern.compile("\"%s\"\\s*:\\s*(\\d+)");

    public TwilioResult send(String to, String message) {
        TwilioConfig config = TwilioConfig.load();

        if (!config.isComplete()) {
            return new TwilioResult(
                    "CONFIGURATION_ERROR",
                    "",
                    "Faltan variables Twilio: " + config.missingVariables(),
                    500,
                    ""
            );
        }

        System.out.println("[TwilioSmsService] Twilio inicializado correctamente. Enviando SMS a " + to);

        try {
            String form = "To=" + encode(to)
                    + "&From=" + encode(config.getPhoneNumber())
                    + "&Body=" + encode(message);

            URL url = URI.create(String.format(TWILIO_URL, config.getAccountSid())).toURL();
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("POST");
            connection.setConnectTimeout(CONNECT_TIMEOUT_MS);
            connection.setReadTimeout(READ_TIMEOUT_MS);
            connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
            connection.setRequestProperty("Authorization", basicAuth(config.getAccountSid(), config.getAuthToken()));

            byte[] body = form.getBytes(StandardCharsets.UTF_8);
            connection.setRequestProperty("Content-Length", String.valueOf(body.length));

            try (OutputStream outputStream = connection.getOutputStream()) {
                outputStream.write(body);
            }

            int statusCode = connection.getResponseCode();
            String responseBody = readResponse(statusCode >= 400 ? connection.getErrorStream() : connection.getInputStream());

            System.out.println("[TwilioSmsService] HTTP Twilio status: " + statusCode);
            System.out.println("[TwilioSmsService] Respuesta Twilio: " + truncate(responseBody));

            if (statusCode >= 200 && statusCode < 300) {
                return new TwilioResult("SENT", extractString(responseBody, "sid"), "", statusCode, "");
            }

            return mapTwilioError(statusCode, responseBody);
        } catch (SocketTimeoutException ex) {
            System.out.println("[TwilioSmsService] Timeout conectando con Twilio: " + ex.getMessage());
            return new TwilioResult("TIMEOUT", "", "Timeout conectando con Twilio", 504, "");
        } catch (IOException ex) {
            System.out.println("[TwilioSmsService] Error de conexion HTTPS con Twilio: " + ex.getMessage());
            return new TwilioResult("CONNECTION_ERROR", "", "Error de conexion HTTPS con Twilio: " + ex.getMessage(), 502, "");
        } catch (Exception ex) {
            System.out.println("[TwilioSmsService] Error inesperado al enviar SMS: " + ex.getMessage());
            return new TwilioResult("FAILED", "", "Error inesperado al enviar SMS: " + ex.getMessage(), 500, "");
        }
    }

    private static TwilioResult mapTwilioError(int statusCode, String responseBody) {
        String code = extractNumber(responseBody, "code");
        String message = extractString(responseBody, "message");
        if (message.isEmpty()) message = responseBody;

        if (statusCode == 401) {
            return new TwilioResult("UNAUTHORIZED", "", "401 Unauthorized: credenciales Twilio invalidas", statusCode, code);
        }

        if ("21608".equals(code)) {
            return new TwilioResult("UNVERIFIED_NUMBER", "", "Numero destino no verificado en Twilio Trial", statusCode, code);
        }

        if ("20003".equals(code)) {
            return new TwilioResult("INVALID_CREDENTIALS", "", "Credenciales Twilio invalidas o Account SID/Auth Token incorrectos", statusCode, code);
        }

        if ("21211".equals(code)) {
            return new TwilioResult("INVALID_TO_NUMBER", "", "Numero destino invalido para Twilio", statusCode, code);
        }

        if ("21212".equals(code) || "21606".equals(code)) {
            return new TwilioResult("INVALID_FROM_NUMBER", "", "TWILIO_PHONE_NUMBER no es un numero Twilio valido para enviar SMS", statusCode, code);
        }

        return new TwilioResult("FAILED", "", message, statusCode, code);
    }

    private static String basicAuth(String accountSid, String authToken) {
        String credentials = accountSid + ":" + authToken;
        return "Basic " + Base64.getEncoder().encodeToString(credentials.getBytes(StandardCharsets.UTF_8));
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private static String readResponse(InputStream stream) throws IOException {
        if (stream == null) return "";

        StringBuilder builder = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
        }
        return builder.toString();
    }

    private static String extractString(String json, String field) {
        Matcher matcher = Pattern.compile(String.format(JSON_STRING_FIELD.pattern(), field)).matcher(json);
        return matcher.find() ? matcher.group(1) : "";
    }

    private static String extractNumber(String json, String field) {
        Matcher matcher = Pattern.compile(String.format(JSON_NUMBER_FIELD.pattern(), field)).matcher(json);
        return matcher.find() ? matcher.group(1) : "";
    }

    private static String truncate(String text) {
        if (text == null) return "";
        return text.length() <= 600 ? text : text.substring(0, 600) + "...";
    }

    public static class TwilioResult {
        private final String status;
        private final String providerId;
        private final String errorMessage;
        private final int httpStatus;
        private final String providerErrorCode;

        public TwilioResult(String status, String providerId, String errorMessage, int httpStatus, String providerErrorCode) {
            this.status = status;
            this.providerId = providerId;
            this.errorMessage = errorMessage;
            this.httpStatus = httpStatus;
            this.providerErrorCode = providerErrorCode;
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

        public int getHttpStatus() {
            return httpStatus;
        }

        public String getProviderErrorCode() {
            return providerErrorCode;
        }
    }
}
