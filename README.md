# 📚 ObminBook

**ObminBook** — це веб-платформа для обміну книгами між користувачами. Ви можете знаходити книги, які хочете прочитати, пропонувати свої, домовлятися про обмін та вести переписку з іншими учасниками.

## 🔗 Demo

[obminbook.ua]([https://obminbook.ua](https://obminbook.netlify.app/search))

---

## 🛠 Технології

- **Frontend:** React, TypeScript, SCSS / CSS Modules, BEM methodology
- **Backend:** Node.js, Express *(опціонально уточнити)*
- **Database:** MongoDB / PostgreSQL *(вказати реальне)*
- **State management:** React Context / Redux *(вказати точне)*
- **Routing:** React Router
- **Forms:** React Hook Form / Formik
- **Other:** Cypress (тестування), Lazy loading, Debounce

---

## 🚀 Основні функції

- 🔍 Пошук і фільтрація книг за жанром, станом, форматом обміну
- 🔄 Обмін книгами між користувачами з підтвердженням на кожному етапі
- 💬 Особисті повідомлення
- 👤 Профіль користувача з власними книгами
- 📦 Система балів за обміни (гейміфікація)
- 🛡 Механізм підтвердження відправки та отримання книги
- 🌐 Збереження фільтрів через URL (query params)
- 📱 Адаптивний інтерфейс

---

## 🧠 Механіка обміну

1. Користувач надсилає запит на обмін
2. Інший користувач підтверджує
3. Обидва надсилають свої книги та підтверджують це
4. Після отримання книги — фінальне підтвердження
5. Система нараховує бали

---

## 🔧 Локальний запуск

```bash
git clone https://github.com/your-username/obminbook.git
cd obminbook
npm install
npm run dev
