package config;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

public class TwilioConfig {
    private static final String ACCOUNT_SID = "TWILIO_ACCOUNT_SID";
    private static final String AUTH_TOKEN = "TWILIO_AUTH_TOKEN";
    private static final String PHONE_NUMBER = "TWILIO_PHONE_NUMBER";

    private final String accountSid;
    private final String authToken;
    private final String phoneNumber;
    private final String source;

    private TwilioConfig(String accountSid, String authToken, String phoneNumber, String source) {
        this.accountSid = clean(accountSid);
        this.authToken = clean(authToken);
        this.phoneNumber = clean(phoneNumber);
        this.source = source;
    }

    public static TwilioConfig load() {
        TwilioConfig envConfig = fromSystemEnvironment();
        TwilioConfig propertyConfig = fromJavaProperties();
        TwilioConfig fileConfig = fromFiles();

        TwilioConfig mergedConfig = new TwilioConfig(
                firstPresent(envConfig.accountSid, propertyConfig.accountSid, fileConfig.accountSid),
                firstPresent(envConfig.authToken, propertyConfig.authToken, fileConfig.authToken),
                firstPresent(envConfig.phoneNumber, propertyConfig.phoneNumber, fileConfig.phoneNumber),
                "fusion: System.getenv() -> System.getProperty() -> " + fileConfig.source
        );

        mergedConfig.logState();
        return mergedConfig;
    }

    public String getAccountSid() {
        return accountSid;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public boolean isComplete() {
        return !isBlank(accountSid) && !isBlank(authToken) && !isBlank(phoneNumber);
    }

    public String missingVariables() {
        StringBuilder missing = new StringBuilder();
        appendMissing(missing, ACCOUNT_SID, accountSid);
        appendMissing(missing, AUTH_TOKEN, authToken);
        appendMissing(missing, PHONE_NUMBER, phoneNumber);
        return missing.length() == 0 ? "ninguna" : missing.toString();
    }

    public void logState() {
        System.out.println("[TwilioConfig] Fuente usada: " + source);
        System.out.println("[TwilioConfig] " + ACCOUNT_SID + " existe: " + !isBlank(accountSid) + " valor: " + mask(accountSid));
        System.out.println("[TwilioConfig] " + AUTH_TOKEN + " existe: " + !isBlank(authToken) + " valor: " + mask(authToken));
        System.out.println("[TwilioConfig] " + PHONE_NUMBER + " existe: " + !isBlank(phoneNumber) + " valor: " + mask(phoneNumber));
        System.out.println("[TwilioConfig] Twilio inicializado: " + isComplete());
        if (!isComplete()) {
            System.out.println("[TwilioConfig] Faltan variables: " + missingVariables());
        }
    }

    private static TwilioConfig fromSystemEnvironment() {
        return new TwilioConfig(
                System.getenv(ACCOUNT_SID),
                System.getenv(AUTH_TOKEN),
                System.getenv(PHONE_NUMBER),
                "System.getenv()"
        );
    }

    private static TwilioConfig fromJavaProperties() {
        return new TwilioConfig(
                System.getProperty(ACCOUNT_SID),
                System.getProperty(AUTH_TOKEN),
                System.getProperty(PHONE_NUMBER),
                "System.getProperty()"
        );
    }

    private static TwilioConfig fromFiles() {
        Properties properties = new Properties();
        String source = "sin archivo de configuracion";

        for (String path : candidatePaths()) {
            File file = new File(path);
            if (!file.isFile()) continue;

            try (InputStream inputStream = new FileInputStream(file)) {
                loadByExtension(properties, inputStream, file.getName());
                source = file.getAbsolutePath();
                break;
            } catch (IOException ex) {
                System.out.println("[TwilioConfig] No se pudo leer " + file.getAbsolutePath() + ": " + ex.getMessage());
            }
        }

        if (properties.isEmpty()) {
            try (InputStream inputStream = TwilioConfig.class.getClassLoader().getResourceAsStream("config.properties")) {
                if (inputStream != null) {
                    properties.load(inputStream);
                    source = "classpath:config.properties";
                }
            } catch (IOException ex) {
                System.out.println("[TwilioConfig] No se pudo leer classpath:config.properties: " + ex.getMessage());
            }
        }

        return new TwilioConfig(
                property(properties, ACCOUNT_SID),
                property(properties, AUTH_TOKEN),
                property(properties, PHONE_NUMBER),
                source
        );
    }

    private static List<String> candidatePaths() {
        String catalinaBase = System.getProperty("catalina.base", "");
        String userDir = System.getProperty("user.dir", "");
        String configuredPath = System.getProperty("TIENDAONLINE_CONFIG", "");

        return Arrays.asList(
                configuredPath,
                userDir + File.separator + ".env",
                userDir + File.separator + "config.properties",
                catalinaBase + File.separator + "conf" + File.separator + "tiendaonline.env",
                catalinaBase + File.separator + "conf" + File.separator + "tiendaonline.properties",
                catalinaBase + File.separator + "conf" + File.separator + "config.properties"
        );
    }

    private static void loadByExtension(Properties properties, InputStream inputStream, String fileName) throws IOException {
        if (fileName.endsWith(".env")) {
            Properties envProperties = new Properties();
            envProperties.load(inputStream);
            properties.putAll(envProperties);
            return;
        }

        properties.load(inputStream);
    }

    private static String property(Properties properties, String key) {
        return properties.getProperty(key, properties.getProperty(key.toLowerCase(), ""));
    }

    private static String firstPresent(String... values) {
        for (String value : values) {
            if (!isBlank(value)) return value;
        }
        return "";
    }

    private static void appendMissing(StringBuilder builder, String key, String value) {
        if (!isBlank(value)) return;
        if (builder.length() > 0) builder.append(", ");
        builder.append(key);
    }

    private static String clean(String value) {
        if (value == null) return "";
        return value.trim().replace("\"", "");
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static String mask(String value) {
        if (isBlank(value)) return "(vacio)";
        String cleanValue = clean(value);
        if (cleanValue.length() <= 8) return "****";
        return cleanValue.substring(0, 4) + "****" + cleanValue.substring(cleanValue.length() - 4);
    }
}
