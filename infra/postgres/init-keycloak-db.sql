-- Keycloak keeps its own database next to the application's.
-- Runs once, on first boot of an empty postgres volume.
CREATE DATABASE keycloak OWNER docs;
