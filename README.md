
# Ettevõtlikkuse pass

Veebipõhine platvorm noortele oma ettevõtlike kogemuste kogumiseks, haldamiseks ja analüüsimiseks.

---

## Ülevaade

Ettevõtlikkuse pass on full-stack veebirakendus, mille eesmärk on võimaldada kasutajatel koguda, struktureerida ja esitleda oma ettevõtlikke kogemusi.

Rakendus toetab:

* kogemuste lisamist ja haldamist
* refleksiooni ja eneseanalüüsi
* tõendusmaterjalide lisamist
* kogemuste kinnitamist

Süsteem koosneb frontendist, backendist ja andmebaasist.

---

## Tehnoloogiad

### Frontend

* React (Vite)
* React Router
* Tailwind CSS
* Google OAuth (@react-oauth/google)

### Backend

* Node.js
* Express
* Sequelize ORM
* MySQL
* JWT autentimine
* bcrypt (paroolide hashimine)
* multer (failide üleslaadimine)
* nodemailer (e-mailid)
* Swagger (API dokumentatsioon)

---

## Arhitektuur

```
Frontend (React)
      ↓
Backend (Express REST API)
      ↓
Database (MySQL + Sequelize)
```

---

## Andmebaas

Projekt kasutab MySQL andmebaasi koos Sequelize ORM-iga.

### Peamised mudelid

* User
* Experience
* Category
* Reflection
* Proof
* Approver

### Tabelite loomine

```
node sync.js
```

NB:
`sync.js` kasutab `force: true`, mis kustutab olemasolevad tabelid.

---

## Backend

Backend on üles ehitatud Expressi peale ning kasutab REST API arhitektuuri.

### Routerid

* userRouter
* adminRouter
* experienceRouter
* categoryRouter
* reflectionRouter
* statisticsRouter

Kõik endpointid on prefiksiga:

```
/api
```

### Näited endpointidest(ülejäänud on olemas Swaggeris)

```
POST /api/user/register
POST /api/user/login
GET  /api/user/profile

POST /api/experience/add
GET  /api/experiences

POST /api/category
GET  /api/categories
```

---

## API dokumentatsioon (Swagger)

Swagger UI on saadaval:

```
http://localhost:3005/api-docs
```

---

## Frontend

Frontend on loodud Reacti ja Vite abil.

### Routing

* `/` – avaleht
* `/login` – sisselogimine
* `/register` – registreerimine
* `/mina/pass` – kasutaja pass
* `/mina/tegevused` – kogemuste vaade
* `/mina/tegevused/lisa` – kogemuse lisamine
* `/approve/:token` – kogemuse kinnitamine

### Google OAuth

Kasuta `.env` faili:

```
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=secret
```

---

## Paigaldamine

### 1. Klooni repo

```
git clone https://github.com/F1Zuwu/ettevotlikuse-pass
cd ettevotlikuse-pass
```

---

### 2. Backend

```
cd backend
npm install
```

Loo `.env` fail:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=ettevotlikkuse_pass
JWT_SECRET=your_secret

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=secret

TELIA_EMAIL="email"
TELIA_PASSWORD="password"
```

Käivita server:

```
node app.js
```

---

### 3. Andmebaas

Loo andmebaas:

```
CREATE DATABASE ettevotlikkuse_pass;
```

Seejärel:

```
node sync.js
```

---

### 4. Frontend

```
cd frontend
npm install
npm run dev
```

Frontend töötab:

```
http://localhost:5173
```

---

## Failide üleslaadimine

Failid salvestatakse kausta:

```
/uploads
```

Kättesaadav:

```
http://localhost:3005/uploads/<filename>
```

---

## Turvalisus

* Paroolid hashitakse (bcrypt)
* JWT autentimine
* Google OAuth
* CORS middleware
* .env


---

## Tuleviku arendus

* PDF eksport
* statistika laiendamine
* parem valideerimine
* admin paneel
* UI/UX täiustused

---

## Märkused

* `sync.js` kustutab andmed (`force: true`)
* `.env` faili ei tohi GitHubi lisada

---

## Autorid

Raimo Kivi, Angela Roosmägi, Kristelle Tasane

---



