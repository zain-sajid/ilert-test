enum UserRole {
  ADMIN = 'ADMIN'
}

enum NotificationMethod {
  EMAIL = 'EMAIL',
  SMS = 'SMS'
}

interface PhoneNumber {
  regionCode: string;
  number: string;
}

interface NotificationPreference {
  delay: number;
  method: NotificationMethod;
}

interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile: PhoneNumber;
  landline: PhoneNumber;
  timezone: string;
  language: string;
  region: string;
  role: UserRole;
  position: string;
  department: string;
  createdAt: string;
  updatedAt: string;
  notificationPreferences: NotificationPreference[];
  lowPriorityNotificationPreferences: NotificationPreference[];
  onCallNotificationPreferences: NotificationPreference[];
  subscriptionNotificationTypes: NotificationMethod[];
  subscribedIncidentUpdateStates: string[];
  subscribedAlertUpdateStates: string[];
  subscribedIncidentUpdateNotificationTypes: string[];
  subscribedAlertUpdateNotificationTypes: string[];
  teamContext: number;
}
