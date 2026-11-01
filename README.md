# Bern Live Transit Board

## Projektübersicht

Das **Bern Live Transit Board** ist ein IoT-Projekt, das die geschätzten aktuellen Positionen von Trams und Bussen im öffentlichen Verkehrsnetz von Bern auf einer physischen LED-Platine visualisiert.

Die Platine zeigt verschiedene Haltestellen und Strecken des Berner Verkehrsnetzes. LEDs an den Haltestellen zeigen an, wo sich wahrscheinlich gerade ein Tram oder Bus befindet.

Ein **NestJS-Backend** soll dafür öffentliche Verkehrsdaten der Schweizer Open-Data-Plattform verarbeiten und die benötigten Informationen über eine REST-API bereitstellen.

> **Entwicklungsstand:** Aktuell ist das NestJS-Grundgerüst mit den Modulen, Services und dem Board-Controller vorhanden. Typdefinitionen, Konstanten und Haltestellenkonfiguration sind Platzhalter. Die nachfolgend beschriebenen Verkehrsdaten-Funktionen und REST-Endpunkte sind geplant und noch nicht implementiert.

## Ziel des Projekts

Das Ziel ist, die Bewegungen von Trams und Bussen möglichst aktuell und automatisch auf dem Board darzustellen.

Das System soll:

- GTFS-Realtime-Daten über die Schweizer Open-Data-Plattform beziehen.
- Die Fahrten der Trams und Busse im Berner Verkehrsnetz erkennen.
- Anhand der Fahrplan- und Echtzeitdaten die wahrscheinlichen Fahrzeugpositionen bestimmen.
- Die Positionen den Haltestellen und LEDs auf dem Board zuordnen.
- Alle 30 Sekunden die Daten aktualisieren.
- Die aktuellen LED-Zustände über einen REST-Endpunkt bereitstellen.
- Auch bei kurzfristigen API-Ausfällen stabil funktionieren.

**Wichtig:** Für den vorgesehenen GTFS-Realtime-Datenfluss werden keine direkten GPS-Positionen vorausgesetzt. Die Fahrzeugpositionen werden anhand der verfügbaren Fahrplandaten und Echtzeitprognosen geschätzt und sind keine exakten Standortangaben.

## Technologien

| Technologie | Verwendung | Stand |
|---|---|---|
| NestJS | Backend-Framework | Eingerichtet |
| TypeScript | Programmiersprache | Eingerichtet |
| GTFS-Realtime | Öffentliche Verkehrsdaten | Geplant |
| Protocol Buffers | Dekodierung der GTFS-Realtime-Daten | Geplant |
| REST-API | Kommunikation mit dem Board | Endpunkte geplant |
| Scheduler | Automatische Aktualisierung | Modulgerüst vorhanden |
| In-Memory-Cache | Zwischenspeicherung der Daten | Geplant |
| Mikrocontroller | Steuerung der LEDs | Hardware-Anbindung geplant |

## Geplante Funktionsweise

1. Das NestJS-Backend ruft alle 30 Sekunden die GTFS-Realtime-Daten ab.
2. Der `TransportService` verarbeitet die empfangenen Fahrten, Haltestellen und Echtzeitprognosen.
3. Der `VehiclesService` berechnet, wo sich die Fahrzeuge wahrscheinlich befinden.
4. Der `BoardService` ordnet die Fahrzeugpositionen den einzelnen LEDs zu.
5. Der aktuelle LED-Zustand wird im Backend zwischengespeichert.
6. Der Mikrocontroller fragt alle 30 Sekunden den Endpunkt `/board/leds` ab und aktualisiert die Beleuchtung.

Bei kurzfristigen API-Ausfällen soll der letzte erfolgreiche Datenstand erhalten bleiben. Der Status-Endpunkt soll erkennen lassen, wann die Daten zuletzt erfolgreich aktualisiert wurden und ob sie veraltet sind. Ein In-Memory-Cache bleibt bei einem Neustart nicht erhalten.

## Backend-Architektur

### TransportModule

Verantwortlich für die Verbindung zur GTFS-Realtime-API, das Herunterladen und Dekodieren der Daten sowie die Aufbereitung der relevanten Fahrten.

### VehiclesModule

Analysiert die Fahrten und schätzt anhand der Ankunfts- und Abfahrtszeiten die Position der Trams und Busse.

### BoardModule

Verwaltet die Haltestellen und deren LED-Zuordnungen. Stellt REST-Endpunkte bereit, über welche der Mikrocontroller die aktuellen Zustände abfragen kann.

### SchedulerModule

Koordiniert die automatische Aktualisierung alle 30 Sekunden und die Verwaltung des letzten erfolgreichen Datenstands.

### Projektstruktur

```text
src/
├── main.ts
├── app.module.ts
├── app.controller.ts          # NestJS-Standardendpunkt
├── app.controller.spec.ts
├── app.service.ts
├── transport/
│   ├── transport.module.ts
│   ├── transport.service.ts
│   ├── transport.types.ts
│   └── transport.constants.ts
├── vehicles/
│   ├── vehicles.module.ts
│   ├── vehicles.service.ts
│   └── vehicles.types.ts
├── board/
│   ├── board.module.ts
│   ├── board.controller.ts
│   ├── board.service.ts
│   ├── board.types.ts
│   └── board-stops.ts
└── scheduler/
    ├── scheduler.module.ts
    └── scheduler.service.ts
```

## Geplante REST-API

Die folgenden Endpunkte sind noch nicht implementiert:

| Endpoint | Beschreibung |
|---|---|
| `GET /board/leds` | Aktuelle LED-Zustände |
| `GET /board/stops` | Konfigurierte Haltestellen |
| `GET /board/status` | Aktualisierungs- und API-Status |
| `GET /vehicles` | Geschätzte Fahrzeugpositionen |

Aktuell liefert der NestJS-Standardendpunkt `GET /` die Antwort `Hello World!`.

## Installation und Start

### Voraussetzungen

- Node.js 24 LTS ab Version 24.15.0 empfohlen.
- npm.
- Für die spätere Datenanbindung: Zugang zur gewählten Schweizer Open-Data-API und gegebenenfalls ein API-Schlüssel.

### Abhängigkeiten installieren

```bash
npm ci
```

### Entwicklungsserver starten

```bash
npm run start:dev
```

Das Backend ist standardmässig unter `http://localhost:3000` erreichbar. Über die Umgebungsvariable `PORT` kann ein anderer Port gewählt werden:

```bash
PORT=3001 npm run start:dev
```

### Produktionsbuild

```bash
npm run build
npm run start:prod
```

### Tests und Codequalität

```bash
# Unit-Tests
npm test

# End-to-End-Tests
npm run test:e2e

# Testabdeckung
npm run test:cov

# Linting
npm run lint

# Formatierung
npm run format
```

## Noch offene Einrichtung

- Konkreten GTFS-Realtime-Feed und dessen Zugangsbedingungen festlegen.
- Benötigte Fahrplan- und Haltestellenreferenzen für die Positionsschätzung bestimmen.
- API-Konfiguration und gegebenenfalls sichere Verwaltung des API-Schlüssels ergänzen.
- Protocol-Buffers-Dekodierung und Filterung auf das Berner Verkehrsnetz implementieren.
- Positionsschätzung sowie Haltestellen- und LED-Zuordnungen definieren.
- Scheduler, Cache und Fehlerbehandlung implementieren.
- REST-Endpunkte und zugehörige Tests ergänzen.

## Geplante Erweiterungen

- Unterschiedliche LED-Farben für Tram und Bus.
- Erkennung von Verspätungen und Ausfällen.
- Web-Dashboard zur Überwachung des Boards und des Backend-Status.
