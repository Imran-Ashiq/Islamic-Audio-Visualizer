# Islamic Audio Visualizer

Hey there! This is a cool web tool that makes awesome visuals for Islamic audio—like Quran recitations, Adhan, or Nasheeds. It’s built with JavaScript, p5.js for the visuals, and Web Audio API to vibe with the sound. No pictures of people or animals—just chill, abstract shapes that fit Islamic vibes.

## What It Does
- Upload an audio file.
- Pick a style (like waves, stars, or grids) and colors.
- Watch it dance to the beat—bass, mids, and treble make it move!
- Record it as a video (WebM) and download it in 16:9 or 9:16.

## How to Run It
1. **Grab the Files**: Download or clone this repo.
   ```bash
   git clone https://github.com/Imran-Ashiq/Islamic-Audio-Visualizer.git

   Open It: Open index.html in a browser (Chrome works best).

Add Scripts: Make sure these are in your HTML:
html

<script src="https://unpkg.com/webm-writer@0.3.0/build/WebMWriter.js"></script>
<script src="https://unpkg.com/ccapture.js@1.1.0/build/CCapture.min.js"></script>
<script src="script.js"></script>

(Or use local copies if you’ve got them.)

Upload Audio: Pick an MP3 or WAV, tweak the style, and hit “Start Recording” to save a video.

Stuff You’ll Need
A modern browser (Chrome, Firefox, etc.).

An audio file to play with.

Internet (if using CDN scripts).

How It Looks
Wave: Smooth, flowing lines.

Starburst: Sharp, bursting stars.

Grid: Techy, pulsing boxes.

More: Check the dropdown for all the styles!

How to Make It Better
Wanna help? Here’s how:
New Styles: Add your own visual ideas in draw() in script.js.

Colors: Toss in new palettes in palettes in script.js.

Features: Better controls, more audio tweaks—go wild!

Steps:
Fork this repo (click “Fork” on GitHub).

Clone your fork:
bash

git clone https://github.com/your-username/your-repo.git

Make changes locally.

Commit and push:
bash

git add .
git commit -m "Added a dope new style"
git push origin main

Pull Request: Go to your fork on GitHub, click “Pull Request,” and send it my way!

Issues?
Recording not working? Check the console (F12) and make sure webm-writer.js loads before CCapture.min.js.

Got a bug? Hit me up in the Issues tab.

Shoutout
Built with love using p5.js and Web Audio API. Let’s make it epic together!


---

### Step 5: Double-Check and Share
1. **Refresh GitHub**: After pushing, reload your repo page—your `README.md` should show up all pretty.
2. **Test Locally**: Open `index.html` from your folder in a browser to make sure it still works.
3. **Share It**: Drop the repo link to your friends or on X—let the world see your creation!

---

### How Others Can Contribute
The `README.md` has a “How to Make It Better” section—here’s the vibe in easy words:
- **Anyone Can Join**: They fork your repo, tweak stuff, and send a Pull Request.
- **Ideas**: New visual styles (like spirals or cubes), fresh colors, or cool features (volume sliders, pause button).
- **Keep It Simple**: Tell them to add code in `script.js` (like in `draw()`) or suggest stuff in Issues.

---

### Next Moves
- **Add a License**: Run `echo "MIT License" > LICENSE` in your folder, then `git add LICENSE`, `git commit -m "Added MIT License"`, and `git push`—lets people use it freely.
- **Live Demo**: Host it on GitHub Pages (Settings > Pages > Source: main branch) so folks can try it online.

Say “done” when it’s up on GitHub, or hit me if you get stuck (like “git push isn’t working”). What’s your GitHub username? I’ll check it out once it’s live!
