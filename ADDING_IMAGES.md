# Adding Star Wars Images to Your App

## Overview

Your app now supports displaying images for all Star Wars resources! Images are loaded from the `/public/images` directory.

## Quick Start

1. **Find official Star Wars images** from legal sources (see recommendations below)
2. **Download and rename** images using SWAPI IDs (1-based)
3. **Place in appropriate folders**:
   ```
   public/images/
   ├── characters/1.jpg  (Luke Skywalker)
   ├── planets/1.jpg     (Tatooine)
   ├── films/1.jpg       (A New Hope poster)
   └── starships/2.jpg   (CR90 Corvette)
   ```
4. **Refresh your app** - images will display automatically!

## Recommended Image Sources

### 1. Wookieepedia (Best for Characters & Planets)

- URL: https://starwars.fandom.com
- High-quality official images
- Right-click infobox images → "Save image as..."
- Example: Search "Luke Skywalker" → download portrait

### 2. Star Wars Official Website

- URL: https://www.starwars.com/databank
- Official character/planet/ship profiles
- Check image usage terms

### 3. The Movie Database (Best for Film Posters)

- URL: https://www.themoviedb.org
- High-res movie posters
- Search "Star Wars" → download poster

### 4. IMDb (Film Posters)

- URL: https://www.imdb.com
- Official movie posters
- Search film → click poster → download

## SWAPI ID Reference

### Priority Characters (people)

| ID  | Name           | SWAPI URL                        |
| --- | -------------- | -------------------------------- |
| 1   | Luke Skywalker | https://swapi.dev/api/people/1/  |
| 2   | C-3PO          | https://swapi.dev/api/people/2/  |
| 3   | R2-D2          | https://swapi.dev/api/people/3/  |
| 4   | Darth Vader    | https://swapi.dev/api/people/4/  |
| 5   | Leia Organa    | https://swapi.dev/api/people/5/  |
| 10  | Obi-Wan Kenobi | https://swapi.dev/api/people/10/ |
| 13  | Chewbacca      | https://swapi.dev/api/people/13/ |
| 14  | Han Solo       | https://swapi.dev/api/people/14/ |
| 20  | Yoda           | https://swapi.dev/api/people/20/ |
| 21  | Palpatine      | https://swapi.dev/api/people/21/ |

### Films

| ID  | Title                   | SWAPI URL                      |
| --- | ----------------------- | ------------------------------ |
| 1   | A New Hope              | https://swapi.dev/api/films/1/ |
| 2   | The Empire Strikes Back | https://swapi.dev/api/films/2/ |
| 3   | Return of the Jedi      | https://swapi.dev/api/films/3/ |
| 4   | The Phantom Menace      | https://swapi.dev/api/films/4/ |
| 5   | Attack of the Clones    | https://swapi.dev/api/films/5/ |
| 6   | Revenge of the Sith     | https://swapi.dev/api/films/6/ |

### Planets

| ID  | Name      | SWAPI URL                         |
| --- | --------- | --------------------------------- |
| 1   | Tatooine  | https://swapi.dev/api/planets/1/  |
| 2   | Alderaan  | https://swapi.dev/api/planets/2/  |
| 8   | Naboo     | https://swapi.dev/api/planets/8/  |
| 9   | Coruscant | https://swapi.dev/api/planets/9/  |
| 14  | Kashyyyk  | https://swapi.dev/api/planets/14/ |

### Starships

| ID  | Name              | SWAPI URL                           |
| --- | ----------------- | ----------------------------------- |
| 2   | CR90 corvette     | https://swapi.dev/api/starships/2/  |
| 3   | Star Destroyer    | https://swapi.dev/api/starships/3/  |
| 9   | Death Star        | https://swapi.dev/api/starships/9/  |
| 10  | Millennium Falcon | https://swapi.dev/api/starships/10/ |
| 12  | X-wing            | https://swapi.dev/api/starships/12/ |

## Image Specifications

- **Format**: JPG or PNG (JPG preferred for smaller file size)
- **Dimensions**:
  - Characters/Posters: 400x600px (portrait)
  - Planets/Ships: 800x600px (landscape) or 600x600px (square)
- **File Size**: Keep under 200KB for faster loading
- **Quality**: Balance between clarity and file size

## Step-by-Step Example: Adding Luke Skywalker

1. Go to https://starwars.fandom.com/wiki/Luke_Skywalker
2. Right-click the portrait image → "Save image as..."
3. Save to your Downloads folder
4. Rename file to `1.jpg` (Luke's SWAPI ID is 1)
5. Move to: `public/images/characters/1.jpg`
6. Refresh your app → Luke's image appears!

## Batch Download Script (Advanced)

Create a simple script to download multiple images:

```bash
#!/bin/bash
# download-images.sh

# Example: Download from URLs (you'll need to populate these)
wget -O public/images/characters/1.jpg "YOUR_IMAGE_URL_HERE"
wget -O public/images/characters/4.jpg "YOUR_IMAGE_URL_HERE"
# ... add more
```

## Troubleshooting

### Image not showing?

1. Check filename matches SWAPI ID (1-based, not 0-based)
2. Verify file extension (.jpg or .png)
3. Check browser console for 404 errors
4. Clear browser cache (Cmd+Shift+R on Mac)

### Image too large/small?

1. Use an image editor or online tool to resize
2. Recommended: https://squoosh.app for compression

### Wrong image displaying?

1. Double-check SWAPI ID:
   - App uses 0-based routing (/people/0)
   - Files use 1-based IDs (1.jpg)
   - The app converts automatically

## Fallback Behavior

If an image file is missing, the app will display:

- A placeholder SVG with "Star Wars - Image Not Available"
- The resource name will still appear
- Voting and trivia features work normally

## Legal & Copyright

⚠️ **Important**:

- Star Wars images are copyrighted by Lucasfilm/Disney
- Use images under **fair use** for personal/educational projects only
- Do NOT use commercially or redistribute
- Consider using Creative Commons licensed fan art
- When in doubt, create original artwork or use placeholders

## Full SWAPI ID Lists

To find all IDs:

- **People**: 82 total (IDs 1-87 with gaps)
- **Planets**: 60 total (IDs 1-61 with gaps)
- **Films**: 6 total (IDs 1-6)
- **Starships**: 36 total (IDs 2-75 with gaps)

Query SWAPI directly to see all resources:

```bash
curl https://swapi.dev/api/people/
curl https://swapi.dev/api/planets/
curl https://swapi.dev/api/films/
curl https://swapi.dev/api/starships/
```

## Tips for Best Results

1. **Start with main characters**: Luke, Vader, Leia, Han, Yoda
2. **Add film posters next**: These are easiest to find
3. **Use consistent aspect ratios**: Keeps grid looking clean
4. **Optimize file sizes**: Use tools like ImageOptim or TinyPNG
5. **Credit your sources**: Add attribution in IMAGE_SOURCES.md

Happy image hunting! May the Force be with you! 🌟
