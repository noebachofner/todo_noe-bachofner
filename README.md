# TODO-Planer_noe-bachofner
|Projektname  | Author |
|--|--|
| TODO-Planer | Noé Bachofner |

## Planung
### Auftragstellung
> Erstelle eine REST-API, die durch JWT geschützt ist und folgende Endpunkte zur Verfügung stellt:
>* CRUD-Endpunkte (Create, Read, Update, Delete) für die Verwaltung von TODO-Items
>* Endpunkte für das Anmelden, Anlegen von Benutzern und das Zurückgeben des
   Benutzerprofils
>* Verwaltung von Benutzern.
   Beim Zugriff auf die Endpunkte sollen die korrekten HTTP-Statuscodes zurückgegeben werden.
   >Die wichtigsten Endpunkte wo benötigt werden siehst du im Entsprechende Dokument pro
   Endpunkt.
   Für den Bereich Todo gilt:
>- Anlegen von TODO-Items für einen angemeldeten Benutzer
>- Liste von TODO-Items zurückgeben. Wenn der Benuzter isAdmin = true ist, dann werden
   alle Items zurückgegeben, und zwar egal wie der Status isClosed ist.
>- Einzelnes TODO-Item zurückgeben. User bekommen nur ihre eigenen Daten zurück,
   wenn sie isClosed = false sind. Admins können auf alles Items zugreifen.
>- Status eines TODO-Items ändern. User können nur ihre eigenen Daten verändern, und
   zwar isClosed auf true gesetzt. Admin können alle Daten ändern, und zwar isClosed true
   oder false setzen
>- TODO-Item löschen. User können keine Daten löschen. Administratoren können Daten
   löschen
   >Die Aufrufe werden mit LOG-Einträgen auf dem Server nachvollziehbar angezeigt. Du
   >verwendest dazu entweder eine Middleware oder einen Interceptor, und gibst für jeden Aufruf
   >die Informationen IP, METHODE, URL und Correlation-ID aus. Jede Methode hat einen LOG-
   >Eintrag welcher klar aufzeigt, was in die Methode übergeben wird und was das Resultat ist,
   welches zurückgegeben wird.
   >Für das Projekt verwendest du ein lokales GIT. Du kannst auch ein >Repository auf gitlab.com,
   >github.com etc. anlegen, dies ist aber nicht Teil der Aufgabe. Für die Abgabe benötigst du
   >nachweisliche mindestens 2 Commit-Meldungen im lokalen GIT Repository >und schreibe in der
   >Commit-Meldung auf, was du im Commit gemacht hast.
   >text

## 1. Schritt Projekt Setup (Zeit ca 1h)
**Geplant:  1h | IST:  1.5h**

- Neues NestJS Projekt aufsetzen. 
- User & Auth von bestehendem Projekt auf das neue Projekt migrieren.
- . env Datei anpassen, vorbereiten
- Globaler Prefix /api setzen
- Swagger konfigurieren (/docs) und mit persönlichen Daten erweitern. 
- Logging Middleware/Interceptor migrieren. 
- `informations/` Struktur für Swagger-Config erstellt
- YAML-Export für OpenAPI-Spec hinzugefügt
- **Commit:** "Initial setup mit Auth/User Migration und Swagger"

**Abweichung:** +0.5h durch Swagger-Erweiterungen (JSON/YAML-Export, `informations/` Struktur)

---

## 2. Datenbank Todo-Entity und Seed-Daten (Zeit ca 1. 5h)
**Geplant: 1.5h | IST: 1h**

- SQLite3 Connection anpassen zu data/todo.db
- TODO Entity erstellen (id, user_id, title, description, isClosed, timestamps)
- Relation zu User Entity hinzufügen
- Seed-Service:  2 User (admin/user) und 4 TODOs beim Start anlegen
- User-Entity anpassen (isAdmin-Field bereits vorhanden)
- Testen ob Datenbank korrekt angelegt wird. 
- **Commit:** "Todo-Entity und Seed-Daten implementiert"

**Abweichung:** -0.5h, da User-Entity bereits vollständig vorhanden war

---

## 3. TODO CRUD Implementation (Zeit ca 2. 5h)
**Geplant: 2.5h | IST: 3h**

- TODO Module, Controller, Service erstellen
- DTOs:  CreateTodoDto, UpdateTodoAdminDto, UpdateTodoDto, ReturnTodoDto mit Validierungen
- POST /api/todo - Todo erstellen (authenticated user)
- GET /api/todo - Liste (User:  nur eigene + isClosed=false, Admin: alle)
- GET /api/todo/:id - Einzelne Todos (Berechtigungsprüfung)
- PATCH /api/todo/:id - Update (User: nur eigene + nur isClosed auf true, Admin: alles)
- DELETE /api/todo/:id - Löschen (nur Admins)
- Guards für JWT-Auth und Admin-Rechte implementiert
- **Commit:** "Todo CRUD endpoints implementiert"

**Abweichung:** +0.5h durch komplexe Berechtigungslogik (User vs.  Admin, isClosed-Validierung)

---

## 4. Validierung, Swagger & Postman Test (Zeit ca 2h)
**Geplant: 2h | IST:  1. 5h**

- Alle Validierungen prüfen (title 8-50 Zeichen, description optional)
- Swagger Decorators für alle Todo-Endpoints (@ApiOperation, @ApiResponse)
- Alle DTOs mit @ApiProperty und Beispielwerten versehen
- HTTP Status-Codes prüfen (200, 201, 400, 401, 403, 404, 409)
- Manuelle Tests mit Swagger UI durchgeführt
- Fehler beheben bis alle Endpoints korrekt funktionieren
- **Commit:** "Validierungen und Swagger-Dokumentation vervollständigt"

**Abweichung:** -0.5h, da Swagger bereits im Setup gut vorbereitet wurde

---

## 5. Unit Tests und Finalisierung (Zeit ca 1h)
**Geplant: 1h | IST: 2. 5h**

- Unit Tests für TodoService schreiben (100% Coverage)
- Unit-Tests für UserService (100% Coverage)
- Unit-Tests für PasswordService (100% Coverage)
- Coverage-Konfiguration in `package.json` angepasst
- Edge Cases für Branch Coverage identifiziert und getestet
- `pnpm run format` ausgeführt
- `pnpm run lint` ausgeführt und Fehler behoben
- `pnpm run test:cov` - **100% Statement, Branch, Function & Line Coverage erreicht**
- `pnpm run build` erfolgreich
- README.md mit Fazit aktualisiert
- **Commit:** "Unit Tests mit 100% Coverage und finale Dokumentation"

**Abweichung:** +1. 5h durch aufwändige Branch-Coverage-Optimierung (insbesondere Berechtigungslogik in `findOne` und `update`)

---

## Persönliches Fazit

### Overview
Während des ganzen Prüfung liefen sehr viele dinge sehr gut. Ich konnte sehr viele Aufgaben schnell ab arbeiten
und hatte daher auch nicht wirklich einen Zeit stress.

### Was nicht gut lief / herausfordernd war
- Branch Coverage mit 100% war nicht erreichbar, grund leider umbekannt.
- Die Berechtigungslogik (Admin vs.  User, isClosed-Kombinationen) erforderte viele Edge-Case-Tests

### Was besonders gut lief
- TypeORM Integration und Entity-Relations (User ↔ Todo) funktionierten reibungslos
- JWT-Authentifizierung mit Guards war schnell implementiert
- Migration von User & Auth aus bestehendem Projekt sparte viel Zeit
- Swagger-Dokumentation mit JSON/YAML-Export ist vollständig und professionell
- 100% Test Coverage für alle Services erreicht (Statement, Function, Line)
- Logging mit Interceptor und Correlation-IDs macht Debugging sehr einfach
