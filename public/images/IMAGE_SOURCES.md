# Star Wars Image Sources

This directory contains images for all SWAPI resource types.

## Directory Structure

```
/images
├── characters/   # Character portraits (people)
├── planets/      # Planet images
├── films/        # Movie posters
├── starships/    # Starship images
└── placeholder.jpg  # Generic fallback
```

## Naming Convention

Images are named using **1-based IDs** matching SWAPI resource IDs:

- `characters/1.jpg` = Luke Skywalker (SWAPI people/1)
- `planets/1.jpg` = Tatooine (SWAPI planets/1)
- `films/1.jpg` = A New Hope (SWAPI films/1)
- `starships/2.jpg` = CR90 corvette (SWAPI starships/2)

## How to Add Images

### Recommended Sources for Official Star Wars Images

1. **Wookieepedia** (https://starwars.fandom.com)

   - High-quality images
   - Check image licensing (fair use for personal/educational projects)
   - Download infobox images for characters/planets/ships

2. **Official Star Wars Website** (https://www.starwars.com)

   - Official promotional materials
   - Check terms of use

3. **Movie Poster Database** (for films)
   - TheMovieDB (https://www.themoviedb.org)
   - IMDb (https://www.imdb.com)

### Image Specifications

- **Format**: JPG (preferred for photos) or PNG (for transparency)
- **Size**: 400x600px recommended for characters/posters, 800x600px for planets/ships
- **Quality**: Balance between file size (<200KB) and visual quality

### Adding Images

1. Download image from source
2. Rename to match SWAPI ID: `{id}.jpg` (1-based)
3. Place in appropriate folder:

   ```bash
   # Character image for Luke Skywalker (people/1)
   public/images/characters/1.jpg

   # Planet image for Tatooine (planets/1)
   public/images/planets/1.jpg
   ```

4. Verify image displays correctly in app

### Creating Placeholders

For missing images, you can create simple placeholders:

**Option A**: Use colored backgrounds with text

```bash
convert -size 400x600 -background '#1a1a1a' -fill white \
  -gravity center -pointsize 36 label:"Character\nImage" \
  characters/placeholder.jpg
```

**Option B**: Download placeholder services

- https://placehold.co/400x600/1a1a1a/white?text=Star+Wars

## Character IDs (people)

Key characters to prioritize:

- 1: Luke Skywalker
- 2: C-3PO
- 3: R2-D2
- 4: Darth Vader
- 5: Leia Organa
- 10: Obi-Wan Kenobi
- 13: Chewbacca
- 14: Han Solo
- 20: Yoda
- 21: Palpatine

## Planet IDs

- 1: Tatooine
- 2: Alderaan
- 8: Naboo
- 9: Coruscant
- 14: Kashyyyk

## Film IDs

- 1: A New Hope
- 2: The Empire Strikes Back
- 3: Return of the Jedi
- 4: The Phantom Menace
- 5: Attack of the Clones
- 6: Revenge of the Sith

## Starship IDs

- 2: CR90 corvette
- 3: Star Destroyer
- 9: Death Star
- 10: Millennium Falcon
- 11: Y-wing
- 12: X-wing

## Legal Notes

- This is a personal/educational project
- Images should be used under fair use principles
- Do not redistribute or use commercially
- Credit sources where appropriate
- Consider creating original artwork or using Creative Commons licensed images

## Automation Script

To batch download images, you can use the provided script (requires manual URL mapping):

```bash
# See scripts/download-images.sh
npm run download-images
```
