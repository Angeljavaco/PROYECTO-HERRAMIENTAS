package repository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import model.SmsReminder;

public class SmsLogRepository {
    private static final List<SmsReminder> SMS_LOGS = Collections.synchronizedList(new ArrayList<SmsReminder>());

    public void save(SmsReminder reminder) {
        SMS_LOGS.add(reminder);
    }

    public List<SmsReminder> findAll() {
        synchronized (SMS_LOGS) {
            return new ArrayList<SmsReminder>(SMS_LOGS);
        }
    }
}
