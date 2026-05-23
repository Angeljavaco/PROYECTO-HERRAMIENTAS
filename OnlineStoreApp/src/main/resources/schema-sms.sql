ALTER TABLE users
ADD phone VARCHAR(20) NOT NULL;

CREATE TABLE sms_notifications (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL,
  provider VARCHAR(30) NOT NULL DEFAULT 'TWILIO',
  provider_id VARCHAR(80),
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP NULL
);
