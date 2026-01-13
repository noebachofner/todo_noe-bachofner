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
- Neues NestJS Projekt aufsetzen.
- User & Auth von bestehendem Projekt auf das neue Projekt migrieren.
- .env Datei anpassen, vorbereiten
- Globaler Prefix /api setzten
- Swagger konfigurieren (/docs) und mit persönlichen Daten erweitern.
- Logging Middleware/Interceptor migrieren.
- Commit 2: "Initial setup mit Auth/User Migration"

## 2. Datenbank Todo-Entity und Seed-Daten (Zeit ca 1.5h)
- SQLite3 Connection anpassen zu data/todo.db
- TODO Entity erstellen(id, user_id, title, description, isClosed, timestamps)
- Relation zu User Entity hinzufügen
- Seed-Service: 2 User (admin/user) und 4 TODOs beim Start anlegen
- User-Entity anpassen falls nötig (isAdmin-Field)
- Testen ob Datenbank korrekt angelegt wird.

## 3. TODO CRUD Implementation (Zeit ca 2.5h)
- TODO Module, Controller, Service erstellen
- DTOs: CreateTodoDto, UpdateTodoAdminDto, ReturnTodoDto mit Validierungen
- POST /api/todo Todo erstellen (authenticated user)
- GET /api/todo Liste(User: nur eigene + isClosed=false, Admin: alle)
- GET /api/todo/:id Einzelne Todos (Berechtigungsprüfung)
- PATCH /api/todo/:id Update (User: nur eigene + nur isClosed auf true, Admin: alles)
- DELETE /api/todo:id Löschen (nur Admins)
- Commit 3: "ToDo CRUD endpoints implementiert"

## 4. Validierung, Swagger & Postman Test (Zeit ca 2h)
- Alle Validierungen prüfen (title 8-50 Zeichen, description optional)
- Swagger Decorators für alle Todo-Endpoints (@ApiOperation, @ApiResponse)
- Alle DTOs mit @ApiProperty und Beispielwerten versehen
- HTTP Status-Codes prüfen (200, 201, 400, 401, 403, 404, 409)
- Postman Collection importieren und durchlaufen lassen
- Fehler beheben bis alle Tests grün sind

## Unit Tests und Finalisierung (Zeit ca 1h)
- Unit Tests für TodoService schreiben (100% Coverage)
- Falls Zeit: Unit-Tests für AuthService und PasswordService
- pnpm run format && pnpm run lint
- pnpm run test: cov - Coverage prüfen
- pnpm run build
- Fazit ins README.md schreiben (Was gut, was schwierig)
- Zippen ohne node_modules, Ohne dist, mit .git)


## Persönliches Fazit


