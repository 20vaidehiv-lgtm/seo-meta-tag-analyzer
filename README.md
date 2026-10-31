<div align="center">

# 🔍 SEO Meta Tag Analyzer

### Understand Your Website's SEO. Visualize. Analyze. Improve.

A smart, interactive SEO analysis tool that extracts website metadata, identifies missing SEO tags, generates an SEO score out of 100, and provides realistic Google Search and social media previews.

<br/>

![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Built With](https://img.shields.io/badge/Built%20With-AI%20Assistance-purple?style=for-the-badge)

<br/>

**Enter a URL. Analyze its SEO. See what needs improvement.**

</div>

---

## 🌐 About The Project

SEO Meta Tag Analyzer is a web-based tool designed to simplify website SEO analysis.

Instead of manually inspecting HTML source code or switching between multiple SEO tools, users can simply enter a website URL and get a visual breakdown of its SEO implementation.

The application fetches the website's HTML, extracts important metadata, evaluates its implementation, and provides actionable suggestions for improvement.

It also generates visual previews to demonstrate how a website could appear on Google Search and different social media platforms.

**The goal is simple:** Make SEO analysis accessible, understandable, and visual — even for beginners.

---

## ✨ Features

### 🔎 1. Website SEO Analysis

* Enter any accessible website URL.
* Fetch and analyze actual website HTML.
* Automatically extract important SEO metadata.
* Identify missing, duplicate, and potentially incorrect tags.

### 📊 2. SEO Score (Out of 100)

* Get an overall SEO implementation score.
* Visual circular progress indicator.
* Color-coded performance indicators.
* Detailed breakdown of individual SEO checks.
* Suggestions to improve the score.

### 🏷️ 3. Meta Tag Detection

Analyze important metadata, including:

| Category              | Tags                                                            |
| --------------------- | --------------------------------------------------------------- |
| Basic SEO             | Title, Meta Description, Keywords                               |
| Website Configuration | Canonical URL, Robots, Viewport                                 |
| Open Graph            | og:title, og:description, og:image, og:url                      |
| Twitter Cards         | twitter:card, twitter:title, twitter:description, twitter:image |

### 🎨 4. Visual SEO Feedback

Understand your website's SEO status through color-coded indicators.

* 🟢 Green – Good
* 🟡 Yellow – Needs Improvement
* 🔴 Red – Missing or Incorrect
* ⚪ Grey – Optional or Not Applicable

### 🔍 5. Google Search Preview

Visualize how your website could appear in Google Search results.

Displays:

* Website name and URL.
* Page title.
* Meta description.
* Favicon (if available).

### 📱 6. Social Media Previews

Preview how your website links may appear when shared across:

* Facebook
* LinkedIn
* Twitter/X

Uses actual Open Graph and Twitter Card metadata.

### 💡 7. SEO Recommendations

Receive actionable suggestions based on detected metadata issues.

Understand:

* What's missing?
* Why does it matter?
* How can it be improved?

### ⚡ 8. Additional Features

* Interactive metadata cards.
* Detailed tag information.
* Copy metadata functionality.
* Raw HTML head section viewer.
* Light and dark mode.
* Responsive dashboard.

---

## 🛠️ Tech Stack

| Technology   | Purpose                              |
| ------------ | ------------------------------------ |
| React.js     | Frontend development                 |
| HTML5        | Application structure                |
| CSS3         | Styling and responsive design        |
| JavaScript   | Application logic                    |
| Node.js      | Backend runtime                      |
| Express.js   | Backend API                          |
| Axios        | Fetching website HTML                |
| Cheerio      | HTML parsing and metadata extraction |
| Lucide React | Icons                                |

---

## ⚙️ How It Works

The application follows a simple workflow:

```text
       USER ENTERS WEBSITE URL
                 |
                 ▼
          URL VALIDATION
                 |
                 ▼
       BACKEND FETCHES HTML
                 |
                 ▼
       HTML PARSING (CHEERIO)
                 |
                 ▼
       SEO METADATA EXTRACTION
                 |
                 ▼
          SEO ANALYSIS
                 |
          ┌──────┴──────┐
          ▼             ▼
      SEO SCORE    RECOMMENDATIONS
          |             |
          └──────┬──────┘
                 |
                 ▼
          VISUAL DASHBOARD
                 |
       ┌─────────┼──────────┐
       ▼         ▼          ▼
     GOOGLE   FACEBOOK   TWITTER/X
    PREVIEW   LINKEDIN    PREVIEW
```

---

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd seo-meta-analyzer
```

### 3. Install Dependencies

Install the frontend and backend dependencies separately according to their respective `package.json` files.

```bash
cd frontend
npm install
```

```bash
cd ../backend
npm install
```

### 4. Start the Application

Start the backend:

```bash
cd backend
npm start
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open the local URL displayed by the frontend development server.

*Note: Update these commands if your actual Replit-generated project uses a different folder structure or startup script.*

---

## 📸 Screenshots

Add screenshots of your application here.

### Homepage

<!-- Add homepage screenshot here -->

### SEO Analysis Dashboard

<!-- Add dashboard screenshot here -->

### Google Search Preview

<!-- Add Google preview screenshot here -->

### Social Media Preview

<!-- Add social media preview screenshot here -->

---

## 🎯 Project Goals

This project aims to:

* Simplify the process of checking website SEO metadata.
* Help beginners understand SEO implementation.
* Provide actionable feedback through visual indicators.
* Demonstrate how frontend and backend technologies work together.
* Explore HTML parsing and API integration.
* Build a practical developer tool.

---

## 🔮 Future Scope

Potential improvements for future versions:

* PDF SEO report generation.
* Compare SEO metadata across multiple websites.
* Advanced SEO validation.
* More detailed metadata recommendations.
* Additional search engine preview options.

---

## ⚠️ Important Notes

* SEO scores represent the application's own metadata checks, not actual Google ranking positions.
* Search engine previews are approximations. Google may generate different titles and descriptions.
* Analysis depends on whether the target website allows automated HTML requests.
* Some websites may block automated requests or dynamically generate metadata using JavaScript.
* The tool does not directly modify the analyzed website.

---

Built with curiosity, creativity, and a little help from AI. 💜

---

