# Zootopia City Guide Template

**Final project for CSCI250** – An interactive, responsive website that serves as a comprehensive city guide and watch night planner for the Disney movie *Zootopia*. This project showcases the application of modern web design principles to deliver an engaging user experience.

## Overview

This project reimagines the vibrant world of Zootopia as an online city guide. It invites visitors to explore key districts, characters and standout scenes while planning a themed movie watch night. The site is fully responsive and built with semantic HTML, custom CSS and a touch of JavaScript for form handling.

## Features

- **Hero section & highlights** – Introduces users to the theme and provides quick stats about the movie and its world.
- **District overview** – Summarises the different regions of Zootopia such as Savannah Central, Tundratown and the Rainforest District.
- **Scenes to rewatch** – Curated cards with descriptions of notable scenes to revisit during your watch party.
- **Character profiles** – Spotlight key characters like Judy Hopps, Nick Wilde and Chief Bogo with custom illustrations and descriptions.
- **Tour planner** – Guides users through planning a Zootopia‑themed watch night, with suggestions on districts, soundtrack cues and character pairings.
- **Backstage insights** – Offers behind‑the‑scenes trivia on the film’s production, world‑building and design details.
- **FAQ & contact form** – Provides answers to common questions and includes a contact/feedback form powered by a simple PHP endpoint (`submit.php`).

## Technology stack

- **HTML** – Semantic markup for accessible content structure
- **CSS** – Custom styles with responsive layouts, animations and utility classes
- **JavaScript** – Basic DOM manipulation and form submission handling in `script.js`
- **PHP** – Minimal backend in `submit.php` to handle form data
- **Assets** – Custom illustrations and icons stored in the `images/` directory

## Getting started

1. **Clone the repository** and rename it to match your needs (e.g. `zootopia-city-guide-template`).
2. Open `index.html` in your browser to explore the site locally. A local HTTP server (e.g. `python3 -m http.server`) is recommended to avoid CORS issues.
3. For full functionality of the contact form, ensure you have a PHP server running and that `submit.php` is configured to accept and process JSON payloads.

```
# start a simple HTTP server (Python 3)
python3 -m http.server 8080
# or use PHP’s built‑in server
php -S localhost:8080
```

4. Navigate to `http://localhost:8080` in your browser and explore!

## Project structure

```text
.
├─ login/            # login page assets (renamed from `LoginPage` to `login` in the final version)
├─ images/           # logos, scene thumbnails and character illustrations
├─ index.html        # main landing page
├─ script.js         # JavaScript for client‑side interactivity
├─ styles.css        # main stylesheet
├─ submit.php        # PHP endpoint to handle form submissions
└─ README.md         # project documentation (this file)
```

## Contribution

This repository was created as a final project for the **CSCI250** course. Feel free to fork, clone and adapt it for your own web‑design experiments or movie‑watch nights. If you have suggestions or improvements, open an issue or pull request.

## License

This project is released under the MIT License. See the [LICENSE](LICENSE) file for details.
