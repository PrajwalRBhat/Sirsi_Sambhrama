# Sirsi Sambhrama - Dynamic News & Media Hub 📰

Sirsi Sambhrama is a full-featured, dynamic digital news platform designed to bring real-time updates to the local community and built to provide fast, reliable, and real-time updates for the local community. This project focuses on a clean reading experience, a dynamic news grid, and an efficient advertisement delivery system as well as seamless data synchronization, optimized asset delivery, and a high-end user experience.

### 🌐 [**Live Site: View Sirsi Sambhrama**](https://gleaming-gecko-37e30f.netlify.app/)

---

## 🏗️ Technical Architecture Overview

The project is built on a **Decoupled Architecture** where the frontend is a high-performance static layer and the backend is a managed PostgreSQL instance via Supabase.

### 1. Dynamic Content Management System (CMS)
Uses dynamic fetching to pull the latest news directly from a live database. 
- **Asynchronous Fetching:** Uses the `fetch` API with `async/await` to pull the latest news articles without blocking the UI.
- **Category Filtering:** A robust filtering system that re-renders the news grid based on categories (Local, Sports, etc.) without reloading the page.
- **Relational Data:** News items are linked to categories and images, allowing for a scalable content structure.

### 2. The "Rolling Ad" Engine (`promo.js`)
One of the most complex parts of the project is the custom-built advertisement rotation system.
- **Unique Pick Algorithm:** The engine ensures that when an ad rotates, it never picks the one currently on screen. It filters the available pool in real-time before selecting a replacement.
- **Responsive Layouts:** The system detects if an ad slot is a horizontal banner or a sidebar square and fetches the appropriate aspect ratio from the database.

### 3. Responsive UI/UX Design
The interface was engineered to be "Mobile-First."
- **Breaking News Ticker:** A specialized horizontal scroll for breaking news updates.
- **Grid System:** A CSS Grid-based layout that shifts from a 3-column desktop view to a single-column mobile view seamlessly.
- **Interactive Elements:** Relational links that allow users to click into full article views, fetching specific data based on URL parameters.

---


## 🔧 Installation & Local Development

To set up a local development environment that mirrors the production site:

1. **Clone the project:**
   ```bash
   git clone [https://github.com/PrajwalRBhat/Sirsi_Sambhrama.git](https://github.com/PrajwalRBhat/Sirsi_Sambhrama.git)
   
2. **Configure Your Environment**
   Because the config.js file is hidden for security, you must create a local version:

   Create a new file named config.js in the main folder.

   Copy the structure from config.template.js into your new file.

   Replace the placeholders with your actual Supabase URL and Anon Key.

3. **Database Connection**
   Ensure your Supabase tables (News_Articles and Advertisements) are properly set up and populated with data to see the dynamic content.

4. **Launch the Site**
   To avoid browser security restrictions (CORS), run the site through a local server:

   VS Code: Right-click index.html and select "Open with Live Server".

   Alternatively, use any local hosting tool of your choice.