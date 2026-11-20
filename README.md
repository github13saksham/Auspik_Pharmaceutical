
# Auspik Pharmaceuticals

## Website analytics

The public website records anonymous page paths and live-session heartbeats in the
`analyticsPageViews` and `analyticsActiveSessions` Firestore collections. Tracking
starts only after a visitor accepts analytics consent. The admin Analytics tab
updates from Firestore snapshots, counts visitors active within the last 90
seconds, and charts up to the latest 500 page-view events.

Deploy the updated `firestore.rules` to the Firebase project before using the
dashboard. Analytics data is readable only by the authorized admin account.
